"use client";

import React, { useMemo, useState } from 'react';
import { ShieldCheck, Video, Mic, Wifi, Eye } from 'lucide-react';

type Props = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  events: any[];
  state: any;
  sessionId?: string;
  socket?: WebSocket | null;
  compareIdentity?: (img: HTMLImageElement | ImageBitmap) => Promise<{ score: number; details?: any }>;
};

export default function ProctoringPanel({ videoRef, events, state, sessionId, socket, compareIdentity }: Props) {
  const [scanProgress, setScanProgress] = useState(0);
  const [lockdown, setLockdown] = useState(true);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const screenVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const [identityScore, setIdentityScore] = useState<number | null>(null);
  const [identityLoading, setIdentityLoading] = useState(false);
  const [idPreviewUrl, setIdPreviewUrl] = useState<string | null>(null);
  const idFileRef = React.useRef<HTMLInputElement | null>(null);

  const integrityScore = useMemo(() => {
    const critical = events.filter((e) => e.severity === 'HIGH' || e.severity === 'CRITICAL').length * 12;
    const medium = events.filter((e) => e.severity === 'MEDIUM').length * 6;
    const missing = state.cameraActive ? 0 : 10;
    return Math.max(0, 100 - critical - medium - missing);
  }, [events, state]);

  function emit(type: string, severity = 'LOW', metadata: Record<string, unknown> = {}) {
    const payload = { type: 'proctoring_event', sessionId, eventType: type, severity, metadata, timestamp: Date.now() };
    try { socket?.readyState === 1 && socket.send(JSON.stringify(payload)); } catch (e) { /* ignore */ }
  }

  async function checkCameraAndMic() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      stream.getTracks().forEach((t) => t.stop());
      emit('CAMERA_MIC_OK', 'LOW');
    } catch (e) {
      emit('CAMERA_MIC_FAILED', 'HIGH', { message: (e as Error).message });
    }
  }

  async function checkScreenShare() {
    try {
      // feature-detect
      if (!('getDisplayMedia' in navigator.mediaDevices)) throw new Error('Screen capture not supported');
      const stream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true });
      // keep stream active for preview and possible recording
      setScreenStream(stream);
      emit('SCREEN_SHARE_OK', 'LOW');
    } catch (e) {
      emit('SCREEN_SHARE_FAILED', 'HIGH', { message: (e as Error).message });
    }
  }

  function stopScreenShare() {
    if (!screenStream) return;
    screenStream.getTracks().forEach((t) => t.stop());
    setScreenStream(null);
    emit('SCREEN_SHARE_STOPPED', 'LOW');
  }

  function startEnvironmentScan() {
    setScanProgress(0);
    emit('ENV_SCAN_STARTED', 'LOW');
    const iv = window.setInterval(() => {
      setScanProgress((p) => {
        const next = p + 20;
        if (next >= 100) {
          window.clearInterval(iv);
          emit('ENV_SCAN_COMPLETE', 'LOW');
          return 100;
        }
        return next;
      });
    }, 350);
  }

  function markIdentityVerified() {
    emit('IDENTITY_VERIFIED', 'LOW');
  }

  // Browser lockdown handlers
  React.useEffect(() => {
    if (!lockdown) return undefined;

    const restrictedShortcuts = new Set(['c', 'v', 'x', 'a', 's', 'p', 't', 'n']);

    const blockAction = (event: Event, label: string) => {
      event.preventDefault();
      emit(label, 'MEDIUM');
    };

    const handleContextMenu = (event: Event) => blockAction(event, 'RIGHT_CLICK_BLOCKED');
    const handleClipboard = (event: Event) => blockAction(event, 'CLIPBOARD_ACTION_BLOCKED');
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const restrictedCombo = (event.ctrlKey || event.metaKey) && restrictedShortcuts.has(key);
      const devToolsCombo = event.key === 'F12' || ((event.ctrlKey || event.metaKey) && event.shiftKey && ['i', 'j', 'c'].includes(key));
      if (restrictedCombo || devToolsCombo) {
        blockAction(event, `KEYBOARD_SHORTCUT_BLOCKED_${event.key}`);
      }
    };

    const handleVisibility = () => {
      if (document.hidden) emit('TAB_SWITCHED', 'HIGH');
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleClipboard);
    document.addEventListener('cut', handleClipboard);
    document.addEventListener('paste', handleClipboard);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleClipboard);
      document.removeEventListener('cut', handleClipboard);
      document.removeEventListener('paste', handleClipboard);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [lockdown]);

  return (
    <div className="rounded-[1rem] bg-white p-4 text-ink shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-500">Proctoring</div>
          <h3 className="font-bold">Interview Integrity</h3>
        </div>
        <ShieldCheck className="text-brand" />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-700">Integrity Score</div>
          <div className="text-2xl font-black">{integrityScore}</div>
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2"><Video size={14} /> Camera: {state.cameraActive ? 'OK' : 'No'}</div>
          <div className="flex items-center gap-2"><Mic size={14} /> Mic: {state.cameraActive ? 'OK' : 'No'}</div>
          <div className="flex items-center gap-2"><Wifi size={14} /> Network: {navigator.onLine ? 'Online' : 'Offline'}</div>
          <div className="flex items-center gap-2"><Eye size={14} /> Gaze: {state.gazeAwayDetected ? `Away (${state.gazeDirection})` : 'Centered'}</div>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button onClick={checkCameraAndMic} className="rounded px-3 py-2 bg-ink text-white">Check camera & mic</button>
        {!screenStream ? (
          <button onClick={checkScreenShare} className="rounded px-3 py-2 bg-ink text-white">Check screen share</button>
        ) : (
          <button onClick={stopScreenShare} className="rounded px-3 py-2 bg-rose-600 text-white">Stop screen share</button>
        )}
        <button onClick={markIdentityVerified} className="rounded px-3 py-2 bg-ink text-white">Verify identity</button>
      </div>

      <div className="mt-3">
        <div className="text-xs text-slate-500">Environment scan</div>
        <div className="w-full rounded bg-slate-100 mt-2 h-2 overflow-hidden"><div className="bg-emerald-500 h-full" style={{ width: `${scanProgress}%` }} /></div>
        <div className="mt-2 flex gap-2">
          <button onClick={startEnvironmentScan} className="text-sm rounded px-2 py-1 bg-emerald-100">Run scan</button>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={lockdown} onChange={(e) => setLockdown(e.target.checked)} /> Browser lockdown</label>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-xs text-slate-500">Recent events</div>
        <div className="mt-2 max-h-40 overflow-auto">
          {events.length ? events.map((e, i) => (
            <div key={i} className="rounded bg-slate-50 p-2 text-xs my-1">
              <div className="font-semibold">{e.eventType}</div>
              <div className="text-slate-500">{new Date(e.timestamp || Date.now()).toLocaleTimeString()}</div>
              {e.metadata ? <pre className="text-xs text-slate-500 mt-1 whitespace-pre-wrap">{JSON.stringify(e.metadata)}</pre> : null}
            </div>
          )) : <div className="text-sm text-slate-500">No events yet</div>}
        </div>
      </div>

      <div className="mt-3">
        <div className="text-xs text-slate-500">Identity verification</div>
        <div className="mt-2 flex gap-2">
          <input ref={idFileRef} type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const url = URL.createObjectURL(file);
            setIdPreviewUrl(url);
          }} />
          <button onClick={async () => {
            setIdentityScore(null);
            setIdentityLoading(true);
            try {
              if (!compareIdentity) {
                emit('IDENTITY_CAPTURED', 'LOW');
                setIdentityLoading(false);
                return;
              }
              if (!idPreviewUrl) {
                emit('IDENTITY_CAPTURED', 'LOW');
                setIdentityLoading(false);
                return;
              }
              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.src = idPreviewUrl as string;
              await new Promise((res) => { img.onload = res; img.onerror = res; });
              const res = await compareIdentity(img);
              setIdentityScore(res.score ?? 0);
              emit('IDENTITY_VERIFICATION_RESULT', res.score >= 70 ? 'LOW' : 'MEDIUM', res.details ?? {});
            } catch (e) {
              emit('IDENTITY_VERIFICATION_FAILED', 'HIGH', { error: (e as Error).message });
            } finally { setIdentityLoading(false); }
          }} className="rounded px-3 py-2 bg-ink text-white">Compare ID</button>
        </div>
        <div className="mt-2">
          {idPreviewUrl && <img src={idPreviewUrl} alt="ID preview" className="max-h-24" />}
          {identityLoading ? <div className="text-sm text-slate-500">Verifying…</div> : identityScore !== null ? <div className="text-sm">Score: {identityScore}</div> : null}
        </div>
      </div>

      {screenStream ? (
        <div className="mt-3">
          <div className="text-xs text-slate-500">Screen preview</div>
          <video ref={(el) => { screenVideoRef.current = el; if (el && screenStream) { el.srcObject = screenStream; el.play().catch(() => {}); } }} className="mt-2 w-full rounded" autoPlay playsInline muted />
        </div>
      ) : null}
    </div>
  );
}
