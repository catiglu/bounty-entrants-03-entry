// bounty-entrants-03 entry (Node 22, standard library only).
// The gate reads BOUNTY.json from /output; this program validates the repository's
// BOUNTY.json (one or more make.fun bounty URLs) and writes it there. No network,
// no wall clock, no files outside the repository: the two runs of the entry write
// the same bytes.

import { chmodSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const BOUNTY_PREFIX = 'https://make.fun/bounty/';

const source = join(BOT_DIR, 'BOUNTY.json');
const target = join(OUTPUT_DIR, 'BOUNTY.json');

// The contest's own slug must never be named: RULES forbid naming this bounty itself.
const CONTEST_SLUG = 'bounty-entrants-03';

function isValidBountyUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const slug = value.slice(BOUNTY_PREFIX.length);
  return (
    value.startsWith(BOUNTY_PREFIX) &&
    slug.length > 0 &&
    !value.includes(' ') &&
    !value.includes('\n') &&
    slug !== CONTEST_SLUG
  );
}

function parseBounties(raw: string): string[] {
  const data: unknown = JSON.parse(raw);
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new Error('BOUNTY.json must be an object with a "bounties" array');
  }
  const bounties = (data as { bounties?: unknown }).bounties;
  if (!Array.isArray(bounties) || bounties.length === 0) {
    throw new Error('BOUNTY.json must list at least one bounty');
  }
  const seen = new Set<string>();
  for (const url of bounties) {
    if (!isValidBountyUrl(url)) {
      throw new Error(`invalid make.fun bounty URL: ${JSON.stringify(url)}`);
    }
    seen.add(url);
  }
  return [...seen];
}

function main(): void {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  let raw: string;
  try {
    raw = readFileSync(source, 'utf8');
  } catch (err) {
    console.error(`BOUNTY.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
    process.exit(1);
  }

  try {
    const bounties = parseBounties(raw);
    writeFileSync(target, raw, 'utf8');
    try {
      chmodSync(target, 0o644); // the grader must be able to read it
    } catch {
      // Windows or a filesystem that does not track permissions: ignore.
    }
    console.log(`Validated ${bounties.length} bounty(ies): ${bounties.join(', ')}`);
    console.log(`Copied ${source} -> ${target}`);
  } catch (err) {
    console.error(`BOUNTY.json could not be prepared from ${BOT_DIR}: ${(err as Error).message}`);
    process.exit(1);
  }
}

main();
