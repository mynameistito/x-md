# x.md

Turn public X posts, conversations, profiles, search results, and social graphs into compact Markdown for agents. The hosted API is available at [x.pcstyle.dev](https://x.pcstyle.dev); no X API key is required for the default provider path.

**Not affiliated with X Corp. Public lists are not available.**

## What it returns

- Compact, agent-friendly Markdown by default; add `?full=true` for dates, metrics, and richer profile details.
- A source URL for every post and reply, including quoted posts.
- Direct video URLs, thumbnails, duration/dimensions/bitrate when supplied, and all available video variants.
- Conversation context by default: parents, the author's thread, and top replies. Use `context` and `replies` to narrow it.
- Structured JSON with the rendered Markdown and raw post/profile data via `?format=json` or `Accept: application/json`.
- Profiles with profile data and up to 20 latest original posts by default.
- Search, followers, and following, with cursor or bounded page pagination.

## Use the hosted API

Replace `x.com` with `x.pcstyle.dev` on a public status URL:

```text
https://x.com/handle/status/1234567890
https://x.pcstyle.dev/handle/status/1234567890
```

```bash
curl -sS -H 'Accept: text/markdown' \
  'https://x.pcstyle.dev/handle/status/1234567890'

curl -sS -G 'https://x.pcstyle.dev/api/convert' \
  --data-urlencode 'url=https://x.com/handle/status/1234567890'
```

Browsers that request HTML get a readable page containing the Markdown. Agents can explicitly request `text/markdown`.

## Post conversion

Both `GET /:handle/status/:id` and `GET /api/convert?url=…` support:

| Parameter | Default | Supported values |
| --- | --- | --- |
| `format` | `markdown` | `markdown`, `obsidian`, `json` |
| `full` | false | `true`, `1`, or `yes` enables expanded Markdown; Obsidian is always expanded |
| `thread` | `full` | `off`, `full`, `conversation`, or a limit from `2` to `100` |
| `context` | `full` | `full` includes parents, author thread, and selected replies; `thread` excludes unrelated replies |
| `replies` | `top` | `top`, `recent`, `off` |
| `userinfo` | `off` | `off`, `author`, `all` |
| `nocache` | false | `true`, `1`, or `yes` bypasses the application cache |

`thread=off` returns only the requested post. The default conversation result is ordered and labels posts as parent, post, thread, or reply when that data is available. Provider fallbacks can return less context, article content, or quote data.

```bash
# Expanded conversation without replies
curl -sS 'https://x.pcstyle.dev/handle/status/1234567890?full=true&replies=off'

# Author thread only, capped at 20 posts
curl -sS 'https://x.pcstyle.dev/handle/status/1234567890?context=thread&thread=20'

# Structured output
curl -sS -H 'Accept: application/json' \
  'https://x.pcstyle.dev/handle/status/1234567890'
curl -sS 'https://x.pcstyle.dev/handle/status/1234567890?format=json'
```

JSON conversion responses contain `url`, `markdown`, raw `posts`, `compact`, `warnings`, `postCount`, `source`, `cache`, and `format`. Media in both Markdown and `posts` includes direct video data when the upstream provider exposes it; availability and lifetime of X CDN URLs are controlled by X.

## Browse profiles and X

Browse routes return compact Markdown by default and structured data with `?format=json` or `Accept: application/json`.

| Route | Behavior |
| --- | --- |
| `GET /:handle` | Profile data and latest original posts (replies and reposts filtered out) |
| `GET /search?q=…` | Search posts; `feed=latest`, `top`, or `media` (invalid values fall back to `latest`) |
| `GET /:handle/followers` | Followers |
| `GET /:handle/following` | Accounts followed |

The default `limit` is 20 and the maximum is 50. Pass the opaque `cursor` returned as `nextCursor`, or use `page=1` through `page=10`; values above 10 are clamped. Without a cursor, page pagination walks upstream pages and can be slower. A cursor fetches one upstream page. Results can contain fewer items than `limit`, especially profiles, because replies and reposts are filtered after retrieval.

```bash
curl -sS 'https://x.pcstyle.dev/elonmusk'
curl -sS 'https://x.pcstyle.dev/search?q=typescript&feed=latest&limit=20'
curl -sS 'https://x.pcstyle.dev/elonmusk/followers?full=true'
curl -sS -H 'Accept: application/json' \
  'https://x.pcstyle.dev/elonmusk/following?limit=50'
```

### Direct `/api/browse` usage

Use `resource=profile|search|followers|following`, plus the corresponding `handle` or `q`:

```bash
curl -sS -G 'https://x.pcstyle.dev/api/browse' \
  --data-urlencode 'resource=profile' \
  --data-urlencode 'handle=elonmusk'

curl -sS -G 'https://x.pcstyle.dev/api/browse' \
  --data-urlencode 'resource=search' \
  --data-urlencode 'q=typescript' \
  --data-urlencode 'feed=top' \
  --data-urlencode 'format=json'
```

Browse JSON includes the resource-specific `profile`, `posts`, or `users`, plus `page`, `limit`, optional `nextCursor`, rendered `markdown`, and cache status. The verified upstream profile API does not expose pinned-post markers, and public X lists are explicitly unsupported.

## Agent skill

Install the hosted skill, `browse-x`, with the [skills CLI](https://skills.sh/):

```bash
bunx skills add pc-style/x-md -g -y --skill browse-x
```

The skill uses `https://x.pcstyle.dev`; it does not require a local checkout or local API keys.

## Caching and reliability

FxTwitter is the primary data provider and X's syndication endpoint is the fallback. Self-hosted deployments may additionally configure Context.dev and Firecrawl. `X-Source` reports `fxtwitter`, `syndication`, `contextdev`, or `firecrawl`; `X-Cache` reports cache status. Browse endpoints use FxTwitter directly.

Successful responses are cached for about one hour by default (`CACHE_TTL_SECONDS=3600`) and send cache headers unless bypassed. `nocache=true` bypasses the application cache, but it cannot bypass upstream caches. Public X data can be missing, delayed, rate-limited, deleted, protected, or shaped differently by upstream providers, so context, counts, media variants, and pagination cursors are best effort. The API does not authenticate to private accounts and does not provide public lists.

## Self-host

```bash
git clone https://github.com/pc-style/x-md.git
cd x-md
bun install
cp .env.local.example .env.local
bun run dev
```

Optional environment variables:

| Variable | Description |
| --- | --- |
| `CONTEXT_DEV_API_KEY` | Context.dev converter fallback |
| `FIRECRAWL_API_KEY` | Firecrawl converter fallback |
| `CACHE_TTL_SECONDS` | Cache TTL; default `3600` |
| `CACHE_DISABLED` | Set to `1` to disable caching |
| `CACHE_PERSIST` | Set to `0` for memory-only caching |

Deploy with Vercel after `bun run build`; `vercel.json` configures `dist`, the API handlers, and all public route rewrites.

## Project layout

```text
api/convert.ts     Post conversion handler
api/browse.ts      Profile, search, followers, and following handler
lib/               Providers, rendering, pagination, and cache
src/               Vite landing page and rendered documentation
```

## License

[MIT](LICENSE)
