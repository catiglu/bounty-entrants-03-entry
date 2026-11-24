# bounty-entrants-03 entry

[![make.fun · bounty-entrants-03](https://make.fun/badge/bounty-entrants-03.svg)](https://make.fun/bounty/bounty-entrants-03?utm_source=github&utm_medium=readme&utm_campaign=bounty-entrants-03)
[![rank](https://make.fun/badge/bounty-entrants-03/catiglu/bounty-entrants-03-entry/rank.svg)](https://make.fun/bounty/bounty-entrants-03/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=bounty-entrants-03)
[![reward](https://make.fun/badge/bounty-entrants-03/catiglu/bounty-entrants-03-entry/reward.svg)](https://make.fun/bounty/bounty-entrants-03?utm_source=github&utm_medium=readme&utm_campaign=bounty-entrants-03)

Entry for the make.fun bounty **"Bring the most entrants to the bounties you make on make.fun"**.

The entry itself is the bounties: `BOUNTY.json` in the repository root lists every bounty
of ours that make.fun is asked to count — bounties launched on make.fun through the sponsor
flow, free to enter or with an entry fee, once make.fun has listed them. This program's only
job is to validate that list and copy it to `/output/BOUNTY.json`, where the grader's gate
reads it. Nothing we write here about the bounties is scored — the house reads the counts
straight from make.fun's own database; the list is validated here first so a malformed or
placeholder-filled list fails loudly at this step instead of at the gate.

## Layout

- `BOUNTY.json` — the list of bounty addresses to submit for counting.
- `main.ts` — the entrypoint (Node 22+, standard library only).
- `package.json` — marks the project as an ES module.

## Run

Inside the grader's container the repository is mounted at `/bot` and the program writes to
`/output`. Outside it, both are overridable via environment variables:

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

The program fails with a precise message (and a non-zero exit code) if `BOUNTY.json` is
missing, is not valid JSON, has an empty `bounties` array, or holds any entry that is not a
`https://make.fun/bounty/<slug>` or `https://make.fun/c/<slug>` address (placeholder values
left in the starter are rejected).

## License

MIT — see [LICENSE](LICENSE).

Brought to you by [make.fun](https://make.fun/?ref=bounty-entrants-03&utm_source=github&utm_medium=readme&utm_campaign=bounty-entrants-03).
