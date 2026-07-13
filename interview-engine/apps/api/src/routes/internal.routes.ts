import type { FastifyInstance } from 'fastify';
import fs from 'node:fs';
import path from 'node:path';
import { prisma } from '../lib/prisma.js';
import { transcriptFilePath as transcriptPathEnv } from '../services/transcript.service.js';
import { transcriptFilePath as transcriptPathFixed } from '../services/flagcheckTranscription.service.js';

/**
 * Internal service-to-service routes, called ONLY by the FastAPI backend (never the
 * browser), guarded by a shared-secret header.
 *
 * Because the two services share one Postgres, the backend performs all DB anonymise/erase
 * itself (deleting a Candidate cascades its sessions/transcripts/proctoring at the DB
 * level). The engine's sole job here is to unlink its ON-DISK artifacts — transcript .txt
 * files and recording blobs — which live on this container's filesystem and are
 * unreachable via the DB. Part of the DPDP Act 2023 right-to-erasure flow.
 */

function safeEntries(transcript: unknown): any[] {
  if (Array.isArray(transcript)) return transcript;
  if (typeof transcript === 'string') {
    try { const v = JSON.parse(transcript); return Array.isArray(v) ? v : []; } catch { return []; }
  }
  return [];
}

export async function internalRoutes(app: FastifyInstance) {
  // POST /internal/data-rights/erase-files
  // Body: { sessionIds: string[], requestId?: string }
  // Unlinks each session's transcript .txt (two dir resolutions + the stored column) and
  // any recording blobs referenced in its transcript JSON. Best-effort, idempotent.
  app.post('/data-rights/erase-files', async (req: any, reply) => {
    const secret = req.headers['x-internal-secret'];
    const expected = process.env.INTERNAL_SERVICE_SECRET;
    if (!expected || secret !== expected) {
      return reply.code(401).send({ error: 'unauthorized', code: 'BAD_INTERNAL_SECRET' });
    }

    const body = (req.body ?? {}) as { sessionIds?: string[] };
    const sessionIds = Array.isArray(body.sessionIds)
      ? body.sessionIds.filter((s) => typeof s === 'string')
      : [];
    const uploadsDir = path.resolve(process.cwd(), 'uploads');
    const unlinked: string[] = [];

    const tryUnlink = (p: string) => {
      try { if (p && fs.existsSync(p)) { fs.unlinkSync(p); unlinked.push(p); } } catch { /* ignore */ }
    };

    for (const sid of sessionIds) {
      // 1) transcript .txt — two independent helpers resolve the dir differently, plus the
      //    authoritative path stored on InterviewTranscript.
      const paths = new Set<string>();
      try { paths.add(transcriptPathEnv(sid)); } catch { /* ignore */ }
      try { paths.add(transcriptPathFixed(sid)); } catch { /* ignore */ }
      try {
        const meta = await prisma.interviewTranscript.findUnique({
          where: { sessionId: sid }, select: { transcriptFilePath: true },
        });
        if (meta?.transcriptFilePath) paths.add(meta.transcriptFilePath);
      } catch { /* ignore */ }

      // 2) recording blobs referenced in the session transcript JSON (basename only).
      try {
        const session = await prisma.interviewSession.findUnique({
          where: { id: sid }, select: { transcript: true },
        });
        for (const e of safeEntries(session?.transcript)) {
          if (e && e.type === 'recording' && typeof e.filename === 'string') {
            paths.add(path.join(uploadsDir, path.basename(e.filename)));
          }
        }
      } catch { /* ignore */ }

      for (const p of paths) tryUnlink(p);
    }

    return reply.send({ ok: true, count: unlinked.length, filesUnlinked: unlinked });
  });
}
