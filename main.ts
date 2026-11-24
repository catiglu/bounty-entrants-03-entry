// bounty-entrants-03 entry — v2.
//
// The entry itself is the bounties: BOUNTY.json in this repository lists every
// bounty of ours that make.fun is asked to count. This program's only job is to
// copy that list to /output/BOUNTY.json, where the grader's gate reads it.
// Nothing we write here about the bounties is scored - the house reads the
// counts straight from make.fun's own database.
//
// v2 tightens v1's validation: we read BOUNTY.json, check it parses as JSON with
// a non-empty "bounties" array of non-empty string addresses, reject leftover
// placeholders (e.g. the starter's "<slug>") and malformed URLs, and only then
// write the validated list to the output directory. A malformed list fails
// loudly here instead of being rejected by the gate later.
//
// Outside the grader's container, MAKEFUN_BOT_DIR stands in for /bot (where the
// submitted repository is mounted) and MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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

// Every entry must be a non-empty string address. v2 additionally rejects
// placeholder values left in the starter ("<slug>") and whitespace-padded or
// obviously malformed URLs, so the gate never sees an address it cannot read.
const BOUNTY_URL = /^https:\/\/make\.fun\/(bounty|c)\/[A-Za-z0-9._~-]+$/;

for (let i = 0; i < bounties.length; i++) {
  const entry = bounties[i];
  if (typeof entry !== 'string' || entry.trim() === '') {
    console.error(`BOUNTY.json: bounties[${i}] must be a non-empty string address.`);
    process.exit(1);
  }
  const addr = entry.trim();
  if (addr.includes('<') || addr.includes('>')) {
    console.error(`BOUNTY.json: bounties[${i}] still holds a placeholder address ("${addr}").`);
    process.exit(1);
  }
  if (!BOUNTY_URL.test(addr)) {
    console.error(`BOUNTY.json: bounties[${i}] is not a make.fun bounty URL ("${addr}").`);
    process.exit(1);
  }
}

// Write the validated, trimmed list (re-serialized) rather than copying the raw
// bytes: we have just proven the content is well-formed, and normalizing the
// whitespace keeps the gate's input clean.
mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  writeFileSync(dstPath, `${JSON.stringify({ bounties: (bounties as string[]).map((a) => a.trim()) }, null, 2)}\n`, 'utf8');
} catch (err) {
  console.error(`BOUNTY.json could not be written to ${OUTPUT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

console.log(`Wrote ${bounties.length} validated bounty address(es) to ${dstPath}:`);
for (const entry of bounties as string[]) {
  console.log(`  - ${entry.trim()}`);
}
