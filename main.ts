// bounty-entrants-03 entry.
//
// The entry itself is the bounties: BOUNTY.json in this repository lists every
// bounty of ours that make.fun is asked to count. This program's only job is to
// copy that list to /output/BOUNTY.json, where the grader's gate reads it.
// Nothing we write here about the bounties is scored - the house reads the
// counts straight from make.fun's own database.
//
// Outside the grader's container, MAKEFUN_BOT_DIR stands in for /bot (where the
// submitted repository is mounted) and MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const srcPath = join(BOT_DIR, 'BOUNTY.json');
const dstPath = join(OUTPUT_DIR, 'BOUNTY.json');

// Read the source first so we can fail loudly and early if it is missing,
// rather than copying a broken list the gate would only reject later.
let raw: string;
try {
  raw = readFileSync(srcPath, 'utf8');
} catch (err) {
  console.error(`BOUNTY.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

let bounties: unknown;
try {
  const parsed = JSON.parse(raw) as { bounties?: unknown };
  bounties = parsed.bounties;
} catch (err) {
  console.error(`BOUNTY.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}

if (!Array.isArray(bounties) || bounties.length === 0) {
  console.error('BOUNTY.json must contain a non-empty "bounties" array.');
  process.exit(1);
}

// Every entry must be a non-empty string address; a malformed list would only
// be rejected by the gate later, so fail here with a precise message instead.
for (let i = 0; i < bounties.length; i++) {
  const entry = bounties[i];
  if (typeof entry !== 'string' || entry.trim() === '') {
    console.error(`BOUNTY.json: bounties[${i}] must be a non-empty string address.`);
    process.exit(1);
  }
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(srcPath, dstPath);
} catch (err) {
  console.error(`BOUNTY.json could not be copied to ${OUTPUT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

console.log(`Copied ${bounties.length} bounty address(es) to ${dstPath}:`);
for (const entry of bounties as string[]) {
  console.log(`  - ${entry}`);
}
