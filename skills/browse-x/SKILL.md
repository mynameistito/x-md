---
name: browse-x
description: Read public X (Twitter) posts, threads, profiles, search, followers, or following.
allowed-tools:
  - Bash(skills/browse-x/scripts/browse-x.sh *)
  - Bash(curl *x.pcstyle.dev*)
---

# browse X

Hosted read-only API at x.pcstyle.dev. No login, cookies, or key. Public content only.

```bash
S=skills/browse-x/scripts/browse-x.sh
$S "https://x.com/handle/status/123"                         # compact markdown thread
$S status <url> --thread off|20|full --context thread|full --replies top|recent|off --full
$S profile @handle --limit 20
$S followers handle --limit 50
$S following handle --page 2 --full
$S search "from:handle release" --feed latest|top|media --page 3 --limit 10
$S search "typescript" --cursor '<nextCursor>'
```

Direct API: `curl -sS -G https://x.pcstyle.dev/api/convert --data-urlencode url=<url> -H 'Accept: text/markdown'`, or rewrite a status URL to `https://x.pcstyle.dev/:handle/status/:id`.

- `--full` expands metadata. `--json` returns the whole response (posts, users, media, `nextCursor`, `warnings`, `source`). `--format obsidian` adds frontmatter. `--headers` prints response headers. `--nocache` bypasses the cache.
- `--page` caps at 10, `--limit` at 50. Prefer the opaque cursor for continuation.
- Video isn't downloaded; links are preserved.
- Exit 2 is bad usage, 1 is network or API error. Private, deleted, or gated posts can't be read. Fallback sources may omit replies, quotes, or media; check `warnings` instead of inventing content.
