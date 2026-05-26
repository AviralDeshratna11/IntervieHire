'use client';

import { useEffect, useRef, useState } from 'react';
import {
  FaceLandmarker,
  FilesetResolver,
  ObjectDetector,
  type FaceLandmarkerResult,
  type ObjectDetectorResult,
} from '@mediapipe/tasks-vision';
import type { ProctoringPayload, Severity } from '@interviehire/shared';

type ProctoringEvent = {
  eventType: string;
  severity: Severity;
  timestamp: number;
  metadata?: Record<string, unknown>;
};

type DetectionState = {
  initialized: boolean;
  status: string;
  permissionDenied: boolean;
  cameraActive: boolean;
  faceDetectorActive: boolean;
  objectDetectorActive: boolean;
  faceCount: number;
  phoneDetected: boolean;
  gazeAwayDetected: boolean;
  gazeDirection: string;
  lastObservationAt: number | null;
};

const FACE_MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
const OBJECT_MODEL_URL = 'https://storage.googleapis.com/mediapipe-tasks/object_detector/efficientdet_lite0_uint8.tflite';
const ALERT_COOLDOWN_MS = 15000;
const NO_FACE_THRESHOLD_MS = 4000;
const LIVE_INTERVAL_MS = 1000;
const MULTI_FACE_CONFIRM_MS = 1500;
const PHONE_CONFIRM_MS = 1000;
const GAZE_CONFIRM_MS = 1200;
const GAZE_BLENDSHAPE_THRESHOLD = 0.65;
const GAZE_GEOMETRY_THRESHOLD_X = 0.18;
const GAZE_GEOMETRY_THRESHOLD_Y = 0.22;

function isPhoneDetection(result: ObjectDetectorResult) {
  return (result.detections || []).some((detection) =>
    (detection.categories || []).some((category) => {
      const name = (category.categoryName || category.displayName || '').toLowerCase();
      return name.includes('cell phone') || name.includes('mobile phone') || name.includes('phone');
    }),
  );
}

function latestDetectionScore(result: ObjectDetectorResult) {
  const topDetection = result.detections?.[0];
  const topCategory = topDetection?.categories?.[0];
  return topCategory?.score ?? 0;
}

function getFacePoint(landmarks: FaceLandmarkerResult['faceLandmarks'][number] | undefined, index: number) {
  return landmarks?.[index];
}

function detectGazeAway(result: FaceLandmarkerResult | null) {
  const faceLandmarks = result?.faceLandmarks?.[0];
  const faceBlendshapes = result?.faceBlendshapes?.[0]?.categories ?? [];

  const blendshapeNames = [
    'eyeLookUpLeft',
    'eyeLookUpRight',
    'eyeLookDownLeft',
    'eyeLookDownRight',
    'eyeLookOutLeft',
    'eyeLookOutRight',
    'eyeLookInLeft',
    'eyeLookInRight',
  ];

  const strongestBlendshape = blendshapeNames
    .map((name) => ({
      name,
      score: faceBlendshapes.find((category) => (category.categoryName || category.displayName || '').toLowerCase() === name.toLowerCase())?.score ?? 0,
    }))
    .sort((left, right) => right.score - left.score)[0];

  if (strongestBlendshape && strongestBlendshape.score >= GAZE_BLENDSHAPE_THRESHOLD) {
    return {
      away: true,
      direction: strongestBlendshape.name.replace('eyeLook', '').toLowerCase(),
      confidence: strongestBlendshape.score,
      source: 'blendshape' as const,
    };
  }

  const leftEye = getFacePoint(faceLandmarks, 33);
  const rightEye = getFacePoint(faceLandmarks, 263);
  const nose = getFacePoint(faceLandmarks, 1) || getFacePoint(faceLandmarks, 4);

  if (!leftEye || !rightEye || !nose) {
    return { away: false, direction: 'center', confidence: 0, source: 'geometry' as const };
  }

  const eyeCenterX = (leftEye.x + rightEye.x) / 2;
  const eyeCenterY = (leftEye.y + rightEye.y) / 2;
  const eyeDistance = Math.max(Math.abs(rightEye.x - leftEye.x), 0.0001);
  const offsetX = (nose.x - eyeCenterX) / eyeDistance;
  const offsetY = (nose.y - eyeCenterY) / eyeDistance;

  if (Math.abs(offsetX) >= GAZE_GEOMETRY_THRESHOLD_X || Math.abs(offsetY) >= GAZE_GEOMETRY_THRESHOLD_Y) {
    const horizontal = offsetX > 0 ? 'right' : 'left';
    const vertical = offsetY > 0 ? 'down' : 'up';
    const direction = Math.abs(offsetX) > Math.abs(offsetY) ? horizontal : vertical;
    return {
      away: true,
      direction,
      confidence: Math.max(Math.abs(offsetX), Math.abs(offsetY)),
      source: 'geometry' as const,
    };
  }

  return { away: false, direction: 'center', confidence: 0, source: 'geometry' as const };
}

