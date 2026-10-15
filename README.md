# tanisha-byte.github.io

My personal site: devrel, talks, writing, and side quests. Live at https://tanisha-byte.github.io

## Layout

```
data/        talks, videos, projects, writing, press and stats (JSON)
pages/       page bodies (HTML) - can embed {{ blocks }} filled from data/
templates/   the shared layout (head, nav, footer)
static/      css, js, favicon - copied as-is
build.py     renders everything into _site/
```

## Common edits

- **New talk**: add an entry to `data/talks.json`. Set `"featured": true` to show it on the home page, `"video": "<youtube id>"` to add a watch link, and `"upcoming": true` for future events.
- **New video**: add it to the right group in `data/videos.json`. Thumbnails come from YouTube automatically.
- **New post**: add it to `data/writing.json`.
- **Talk count / headline stats**: `data/site.json`.

## Build locally

```sh
python3 build.py                              # no dependencies
python3 -m http.server -d _site 8000          # preview at http://localhost:8000
```

Pushing to `main` builds and deploys through GitHub Actions (`.github/workflows/deploy.yml`).
