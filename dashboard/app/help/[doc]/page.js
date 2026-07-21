import fs from 'node:fs';
import path from 'node:path';
import { notFound } from 'next/navigation';
import LegalDoc from '../../../src/legal/LegalDoc';

// Public "Help" legal documents, served at /help/<slug> (the URLs the Terms of
// Service itself references, e.g. interviehire.com/help/privacy). Content ships in
// dashboard/content/legal/*.md (copied from the repo-root /legal/*.md source of
// truth — re-copy on change). Statically generated at build time.
const DOCS = {
  terms: { file: 'terms.md', title: 'Terms of Service' },
  privacy: { file: 'privacy.md', title: 'Privacy Policy' },
  dpa: { file: 'dpa.md', title: 'Data Processing Addendum' },
};

export const dynamic = 'force-static';

export function generateStaticParams() {
  return Object.keys(DOCS).map((doc) => ({ doc }));
}

export async function generateMetadata({ params }) {
  const { doc } = await params;
  const meta = DOCS[doc];
  return { title: meta ? `${meta.title} | intervieHire` : 'Help | intervieHire' };
}

// Strip HTML comments (the template's internal "not publishable" notes) so they
// never reach the browser, then trim.
function stripComments(md) {
  return md.replace(/<!--[\s\S]*?-->/g, '').trim();
}

export default async function HelpDocPage({ params }) {
  const { doc } = await params;
  const meta = DOCS[doc];
  if (!meta) notFound();

  const filePath = path.join(process.cwd(), 'content', 'legal', meta.file);
  let raw = '';
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch {
    raw = '';
  }

  return <LegalDoc title={meta.title} markdown={stripComments(raw)} />;
}
