import PDFDocument from 'pdfkit';
import { prisma } from '../lib/prisma.js';
import { callOpenRouter } from '../lib/openrouter.js';
import type { EvaluationReport } from '@interviehire/shared';
import fs from 'node:fs';
import path from 'node:path';

type ReportQuestionItem = {
  question: string;
  answer: string;
  score: number;
  reasoning: string;
};

function readTranscriptEntries(transcript: unknown) {
  return Array.isArray(transcript) ? transcript : [];
}

function extractInterviewTurns(transcript: unknown) {
  const entries = readTranscriptEntries(transcript) as Array<{ speaker?: string; text?: string; timestamp?: string; metrics?: Record<string, unknown> }>;
  const turns: Array<{ question?: string; answer?: string; aiTimestamp?: string; candidateTimestamp?: string; metrics?: Record<string, unknown> }> = [];
  let pendingQuestion: string | null = null;
  let pendingQuestionAt: string | undefined;

  for (const entry of entries) {
    if (entry?.speaker === 'ai' && entry.text) {
      pendingQuestion = entry.text;
      pendingQuestionAt = entry.timestamp;
      continue;
    }

    if (entry?.speaker === 'candidate' && entry.text) {
      turns.push({
        question: pendingQuestion || 'Question unavailable',
        answer: entry.text,
        aiTimestamp: pendingQuestionAt,
        candidateTimestamp: entry.timestamp,
        metrics: entry.metrics,
      });
      pendingQuestion = null;
      pendingQuestionAt = undefined;
    }
  }

  return turns;
}

function normalizeReportQuestionItems(evaluation: any, transcript: unknown, questions: Array<{ id: string; text: string }>): ReportQuestionItem[] {
  const turns = extractInterviewTurns(transcript);
  const fitByQuestionId = new Map<string, any>();
  (evaluation?.partialQuestionFit || []).forEach((item: any) => {
    if (item?.questionId) fitByQuestionId.set(item.questionId, item);
  });

  return questions.map((question, index) => {
    const turn = turns[index];
    const fit = fitByQuestionId.get(question.id);
    return {
      question: turn?.question || question.text,
      answer: turn?.answer || 'No candidate answer captured for this question.',
      score: typeof fit?.score === 'number' ? fit.score : 0,
      reasoning: fit?.reasoning || 'No fit score available for this question.',
    };
  });
}

function calculateIntegritySummary(proctoringLogs: Array<{ severity: string; eventType: string; occurredAt: Date; metadata?: unknown }>) {
  const severityWeights: Record<string, number> = { LOW: 1, MEDIUM: 4, HIGH: 9, CRITICAL: 14 };
  const eventCounts = proctoringLogs.reduce<Record<string, number>>((acc, item) => {
    acc[item.eventType] = (acc[item.eventType] || 0) + 1;
    return acc;
  }, {});
  const penalty = proctoringLogs.reduce((sum, item) => sum + (severityWeights[item.severity] || 0), 0);
  const score = Math.max(0, 100 - penalty);

  return {
    score,
    totalEvents: proctoringLogs.length,
    eventCounts,
    topEvents: proctoringLogs.slice().sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime()).slice(0, 10),
  };
}

function stringifyMetadata(metadata: unknown) {
  if (!metadata) return '{}';
  try {
    return JSON.stringify(metadata, null, 2);
  } catch {
    return String(metadata);
  }
}

export async function evaluateInterview(sessionId: string): Promise<EvaluationReport> {
  const session = await prisma.interviewSession.findUnique({where:{id:sessionId}, include:{company:true,candidate:true,jobRole:true,proctoringLogs:true}});
  if (!session) throw new Error('Session not found');
  const prompt = `Evaluate this interview transcript for a ${session.jobRole.title} position at ${session.company.name}. Return a strict JSON object with answerDepth, confidence, communication, domainKnowledge, problemSolving, overallScore, recommendation, strengths, risks, summary. Each metric has score 1-5 and reasoning. Transcript: ${JSON.stringify(session.transcript)}. Proctoring logs: ${JSON.stringify(session.proctoringLogs)}`;
  const raw = await callOpenRouter([{role:'system', content:'You are an objective hiring evaluator. Return valid JSON only.'},{role:'user', content:prompt}], {json:true});
  const evaluation = JSON.parse(raw) as EvaluationReport;
  await prisma.interviewSession.update({where:{id:sessionId}, data:{evaluation: evaluation as any, status:'EVALUATED', completedAt: new Date()}});
  return evaluation;
}

