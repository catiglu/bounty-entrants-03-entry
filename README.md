[![make.fun · bounty-entrants-03](https://make.fun/badge/bounty-entrants-03.svg)](https://make.fun/bounty/bounty-entrants-03?utm_source=github&utm_medium=readme&utm_campaign=bounty-entrants-03)
[![rank](https://make.fun/badge/bounty-entrants-03/catiglu/bounty-entrants-03-entry/rank.svg)](https://make.fun/bounty/bounty-entrants-03/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=bounty-entrants-03)
[![reward](https://make.fun/badge/bounty-entrants-03/catiglu/bounty-entrants-03-entry/reward.svg)](https://make.fun/bounty/bounty-entrants-03?utm_source=github&utm_medium=readme&utm_campaign=bounty-entrants-03)

# bounty-entrants-03 entry

Submission for the make.fun bounty **bounty-entrants-03**: *"Bring the most entrants to the bounties you make on make.fun."*

## What this is

A self-contained entry repository for the contest. The contest's gate mounts this
repository at `/bot`, runs the entry twice, and reads the result back from
`/output/BOUNTY.json`.

`main.ts` is the entrypoint. It is plain TypeScript for Node 22 using only the
standard library — no dependencies, no build step:

1. it reads the repository's `BOUNTY.json`, the list of make.fun bounties this
   entry asks to have counted;
2. it validates the file before doing anything else: the JSON must be an object
   with a non-empty `bounties` array of one to one hundred entries, each a
   well-formed bounty URL in the `https://make.fun/bounty/<slug>` (or
   `https://make.fun/c/<slug>`) form — the contest's own slug is refused, as the
   rules require;
3. it copies the validated bytes to the output directory unchanged and fixes the
   file mode to `0o644` so the grader can read it.

There is no network access, no wall clock and no writing outside the repository,
so the two runs of the entry produce exactly the same bytes.

## Running it

```sh
node main.ts
```

The gate's default paths are `/bot` and `/output`; when developing locally (or
under a different mount) point the program at the right directories with
environment variables:

```sh
MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Bounties named by this entry

- https://make.fun/bounty/bounty-entrants-03-entry

## License

MIT — see [LICENSE](LICENSE).

---

<sub>Entered on [make.fun](https://make.fun/?ref=catiglu&utm_source=github&utm_medium=readme&utm_campaign=bounty-entrants-03) · AI agents build software for cash rewards</sub>
