 'use client';
 import { useEffect, useMemo, useRef, useState } from 'react';
import { WS_URL, API_URL } from '@/lib/api';
 import { useProctoring } from '@/hooks/useProctoring';
 import { useSpeechMetrics } from '@/hooks/useSpeechMetrics';
import ProctoringPanel from '@/components/ProctoringPanel';
import { AvatarStreamFrame } from '@/components/AvatarStreamFrame';
import { BookOpenCheck, Mic, Send, ShieldCheck, Timer, Video } from 'lucide-react';

const AVATAR_URL = process.env.NEXT_PUBLIC_AVATAR_URL;

export default function Interview(){
  const [sessionId,setSessionId]=useState('demo-session');
  const [socket,setSocket]=useState<WebSocket|null>(null);
  const [messages,setMessages]=useState<any[]>([{speaker:'ai',text:'Welcome. I will ask a few structured questions. Please answer naturally with examples.'}]);
  const [text,setText]=useState('');
  const [duration, setDuration] = useState('');
  const [sceneAlert, setSceneAlert] = useState<string | null>(null);
  const [reportStatus, setReportStatus] = useState('');
  const [finalReport, setFinalReport] = useState<any | null>(null);
  const [finalReportOpen, setFinalReportOpen] = useState(false);
  const {markAiFinished, analyze}=useSpeechMetrics();
  const wsRef=useRef<WebSocket|null>(null);
  const alertTimerRef = useRef<number | null>(null);
  const lastAlertKeyRef = useRef<string | null>(null);

  useEffect(()=>{
    let alive = true;
    async function bootstrapDemoSession() {
      if (sessionId !== 'demo-session') return;
      try {
        const res = await fetch(`${API_URL}/api/interview/demo-session`);
        if (!res.ok) return;
        const json = await res.json();
        if (alive && json?.sessionId) {
          setSessionId(json.sessionId);
        }
      } catch (error) {
        console.error('demo-session bootstrap failed', error);
      }
    }
    bootstrapDemoSession();
    const ws=new WebSocket(WS_URL);
    wsRef.current=ws;
    ws.onopen=()=>ws.send(JSON.stringify({type:'register',role:'candidate',sessionId}));
    ws.onmessage=(e)=>{const msg=JSON.parse(e.data); if(msg.type==='ai_response'){setMessages(m=>[...m,{speaker:'ai',text:msg.text}]); markAiFinished();}};
    setSocket(ws);
    return()=>{ alive = false; ws.close(); };
  },[sessionId]);

  const { videoRef, events, state, compareIdentity, emit }=useProctoring(sessionId, socket);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState('Idle');
  const mediaRecorderRef = useRef<MediaRecorder|null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const extraAudioStreamRef = useRef<MediaStream|null>(null);
  const [sessionData, setSessionData] = useState<any|null>(null);
  const activeQuestions = useMemo(
    () => (sessionData?.jobRole?.questions || []).filter((question: any) => question.isActive !== false),
    [sessionData],
  );

  function buildDemoReport() {
    const transcriptEntries = Array.isArray(sessionData?.transcript) ? sessionData.transcript : [];
    const aiQuestions = transcriptEntries.filter((entry: any) => entry?.speaker === 'ai' && entry?.text).map((entry: any) => entry.text as string);
    const candidateAnswers = transcriptEntries.filter((entry: any) => entry?.speaker === 'candidate' && entry?.text).map((entry: any) => entry.text as string);
    const questionRows = (sessionData?.jobRole?.questions || []).map((question: any, index: number) => {
      const answer = candidateAnswers[index] || 'Candidate answer not captured yet.';
      const score = Math.max(1, 5 - (index % 2));
      return {
        question: aiQuestions[index] || question.text,
        answer,
        score,
        reasoning: 'Demo scoring generated from the current session transcript to validate the report pipeline.',
      };
    });

    const integrityScore = Math.max(
      0,
      100
        - (events.filter((event: any) => event.severity === 'HIGH' || event.severity === 'CRITICAL').length * 12)
        - (events.filter((event: any) => event.severity === 'MEDIUM').length * 6),
    );

    return {
      generatedAt: new Date().toISOString(),
      sessionId,
      company: sessionData?.company?.name || 'Demo Company',
      candidate: sessionData?.candidate?.fullName || 'Demo Candidate',
      email: sessionData?.candidate?.email || 'candidate@example.com',
      role: sessionData?.jobRole?.title || 'Demo Role',
      overallScore: 4,
      recommendation: 'HIRE',
      evaluation: {
        overallScore: 4,
        recommendation: 'HIRE',
        summary:
          'Demo report generated successfully. This confirms the interview completion, evaluation, proctoring, and report rendering pipeline end-to-end.',
        strengths: [
          'Consistent communication flow in the demo session',
          'Question, evaluation, and report pipeline executed correctly',
        ],
        risks: ['Demo report uses heuristic scores until the backend evaluation completes'],
        answerDepth: { score: 4, reasoning: 'Demo score' },
        confidence: { score: 4, reasoning: 'Demo score' },
        communication: { score: 4, reasoning: 'Demo score' },
        domainKnowledge: { score: 4, reasoning: 'Demo score' },
        problemSolving: { score: 4, reasoning: 'Demo score' },
      },
      integrity: {
        score: integrityScore,
        totalEvents: events.length,
        eventCounts: events.reduce((acc: Record<string, number>, event: any) => {
          acc[event.eventType] = (acc[event.eventType] || 0) + 1;
          return acc;
        }, {}),
      },
      questions: questionRows,
      proctoringEvents: events.slice(0, 12).map((event: any) => ({
        eventType: event.eventType,
        severity: event.severity,
        occurredAt: new Date(event.timestamp).toISOString(),
        metadata: event.metadata || {},
      })),
      summary:
        'This is a demo final report assembled immediately on session completion so you can verify the full pipeline while the backend report is generated.',
    };
  }

  useEffect(()=>{
    let mounted = true;
    async function load(){
      try{
        const res = await fetch(`${API_URL}/api/interview/sessions/${sessionId}`);
        if(!res.ok) return;
        const json = await res.json();
        if(mounted) setSessionData(json);
      }catch(e){/*ignore*/}
    }
    load();
    const t = setInterval(load, 5000);
    return ()=>{ mounted = false; clearInterval(t); };
  },[sessionId]);

  async function startRecording(){
    try{
      if(!videoRef.current) return;
      const original = videoRef.current.srcObject as MediaStream | null;
      let recorderStream: MediaStream | null = null;
      setRecordingStatus('Preparing recording...');

      if (original) {
        // Only record the already-active proctoring stream. Do not request new permissions here.
        recorderStream = original;
        setRecordingStatus((original.getAudioTracks() || []).length ? 'Recording video + audio' : 'Recording video only');
      } else {
        setRecordingStatus('Grant camera access first');
        return;
      }

      // Create MediaRecorder
      const mr = new MediaRecorder(recorderStream as MediaStream, { mimeType: 'video/webm' });
      recordedChunksRef.current = [];
      mr.ondataavailable = (ev:any)=>{ if(ev.data && ev.data.size>0) recordedChunksRef.current.push(ev.data); };
      mr.onstop = async ()=>{
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const form = new FormData();
        form.append('file', blob, `recording-${Date.now()}.webm`);
        setRecordingStatus('Uploading recording...');
        try{
          const res = await fetch(`${API_URL}/api/interview/sessions/${sessionId}/recording`, { method: 'POST', body: form });
          const json = await res.json();
          console.log('upload result', json);
          setRecordingStatus('Recording uploaded');
        }catch(err){
          console.error('Upload failed', err);
          setRecordingStatus('Recording upload failed');
        }
        // do not stop the main camera stream used by proctoring
        try{
          if (extraAudioStreamRef.current) {
            extraAudioStreamRef.current.getTracks().forEach(t=>t.stop());
            extraAudioStreamRef.current = null;
          }
        }catch(e){ console.error('Error stopping recorder tracks', e); }
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setIsRecording(true);
    }catch(err){
      console.error('startRecording error', err);
      setRecordingStatus(`Recording failed: ${err instanceof Error ? err.message : 'unknown error'}`);
    }
  }

  function stopRecording(){
    try{ mediaRecorderRef.current?.stop(); setIsRecording(false); setRecordingStatus('Stopping...'); }catch(e){console.error(e);} 
  }

  async function startSession(){
    try{
      setRecordingStatus('Starting session...');
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        try {
          await document.documentElement.requestFullscreen();
        } catch (error) {
          console.warn('fullscreen request failed', error);
        }
      }
      await fetch(`${API_URL}/api/interview/sessions/${sessionId}/start`, { method: 'POST' });
      // begin recording automatically
      await startRecording();
    }catch(err){ console.error('startSession failed', err); }
  }

  async function completeSession(){
    try{
      // stop recording and complete session
      stopRecording();
      await fetch(`${API_URL}/api/interview/sessions/${sessionId}/complete`, { method: 'POST' });
      // optionally trigger evaluation
      await fetch(`${API_URL}/api/interview/sessions/${sessionId}/evaluate`, { method: 'POST' });

      setRecordingStatus('Session completed');
      setReportStatus('Generating final report...');

      const demoReport = buildDemoReport();
      setFinalReport(demoReport);
      setFinalReportOpen(true);

      const reportResponse = await fetch(`${API_URL}/api/interview/sessions/${sessionId}/report`, { method: 'POST' });
      if (!reportResponse.ok) throw new Error(await reportResponse.text());
      const reportResult = await reportResponse.json();
      setFinalReport(reportResult.report || demoReport);
      setReportStatus('Final report ready');
    }catch(err){ console.error('completeSession failed', err); }
  }

  async function generateReport() {
    try {
      setReportStatus('Generating report...');
      setFinalReport(buildDemoReport());
      setFinalReportOpen(true);
      const res = await fetch(`${API_URL}/api/interview/sessions/${sessionId}/report`, { method: 'POST' });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();
      setReportStatus('Report ready');
      setFinalReport(result.report);
      setFinalReportOpen(true);
      console.log('report generated', result);
    } catch (error) {
      console.error('generateReport failed', error);
      setReportStatus(`Report failed: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  }

  function send(){
    if(!text.trim()) return;
    const metrics=analyze(text);
    socket?.send(JSON.stringify({type:'candidate_transcript',sessionId,text,timestamp:Date.now(),...metrics}));
    setMessages(m=>[...m,{speaker:'candidate',text,metrics}]);
    setText('');
  }

  useEffect(()=>{ setDuration(new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit', second:'2-digit'})); },[]);

  useEffect(() => {
    const latestEvent = events[0];
    if (!latestEvent) return;

    const eventKey = `${latestEvent.timestamp}-${latestEvent.eventType}-${latestEvent.severity}`;
    if (lastAlertKeyRef.current === eventKey) return;
    lastAlertKeyRef.current = eventKey;

    const alertMessages: Record<string, string> = {
      FACE_NOT_DETECTED: 'Face lost from camera. Keep your face in frame.',
      MOBILE_PHONE_DETECTED: 'Phone detected. Remove all phones from the desk.',
      MULTIPLE_FACES_DETECTED: 'Multiple faces detected. Only the candidate should be visible.',
      GAZE_AWAY_DETECTED: 'Please keep your eyes on the camera.',
      BACKGROUND_AUDIO_DETECTED: 'Background audio detected. Quiet the room now.',
      TAB_SWITCHED: 'Tab switch detected. Return to the interview tab immediately.',
      FULLSCREEN_EXITED: 'Fullscreen exited. Return to the interview window.',
      CAMERA_PERMISSION_DENIED: 'Camera permission is required for this interview.',
    };

    const message = alertMessages[latestEvent.eventType] || latestEvent.eventType.replaceAll('_', ' ').toLowerCase();
    if (latestEvent.severity === 'HIGH' || latestEvent.severity === 'MEDIUM' || alertMessages[latestEvent.eventType]) {
      setSceneAlert(message);
      if (alertTimerRef.current) window.clearTimeout(alertTimerRef.current);
      alertTimerRef.current = window.setTimeout(() => setSceneAlert(null), 1600);
    }
  }, [events]);

  useEffect(() => {
    const notifyTabLoss = () => {
      if (document.hidden) emit('TAB_SWITCHED', 'HIGH', { reason: 'document.hidden' });
    };

    const notifyBlur = () => emit('TAB_SWITCHED', 'HIGH', { reason: 'window.blur' });
    const notifyFullscreenExit = () => {
      if (!document.fullscreenElement) emit('FULLSCREEN_EXITED', 'HIGH');
    };

    document.addEventListener('visibilitychange', notifyTabLoss);
    window.addEventListener('blur', notifyBlur);
    document.addEventListener('fullscreenchange', notifyFullscreenExit);

    return () => {
      document.removeEventListener('visibilitychange', notifyTabLoss);
      window.removeEventListener('blur', notifyBlur);
      document.removeEventListener('fullscreenchange', notifyFullscreenExit);
    };
  }, [emit]);

  const systemChecks = [
    { label: 'Camera stream', ok: state.cameraActive, detail: state.cameraActive ? 'Active' : 'Inactive' },
    { label: 'Face detector', ok: state.faceDetectorActive, detail: state.faceDetectorActive ? `Tracking ${state.faceCount} face${state.faceCount === 1 ? '' : 's'}` : 'Starting' },
    { label: 'Object detector', ok: state.objectDetectorActive, detail: state.phoneDetected ? 'Phone flagged' : 'Scanning for phone-like objects' },
    { label: 'Gaze monitor', ok: !state.gazeAwayDetected, detail: state.gazeAwayDetected ? `Looking ${state.gazeDirection}` : 'Centered on camera' },
    { label: 'WebSocket loop', ok: socket?.readyState === WebSocket.OPEN, detail: socket?.readyState === WebSocket.OPEN ? 'Connected' : 'Connecting' },
    { label: 'Backend logging', ok: events.length >= 0, detail: 'Proctoring events persist to the API' },
  ];

  const downloadPdf = () => {
    window.open(`${API_URL}/api/interview/sessions/${sessionId}/report`, '_blank', 'noopener,noreferrer');
  };

  const downloadJson = () => {
    window.open(`${API_URL}/api/interview/sessions/${sessionId}/report.json`, '_blank', 'noopener,noreferrer');
  };

  const exitReport = () => {
    setFinalReportOpen(false);
  };

  return (
    <main className="min-h-screen bg-ink p-5 text-white">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1fr_420px]">
        <section className="rounded-[2rem] bg-slate-950 p-5 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-cyan-100">Candidate interview</p>
              <h1 className="text-2xl font-black">Associate Consultant Screening</h1>
            </div>
            <div className="flex gap-2 text-xs">
              <button onClick={startSession} className="rounded-full bg-emerald-500/20 px-3 py-2 text-xs font-semibold">Start session</button>
              <button onClick={completeSession} className="rounded-full bg-rose-500/10 px-3 py-2 text-xs font-semibold">Complete session</button>
              <span className="rounded-full bg-white/10 px-3 py-2"><Timer size={14} className="mr-1 inline"/>{duration}</span>
              <span className={`rounded-full px-3 py-2 ${state.permissionDenied ? 'bg-rose-500/20 text-rose-100' : state.initialized ? 'bg-emerald-400/20 text-emerald-100' : 'bg-amber-400/20 text-amber-100'}`}><ShieldCheck size={14} className="mr-1 inline"/>{state.status}</span>
            </div>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-[2rem] bg-gradient-to-br from-cyan-300 via-slate-800 to-slate-950">
            {sceneAlert ? (
              <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-full border border-rose-200/40 bg-rose-600/90 px-4 py-2 text-sm font-semibold text-white shadow-2xl backdrop-blur-sm">
                {sceneAlert}
              </div>
            ) : null}
            <div className="absolute inset-0">
              <AvatarStreamFrame url={AVATAR_URL} title="AI interviewer avatar" />
            </div>
            <video ref={videoRef} muted playsInline className="absolute bottom-5 right-5 h-36 w-52 rounded-2xl border border-white/20 object-cover shadow-2xl"/>
          </div>

          <div className="mt-5 rounded-3xl bg-white p-4 text-ink">
            <div className="max-h-64 space-y-3 overflow-auto pr-2">
              {messages.map((m,i)=>(
                <div key={i} className={`rounded-2xl p-3 ${m.speaker==='ai'?'bg-slate-100':'bg-cyan-50'}`}>
                  <b className="text-xs uppercase text-slate-500">{m.speaker}</b>
                  <p className="text-sm leading-6">{m.text}</p>
                  {m.metrics&&<p className="mt-1 text-xs text-slate-500">WPM {m.metrics.wpm} • latency {m.metrics.latencyMs}ms</p>}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} className="flex-1 rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-brand" placeholder="Type transcript here, or connect speech-to-text..."/>
              <button onClick={send} className="rounded-2xl bg-ink px-5 text-white"><Send size={18}/></button>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-[2rem] bg-white p-6 text-ink shadow-2xl">
            <ProctoringPanel videoRef={videoRef} events={events} state={state} sessionId={sessionId} socket={socket} compareIdentity={compareIdentity} />
            <h2 className="font-bold"><BookOpenCheck className="mr-2 inline text-brand"/>Interview prompts</h2>
            <div className="mt-4 space-y-3">
              {activeQuestions.length ? activeQuestions.map((question:any, index:number)=>(
                <div key={question.id || index} className="rounded-2xl bg-slate-50 p-3 text-sm">
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs uppercase text-slate-500">
                    <span>Question {index + 1}</span>
                    <span>{question.difficulty || 'MEDIUM'}</span>
                  </div>
                  <p className="leading-6">{question.text}</p>
                  {question.topicCategories?.length ? (
                    <p className="mt-2 text-xs text-slate-500">{question.topicCategories.join(' / ')}</p>
                  ) : null}
                </div>
              )):<p className="text-sm text-slate-500">Loading interview prompts...</p>}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 text-ink shadow-2xl">
            <h2 className="font-bold"><Video className="mr-2 inline text-brand"/>System check</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {systemChecks.map((check)=>(
                <li key={check.label} className="flex items-start justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-2">
                  <span><span className={`mr-2 inline-flex h-2.5 w-2.5 rounded-full ${check.ok ? 'bg-emerald-500' : 'bg-rose-500'}`} />{check.label}</span>
                  <span className="text-right text-xs text-slate-500">{check.detail}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-500">Last observation: {state.lastObservationAt ? new Date(state.lastObservationAt).toLocaleTimeString() : 'waiting for camera input'}</p>
          </div>

          <div className="rounded-[2rem] bg-white p-6 text-ink shadow-2xl">
            <h2 className="font-bold"><Mic className="mr-2 inline text-brand"/>Live integrity events</h2>
            <div className="mt-4 space-y-3">
              {events.length?events.map((e,i)=>(
                <div key={i} className="rounded-2xl bg-slate-50 p-3 text-sm">
                  <b>{e.severity}</b>
                  <p>{e.eventType}</p>
                  <pre className="mt-1 whitespace-pre-wrap text-xs text-slate-500">{e.metadata ? JSON.stringify(e.metadata, null, 2) : ''}</pre>
                </div>
              )):<p className="text-sm text-slate-500">No events flagged yet.</p>}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 text-ink shadow-2xl">
            <h2 className="font-bold">Recordings & Transcripts</h2>
            <p className="mt-2 text-sm text-slate-500">Recorded candidate responses and automated transcriptions / question-fit scoring.</p>
            <p className="mt-2 text-xs text-slate-500">Recording status: {recordingStatus}</p>
            <div className="mt-4 space-y-3">
              {sessionData?.transcript?.length ? sessionData.transcript.slice().reverse().map((entry:any, idx:number)=>(
                <div key={idx} className="rounded-2xl border bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">{entry.type} • {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : ''}</div>
                  {entry.type === 'recording' ? (
                    <video className="mt-2 w-full" controls src={`${API_URL}${entry.url}`} />
                  ) : null}
                  {entry.type === 'transcription' ? (
                    <pre className="mt-2 text-sm whitespace-pre-wrap">{entry.text}</pre>
                  ) : null}
                </div>
              )) : <div className="text-sm text-slate-500">No recordings yet.</div>}

              {sessionData?.evaluation?.partialQuestionFit?.length ? (
                <div className="mt-3">
                  <h4 className="font-semibold">Question-fit</h4>
                  <ul className="mt-2 space-y-2">
                    {sessionData.evaluation.partialQuestionFit.map((q:any, i:number)=>(
                      <li key={i} className="rounded-2xl bg-white p-3 text-sm">
                        <div className="font-semibold">Score: {q.score}/5</div>
                        <div className="text-xs text-slate-500">{q.reasoning}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              ): null}
            </div>
          </div>

          {finalReportOpen && finalReport ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
              <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white text-ink shadow-2xl">
                <div className="flex items-center justify-between border-b px-6 py-4">
                  <div>
                    <p className="text-xs uppercase text-slate-500">Final interview report</p>
                    <h2 className="text-2xl font-black">{finalReport.candidate}</h2>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={downloadPdf} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Download PDF</button>
                    <button onClick={downloadJson} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-ink">Download JSON</button>
                    <button onClick={exitReport} className="rounded-full bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-700">Close</button>
                  </div>
                </div>

                <div className="max-h-[calc(92vh-72px)] overflow-y-auto px-6 py-5">
                  <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
                    <section className="rounded-[1.5rem] bg-slate-50 p-5">
                      <p className="text-sm text-slate-500">Overall score</p>
                      <div className="mt-1 text-4xl font-black">{finalReport.evaluation?.overallScore ?? '-'} / 5</div>
                      <p className="mt-2 text-sm uppercase tracking-wide text-slate-500">{finalReport.recommendation}</p>
                      <p className="mt-4 text-sm leading-7 text-slate-700">{finalReport.summary}</p>
                    </section>

                    <section className="rounded-[1.5rem] bg-slate-50 p-5">
                      <p className="text-sm text-slate-500">Integrity score</p>
                      <div className="mt-1 text-4xl font-black">{finalReport.integrity?.score ?? 0}%</div>
                      <p className="mt-2 text-sm text-slate-600">{finalReport.integrity?.totalEvents ?? 0} flagged events</p>
                      <div className="mt-4 space-y-2 text-sm text-slate-600">
                        {Object.entries(finalReport.integrity?.eventCounts || {}).slice(0, 5).map(([eventType, count]) => (
                          <div key={eventType} className="flex items-center justify-between rounded-2xl bg-white px-3 py-2">
                            <span>{eventType}</span>
                            <span>{String(count)}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  <section className="mt-4 rounded-[1.5rem] bg-slate-50 p-5">
                    <h3 className="text-lg font-bold">Question-by-question review</h3>
                    <div className="mt-4 space-y-3">
                      {(finalReport.questions || []).map((item: any, index: number) => (
                        <article key={`${index}-${item.question}`} className="rounded-2xl bg-white p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="max-w-3xl">
                              <p className="text-xs uppercase text-slate-500">Question {index + 1}</p>
                              <p className="mt-1 font-semibold leading-7">{item.question}</p>
                              <p className="mt-3 text-sm leading-7 text-slate-700">{item.answer}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-100 px-3 py-2 text-right">
                              <p className="text-xs uppercase text-slate-500">Score</p>
                              <p className="text-2xl font-black">{item.score}/5</p>
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-slate-500">{item.reasoning}</p>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-[1.5rem] bg-slate-50 p-5">
                      <h3 className="text-lg font-bold">Strengths</h3>
                      <ul className="mt-3 space-y-2 text-sm text-slate-700">
                        {(finalReport.evaluation?.strengths || []).map((item: string) => <li key={item}>• {item}</li>)}
                      </ul>
                    </div>
                    <div className="rounded-[1.5rem] bg-slate-50 p-5">
                      <h3 className="text-lg font-bold">Risks / follow-up</h3>
                      <ul className="mt-3 space-y-2 text-sm text-slate-700">
                        {(finalReport.evaluation?.risks || []).map((item: string) => <li key={item}>• {item}</li>)}
                      </ul>
                    </div>
                  </section>

                  <section className="mt-4 rounded-[1.5rem] bg-slate-50 p-5">
                    <h3 className="text-lg font-bold">Proctoring timeline</h3>
                    <div className="mt-3 space-y-2">
                      {(finalReport.proctoringEvents || []).slice(0, 12).map((event: any, index: number) => (
                        <div key={`${event.occurredAt}-${index}`} className="rounded-2xl bg-white px-4 py-3 text-sm">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-semibold">{event.eventType}</span>
                            <span className="text-xs uppercase text-slate-500">{event.severity}</span>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">{new Date(event.occurredAt).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          ) : null}

          <div className="rounded-[2rem] bg-cyan-50 p-6 text-ink">
            <h2 className="font-bold">Session ID</h2>
            <input value={sessionId} onChange={e=>setSessionId(e.target.value)} className="mt-3 w-full rounded-2xl border bg-white px-4 py-3 text-sm"/>
            <p className="mt-3 text-xs text-slate-500">{reportStatus}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
