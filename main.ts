// bounty-entrants-03 entry entrypoint (Node 22, standard library only).
//
// The make.fun gate mounts this repository at /bot, runs this program twice,
// and reads /output/BOUNTY.json back. This program therefore:
//   1. reads the repository's BOUNTY.json (the list of bounties this entry
//      wants counted, each a make.fun bounty URL),
//   2. validates it (object, non-empty "bounties" array, well-formed
//      https://make.fun/bounty/<slug> URLs, never this contest's own slug),
//   3. writes it byte-for-byte to the output directory with mode 0o644 so
//      the grader can read it.
//
// No network, no wall clock, no files outside the repository: the two runs
// of the entry write exactly the same bytes.

import { chmodSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** Directory the repository is mounted at when the gate runs the entry. */
const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
/** Directory the gate reads the entry's result from. */
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const BOUNTY_PREFIX = 'https://make.fun/bounty/';
/** RULES also accept the shorthand form of a bounty's page. */
const BOUNTY_PREFIX_ALT = 'https://make.fun/c/';

/** This contest's own slug: RULES forbid naming this bounty itself. */
const CONTEST_SLUG = 'bounty-entrants-03';

/**
 * A bounty URL is one of the two accepted prefixes followed by a non-empty
 * slug with no whitespace, control characters or trailing slash, and must not
 * be this contest itself.
 */
function isValidBountyUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const prefix = value.startsWith(BOUNTY_PREFIX)
    ? BOUNTY_PREFIX
    : value.startsWith(BOUNTY_PREFIX_ALT)
      ? BOUNTY_PREFIX_ALT
      : null;
  if (prefix === null) return false;
  const slug = value.slice(prefix.length);
  if (slug.length === 0) return false;
  if (/\s/.test(slug)) return false;
  if (slug.endsWith('/')) return false;
  return slug !== CONTEST_SLUG;
}

/**
 * Parses and validates BOUNTY.json. Returns the deduplicated list of bounty
 * URLs, keeping the first occurrence order.
 */
function parseBounties(raw: string): string[] {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    throw new Error(`BOUNTY.json is not valid JSON: ${(err as Error).message}`);
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new Error('BOUNTY.json must be an object with a "bounties" array');
  }
  const bounties = (data as { bounties?: unknown }).bounties;
  if (!Array.isArray(bounties)) {
    throw new Error('BOUNTY.json must have a "bounties" array');
  }
  if (bounties.length === 0) {
    throw new Error('BOUNTY.json must list at least one bounty');
  }
  if (bounties.length > 100) {
    throw new Error(`BOUNTY.json lists ${bounties.length} bounties; at most 100 are allowed`);
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

/** Copies BOUNTY.json from the bot directory to the output directory. */
function main(): void {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const source = join(BOT_DIR, 'BOUNTY.json');
  const target = join(OUTPUT_DIR, 'BOUNTY.json');

  let raw: string;
  try {
    raw = readFileSync(source, 'utf8');
  } catch (err) {
    console.error(`Could not read ${source}: ${(err as Error).message}`);
    process.exit(1);
  }

  let bounties: string[];
  try {
    bounties = parseBounties(raw);
  } catch (err) {
    console.error(`Could not validate BOUNTY.json: ${(err as Error).message}`);
    process.exit(1);
  }

  // Write the bytes through unchanged so the two runs are identical.
  writeFileSync(target, raw, 'utf8');
  try {
    chmodSync(target, 0o644); // the grader must be able to read it
  } catch {
    // Windows or a filesystem without permission tracking: nothing to do.
  }

  console.log(`Validated ${bounties.length} bounty(ies):`);
  for (const url of bounties) console.log(`  ${url}`);
  console.log(`Copied ${source} -> ${target}`);
}

main();
