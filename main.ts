// bounty-entrants-03 entry (Node 22, standard library only).
// The gate reads BOUNTY.json from /output; this program copies the repository's
// BOUNTY.json there. No network, no wall clock, no files outside the repository.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });

const source = join(BOT_DIR, 'BOUNTY.json');
const target = join(OUTPUT_DIR, 'BOUNTY.json');

try {
  const raw = readFileSync(source, 'utf8');
  const data: unknown = JSON.parse(raw);
  const bounties = typeof data === 'object' && data !== null
    ? (data as { bounties?: unknown }).bounties
    : undefined;
  if (
    !Array.isArray(bounties) ||
    bounties.length === 0 ||
    !bounties.every((url) => typeof url === 'string' && url.startsWith('https://make.fun/bounty/'))
  ) {
    throw new Error('BOUNTY.json must list at least one make.fun bounty URL');
  }
  writeFileSync(target, raw, 'utf8');
  console.log(`Validated and copied ${source} -> ${target}`);
} catch (err) {
  console.error(`BOUNTY.json could not be prepared from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
