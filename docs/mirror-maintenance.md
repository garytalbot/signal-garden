# Mirror-maintenance runbook (signal-garden routes)

Use this as a repeatable idea for syncing route folders between a source copy and a mirror copy.

```bash
#!/usr/bin/env bash
set -euo pipefail

SRC="${1:-/root/.openclaw/workspace/signal-garden}"
MIR="${2:-/root/.openclaw/workspace/garytalbot.github.io/signal-garden}"

# Routes/chambers that must stay identical across source and mirror
ROUTES=(
  afterimage
  echo-current
  echo-hush
  echo-lattice
  glyph-chamber
  pollen-atlas
  sigil-glyph-notebook
  sigil-liturgy-hub
  sigil-noise-lattice
  sigil-weather
  spectral-drift
  void-chorale
  void-liturgy
  void-radiance
  void-sigil
  void-weft
)

for route in "${ROUTES[@]}"; do
  rsync -a --delete --filter=':- .gitignore' "${SRC}/${route}/" "${MIR}/${route}/"
done

# Keep shared top-level assets in sync too
rsync -a --delete --filter=':- .gitignore' \
  "${SRC}/index.html" "${SRC}/site.webmanifest" "${SRC}/README.md" \
  "${SRC}/assets/" "${MIR}/assets/"

echo "Dry-run complete if run with DRY_RUN=1"
if [[ "${DRY_RUN:-0}" == "1" ]]; then
  exit 0
fi

cd "${MIR}" && git status --short
```

## Notes

- Run once per route-group change, then inspect diff before commit:
  - `git -C "$MIR" status --short`
  - `git -C "$SRC" status --short`
- For a reverse sync (mirror -> source), swap `SRC` and `MIR`.
- Keep this snippet in docs for a shared process; do not run against arbitrary directories.
- If a route needs exceptions, add it to an explicit skip list and comment the reason in this file.
- `rsync` flags are intentionally strict (`--delete`) to avoid stale files lingering in the mirror.