export function useProctoring(sessionId: string, socket?: WebSocket | null) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [events, setEvents] = useState<ProctoringEvent[]>([]);
  const [state, setState] = useState<DetectionState>({
    initialized: false,
    status: 'Initializing camera...',
    permissionDenied: false,
    cameraActive: false,
    faceDetectorActive: false,
    objectDetectorActive: false,
    faceCount: 0,
    phoneDetected: false,
    gazeAwayDetected: false,
    gazeDirection: 'center',
    lastObservationAt: null,
  });
  const missingSince = useRef<number | null>(null);
  const faceAlertAt = useRef<number>(0);
  const phoneAlertAt = useRef<number>(0);
  const gazeAlertAt = useRef<number>(0);
  const multiFaceAlertAt = useRef<number>(0);
  const multiFaceSince = useRef<number | null>(null);
  const phoneSince = useRef<number | null>(null);
  const gazeSince = useRef<number | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const objectDetectorRef = useRef<ObjectDetector | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameTimerRef = useRef<number | null>(null);
  const aliveRef = useRef(true);

  function emit(eventType: string, severity: Severity, metadata: Record<string, unknown> = {}) {
    const payload: ProctoringPayload = { type: 'proctoring_event', sessionId, eventType, severity, metadata, timestamp: Date.now() };
    socket?.readyState === 1 && socket.send(JSON.stringify(payload));
    setEvents((current) => [{ eventType, severity, timestamp: Date.now(), metadata }, ...current].slice(0, 10));
  }

  function emitWithCooldown(ref: { current: number }, eventType: string, severity: Severity, metadata: Record<string, unknown> = {}) {
    const now = Date.now();
    if (now - ref.current < ALERT_COOLDOWN_MS) return;
    ref.current = now;
    emit(eventType, severity, metadata);
  }

  useEffect(() => {
    aliveRef.current = true;

    async function start() {
      setState({
        initialized: false,
        status: 'Requesting camera access...',
        permissionDenied: false,
        cameraActive: false,
        faceDetectorActive: false,
        objectDetectorActive: false,
        faceCount: 0,
        phoneDetected: false,
        gazeAwayDetected: false,
        gazeDirection: 'center',
        lastObservationAt: null,
      });

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;

      if (!aliveRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await video.play();
      }

      setState((current) => ({
        ...current,
        initialized: true,
        status: 'Detection active',
        permissionDenied: false,
        cameraActive: true,
      }));

      const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm');
      const [faceLandmarker, objectDetector] = await Promise.all([
        FaceLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: FACE_MODEL_URL },
          runningMode: 'VIDEO',
          numFaces: 4,
          minFaceDetectionConfidence: 0.55,
          minFacePresenceConfidence: 0.55,
          minTrackingConfidence: 0.55,
          outputFaceBlendshapes: true,
        }),
        ObjectDetector.createFromOptions(vision, {
          baseOptions: { modelAssetPath: OBJECT_MODEL_URL },
          runningMode: 'VIDEO',
          scoreThreshold: 0.5,
          maxResults: 5,
        }),
      ]);

      faceLandmarkerRef.current = faceLandmarker;
      objectDetectorRef.current = objectDetector;

      setState((current) => ({
        ...current,
        faceDetectorActive: true,
        objectDetectorActive: true,
      }));

      const tick = () => {
        if (!aliveRef.current) return;
        const currentVideo = videoRef.current;
        const faceTask = faceLandmarkerRef.current;
        const objectTask = objectDetectorRef.current;
        if (!currentVideo || !faceTask || !objectTask || currentVideo.readyState < 2) {
          if (!missingSince.current) missingSince.current = Date.now();
          if (Date.now() - (missingSince.current || 0) > NO_FACE_THRESHOLD_MS) {
            emitWithCooldown(faceAlertAt, 'FACE_NOT_DETECTED', 'HIGH', { durationMs: Date.now() - (missingSince.current || 0) });
          }
          setState((current) => ({
            ...current,
            cameraActive: !!currentVideo?.srcObject,
            faceDetectorActive: !!faceTask,
            objectDetectorActive: !!objectTask,
            faceCount: 0,
            phoneDetected: false,
            lastObservationAt: Date.now(),
          }));
          frameTimerRef.current = window.setTimeout(tick, LIVE_INTERVAL_MS);
          return;
        }

        missingSince.current = null;
        const timestamp = performance.now();

        let faceResult: FaceLandmarkerResult | null = null;
        let objectResult: ObjectDetectorResult | null = null;

        try {
          if (faceTask && typeof (faceTask as any).detectForVideo === 'function') {
            faceResult = (faceTask as any).detectForVideo(currentVideo, timestamp);
          } else {
            console.warn('Face task not ready or detectForVideo missing');
            setState((current) => ({ ...current, status: 'Face detector unavailable' }));
          }
        } catch (error) {
          console.error('Face detect error', error);
          setState((current) => ({ ...current, status: 'Face detector unavailable' }));
        }

        try {
          if (objectTask && typeof (objectTask as any).detectForVideo === 'function') {
            objectResult = (objectTask as any).detectForVideo(currentVideo, timestamp);
          } else {
            console.warn('Object task not ready or detectForVideo missing');
            setState((current) => ({ ...current, status: 'Object detector unavailable' }));
          }
        } catch (error) {
          console.error('Object detect error', error);
          setState((current) => ({ ...current, status: 'Object detector unavailable' }));
        }

        const faceCount = faceResult?.faceLandmarks?.length || 0;
        const detectedPhone = objectResult ? isPhoneDetection(objectResult) : false;
        const gaze = detectGazeAway(faceResult);

        setState((current) => ({
          ...current,
          cameraActive: true,
          faceDetectorActive: true,
          objectDetectorActive: true,
          faceCount,
          phoneDetected: detectedPhone,
          gazeAwayDetected: gaze.away,
          gazeDirection: gaze.direction,
          lastObservationAt: Date.now(),
          status: faceCount > 1 ? 'Multiple faces detected' : detectedPhone ? 'Phone detected' : gaze.away ? `Looking away (${gaze.direction})` : 'Detection active',
        }));

        if (faceCount === 0) {
          if (!missingSince.current) missingSince.current = Date.now();
          if (Date.now() - (missingSince.current || 0) > NO_FACE_THRESHOLD_MS) {
            emitWithCooldown(faceAlertAt, 'FACE_NOT_DETECTED', 'HIGH', { durationMs: Date.now() - (missingSince.current || 0) });
          }
        } else {
          missingSince.current = null;
        }

        // require a short confirmation window to avoid spurious multi-face / phone alerts
        if (faceCount > 1) {
          if (!multiFaceSince.current) multiFaceSince.current = Date.now();
          if (Date.now() - (multiFaceSince.current || 0) > MULTI_FACE_CONFIRM_MS) {
            emitWithCooldown(multiFaceAlertAt, 'MULTIPLE_FACES_DETECTED', 'HIGH', { faceCount, faces: faceCount });
            multiFaceSince.current = null;
          }
        } else {
          multiFaceSince.current = null;
        }

        if (detectedPhone) {
          if (!phoneSince.current) phoneSince.current = Date.now();
          if (Date.now() - (phoneSince.current || 0) > PHONE_CONFIRM_MS) {
            emitWithCooldown(phoneAlertAt, 'MOBILE_PHONE_DETECTED', 'HIGH', {
              detections: objectResult?.detections?.map((detection) => ({
                label: detection.categories?.[0]?.categoryName || detection.categories?.[0]?.displayName || 'object',
                score: detection.categories?.[0]?.score ?? 0,
                box: detection.boundingBox,
              })),
              topScore: objectResult ? latestDetectionScore(objectResult) : 0,
            });
            phoneSince.current = null;
          }
        } else {
          phoneSince.current = null;
        }

        if (gaze.away) {
          if (!gazeSince.current) gazeSince.current = Date.now();
          if (Date.now() - (gazeSince.current || 0) > GAZE_CONFIRM_MS) {
            emitWithCooldown(gazeAlertAt, 'GAZE_AWAY_DETECTED', 'MEDIUM', {
              direction: gaze.direction,
              confidence: gaze.confidence,
              source: gaze.source,
            });
            gazeSince.current = null;
          }
        } else {
          gazeSince.current = null;
        }

        frameTimerRef.current = window.setTimeout(tick, LIVE_INTERVAL_MS);
      };

      frameTimerRef.current = window.setTimeout(tick, LIVE_INTERVAL_MS);
    }

    start().catch((error) => {
      setState({
        initialized: false,
        status: 'Camera permission denied',
        permissionDenied: true,
        cameraActive: false,
        faceDetectorActive: false,
        objectDetectorActive: false,
        faceCount: 0,
        phoneDetected: false,
        gazeAwayDetected: false,
        gazeDirection: 'center',
        lastObservationAt: null,
      });
      emit('CAMERA_PERMISSION_DENIED', 'HIGH', { message: error instanceof Error ? error.message : 'getUserMedia failed' });
    });

    return () => {
      aliveRef.current = false;
      if (frameTimerRef.current) {
        window.clearTimeout(frameTimerRef.current);
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      faceLandmarkerRef.current?.close();
      objectDetectorRef.current?.close();
      faceLandmarkerRef.current = null;
      objectDetectorRef.current = null;
      streamRef.current = null;
    };
  }, [sessionId, socket]);

  return { videoRef, events, emit, state };
}
