import fs from 'node:fs';
import path from 'node:path';
import { config } from 'dotenv';

const envCandidates = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../../.env'),
];

const envPath = envCandidates.find((candidate) => fs.existsSync(candidate));

if (envPath) {
  config({ path: envPath });
}
