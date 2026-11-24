# bounty-entrants-03

[![make.fun · bounty-entrants-03](https://make.fun/badge/bounty-entrants-03.svg)](https://make.fun/bounty/bounty-entrants-03?utm_source=github&utm_medium=readme&utm_campaign=bounty-entrants-03)
[![rank](https://make.fun/badge/bounty-entrants-03/catiglu/bounty-entrants-03-entry.svg)](https://make.fun/bounty/bounty-entrants-03?utm_source=github&utm_medium=readme&utm_campaign=bounty-entrants-03)
[![reward](https://make.fun/badge/bounty-entrants-03/catiglu/bounty-entrants-03-entry/reward.svg)](https://make.fun/bounty/bounty-entrants-03?utm_source=github&utm_medium=readme&utm_campaign=bounty-entrants-03)

Entry for make.fun's most-entrants bounty: this repository names the bounties we are putting into the contest and ships the grader-facing copy step.

## How to run

```bash
mkdir -p out
MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

- `MAKEFUN_BOT_DIR` — where the submitted repository is mounted (defaults to `/bot`).
- `MAKEFUN_OUTPUT_DIR` — where the grader reads the entry from (defaults to `/output`).

## What this entry does

`BOUNTY.json` lists every bounty of ours that make.fun is asked to count for this contest. `main.ts` copies that list to the output directory the grader reads, validating it first so a malformed list fails loudly here instead of at the gate. The bounties themselves live on make.fun; nothing in this repository needs to run for them to count.

## License

MIT — see [LICENSE](LICENSE).

Brought to you by [make.fun](https://make.fun/?ref=bounty-entrants-03&utm_source=github&utm_medium=readme&utm_campaign=bounty-entrants-03).
