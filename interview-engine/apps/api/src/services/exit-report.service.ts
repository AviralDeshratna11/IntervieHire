import { prisma } from '../lib/prisma.js';

// Exit interviews are recorded, not scored. This service turns a completed exit
// session's raw transcript into a structured, verbatim report — no LLM, no scores,
// no recommendation — and stores it in InterviewSession.evaluation so the existing
// Deep Analysis fetch/reconcile plumbing surfaces it unchanged. The engine's scored
// exit path (aviral-eval aggregateExitReport) stays in the codebase for the future
// optional theme/sentiment extraction that feeds the trends dashboard, but it is NOT
// on this critical path.

type TranscriptTurn = {
  speaker?: string;
  text?: string | null;
  questionIndex?: number | null;
  kind?: string;
  timestamp?: string;
};

function safeParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

// True when the synced session settings mark this as an exit interview. The backend
// (ai_sync.py) sets interviewType/jobType when the parent Job has job_kind == exit.
export function isExitInterviewSettings(settings: unknown): boolean {
  const parsed = typeof settings === 'string' ? safeParse(settings) : settings;
  if (parsed && typeof parsed === 'object') {
    const record = parsed as Record<string, unknown>;
    return record.interviewType === 'exit_interview' || record.jobType === 'exit';
  }
  return false;
}

function normalizeTranscript(raw: unknown): TranscriptTurn[] {
  if (Array.isArray(raw)) return raw as TranscriptTurn[];
  if (typeof raw === 'string') {
    const parsed = safeParse(raw);
    return Array.isArray(parsed) ? (parsed as TranscriptTurn[]) : [];
  }
  return [];
}

export interface ExitExchange {
  questionIndex: number | null;
  theme: string;
  question: string;
  answer: string;
  isFollowup: boolean;
}

export interface ExitTranscriptReport {
  interviewType: 'exit_interview';
  mode: 'verbatim';
  scored: false;
  interviewId: string;
  candidateId: string;
  roleTitle: string;
  summary: string;
  exchanges: ExitExchange[];
  themes: string[];
  questionCount: number;
  transcriptOnly: true;
  generatedAt: string;
  // The dashboard's report-fetch mapper gates on questionBreakdown being an array;
  // an exit report has no per-question scoring, so this stays empty and consumers
  // read `exchanges` instead.
  questionBreakdown: never[];
}

export async function buildExitTranscriptReport(sessionId: string): Promise<ExitTranscriptReport> {
  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    include: {
      jobRole: {
        include: { questions: { where: { isActive: true }, orderBy: { createdAt: 'asc' } } },
      },
    },
  });

  if (!session) throw new Error('Session not found');

  const transcript = normalizeTranscript(session.transcript);
  const questions = session.jobRole?.questions ?? [];

  const themeAt = (index: number | null | undefined): string => {
    if (typeof index === 'number' && questions[index]) {
      const categories = (questions[index] as { topicCategories?: unknown }).topicCategories;
      if (Array.isArray(categories) && categories.length && typeof categories[0] === 'string') {
        return categories[0];
      }
    }
    return 'General';
  };

  // Walk the transcript pairing each candidate answer with the AI turn that preceded
  // it. Follow-up probes carry kind === 'followup' and the same questionIndex as the
  // anchor they extend, so they surface as follow-ups under the same theme.
  const exchanges: ExitExchange[] = [];
  let pendingAi: TranscriptTurn | null = null;

  for (const turn of transcript) {
    if (turn?.speaker === 'ai') {
      pendingAi = turn;
    } else if (turn?.speaker === 'candidate') {
      const answer = (turn.text ?? '').trim();
      if (!answer) continue;
      const rawIndex = pendingAi?.questionIndex ?? turn.questionIndex ?? null;
      const questionIndex = typeof rawIndex === 'number' ? rawIndex : null;
      exchanges.push({
        questionIndex,
        theme: themeAt(questionIndex),
        question: (pendingAi?.text ?? '').trim(),
        answer,
        isFollowup: pendingAi?.kind === 'followup',
      });
    }
  }

  const themes = Array.from(new Set(exchanges.map((exchange) => exchange.theme)));

  const report: ExitTranscriptReport = {
    interviewType: 'exit_interview',
    mode: 'verbatim',
    scored: false,
    interviewId: session.id,
    candidateId: session.candidateId,
    roleTitle: session.jobRole?.title ?? '',
    summary: exchanges.length
      ? `Exit interview — ${exchanges.length} response${exchanges.length === 1 ? '' : 's'} recorded across ${themes.length} theme${themes.length === 1 ? '' : 's'}. Verbatim record, not scored.`
      : 'Exit interview — no responses were recorded.',
    exchanges,
    themes,
    questionCount: exchanges.length,
    transcriptOnly: true,
    generatedAt: new Date().toISOString(),
    questionBreakdown: [],
  };

  await prisma.interviewSession.update({
    where: { id: sessionId },
    data: { evaluation: report as any, status: 'EVALUATED', completedAt: new Date() },
  });

  return report;
}