export async function generatePdfReport(sessionId: string) {
  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    include: { company: true, candidate: true, jobRole: { include: { questions: true } }, proctoringLogs: true },
  });
  if (!session) throw new Error('Session not found');

  const evaluation = (session.evaluation || {}) as any;
  if (!session.evaluation) {
    await evaluateInterview(sessionId);
  }

  const refreshed = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    include: { company: true, candidate: true, jobRole: { include: { questions: true } }, proctoringLogs: true },
  });
  if (!refreshed) throw new Error('Session not found after evaluation');

  const reportQuestions = normalizeReportQuestionItems(refreshed.evaluation || evaluation, refreshed.transcript, refreshed.jobRole.questions.map((q) => ({ id: q.id, text: q.text })));
  const integrity = calculateIntegritySummary(refreshed.proctoringLogs as any[]);

  const outDir = path.resolve('reports');
  fs.mkdirSync(outDir, { recursive: true });
  const baseName = `${sessionId}`;
  const pdfPath = path.join(outDir, `${baseName}.pdf`);
  const jsonPath = path.join(outDir, `${baseName}.json`);

  const reportPayload = {
    generatedAt: new Date().toISOString(),
    sessionId,
    company: refreshed.company.name,
    candidate: refreshed.candidate.fullName,
    email: refreshed.candidate.email,
    role: refreshed.jobRole.title,
    overallScore: refreshed.evaluation ? (refreshed.evaluation as any).overallScore : evaluation.overallScore,
    recommendation: refreshed.evaluation ? (refreshed.evaluation as any).recommendation : evaluation.recommendation,
    evaluation: refreshed.evaluation || evaluation,
    integrity,
    questions: reportQuestions,
    proctoringEvents: refreshed.proctoringLogs.map((log) => ({
      eventType: log.eventType,
      severity: log.severity,
      occurredAt: log.occurredAt.toISOString(),
      metadata: log.metadata,
    })),
    summary: refreshed.evaluation ? (refreshed.evaluation as any).summary : evaluation.summary,
  };

  fs.writeFileSync(jsonPath, JSON.stringify(reportPayload, null, 2));

  const doc = new PDFDocument({ margin: 44, size: 'A4' });
  const pdfWriteStream = fs.createWriteStream(pdfPath);
  doc.pipe(pdfWriteStream);

  const writeLine = (label: string, value: string) => {
    doc.fontSize(11).fillColor('#111').text(`${label}: `, { continued: true });
    doc.fillColor('#444').text(value);
  };

  doc.fontSize(22).fillColor('#111').text('IntervieHire Final Interview Report');
  doc.moveDown(0.25).fontSize(10).fillColor('#666').text(`Generated ${new Date().toLocaleString()}`);
  doc.moveDown();

  doc.fontSize(15).fillColor('#111').text('Candidate Overview');
  writeLine('Candidate', refreshed.candidate.fullName);
  writeLine('Email', refreshed.candidate.email);
  writeLine('Company', refreshed.company.name);
  writeLine('Role', refreshed.jobRole.title);
  writeLine('Session', refreshed.id);
  writeLine('Status', refreshed.status);
  doc.moveDown();

  doc.fontSize(15).fillColor('#111').text('Overall Assessment');
  writeLine('Overall Score', `${(refreshed.evaluation as any)?.overallScore ?? '-'} / 5`);
  writeLine('Recommendation', `${(refreshed.evaluation as any)?.recommendation ?? '-'}`);
  doc.fontSize(10).fillColor('#555').text((refreshed.evaluation as any)?.summary || '');
  doc.moveDown();

  doc.fontSize(15).fillColor('#111').text('Question by Question');
  reportQuestions.forEach((item, index) => {
    doc.moveDown(0.3);
    doc.fontSize(11).fillColor('#111').text(`Q${index + 1}. ${item.question}`);
    doc.fontSize(10).fillColor('#333').text(`Answer: ${item.answer}`);
    doc.fontSize(10).fillColor('#666').text(`Score: ${item.score}/5`);
    doc.fontSize(9).fillColor('#777').text(item.reasoning);
  });
  doc.moveDown();

  doc.fontSize(15).fillColor('#111').text('Metric Breakdown');
  for (const key of ['answerDepth', 'confidence', 'communication', 'domainKnowledge', 'problemSolving']) {
    const metric = (refreshed.evaluation as any)?.[key] || evaluation[key] || {};
    doc.fontSize(11).fillColor('#111').text(`${key}: ${(metric as any).score ?? '-'} / 5`);
    doc.fontSize(9).fillColor('#666').text((metric as any).reasoning ?? '-');
  }
  doc.moveDown();

  doc.fontSize(15).fillColor('#111').text('Integrity / Proctoring');
  writeLine('Integrity Score', `${integrity.score}%`);
  writeLine('Flagged Events', `${integrity.totalEvents}`);
  doc.fontSize(10).fillColor('#555').text(integrity.totalEvents ? 'Most recent events:' : 'No integrity violations recorded.');
  integrity.topEvents.forEach((event) => {
    doc.fontSize(9).fillColor('#333').text(`• ${event.occurredAt.toLocaleString()} - ${event.eventType} (${event.severity})`);
    doc.fontSize(8).fillColor('#666').text(stringifyMetadata(event.metadata));
  });
  doc.moveDown();

  doc.fontSize(15).fillColor('#111').text('Strengths');
  (refreshed.evaluation as any)?.strengths?.length ? (refreshed.evaluation as any).strengths.forEach((item: string) => doc.fontSize(10).text(`• ${item}`)) : doc.fontSize(10).fillColor('#666').text('No strengths recorded.');
  doc.moveDown();

  doc.fontSize(15).fillColor('#111').text('Risks / Follow-up Areas');
  (refreshed.evaluation as any)?.risks?.length ? (refreshed.evaluation as any).risks.forEach((item: string) => doc.fontSize(10).text(`• ${item}`)) : doc.fontSize(10).fillColor('#666').text('No risks recorded.');

  doc.end();
  await new Promise<void>((resolve, reject) => {
    pdfWriteStream.on('finish', () => resolve());
    pdfWriteStream.on('error', reject);
    doc.on('error', reject);
  });

  await prisma.interviewSession.update({ where: { id: sessionId }, data: { reportUrl: pdfPath } });
  return { pdfPath, jsonPath, report: reportPayload };
}
