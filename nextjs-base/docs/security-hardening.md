# Security Hardening

This document explains the security protections enabled in `nextjs-base` and how to configure them in production (Vercel).

## What Is Already Implemented

### 1. Public API origin checks

- Utility: `src/lib/public-api-security.ts`
- Used by:
  - `src/app/api/contact/route.ts`
  - `src/app/api/reservation/route.ts`
- Behavior:
  - Allows same-origin requests (`request.nextUrl.origin`)
  - Optionally allows extra origins from `PUBLIC_API_ALLOWED_ORIGINS`
  - Rejects invalid `Origin`/`Referer` with HTTP `403`

### 2. Rate limiting with distributed store fallback

- Utility: `src/lib/rate-limit.ts`
- Used by:
  - `src/app/api/contact/route.ts`
  - `src/app/api/reservation/route.ts`
- Behavior:
  - Uses Upstash Redis REST when configured
  - Falls back to in-memory limiter when Upstash is not configured/unavailable
  - Returns HTTP `429` and headers:
    - `Retry-After`
    - `X-RateLimit-Limit`
    - `X-RateLimit-Remaining`
    - `X-RateLimit-Source` (`upstash` or `memory`)

### 3. Existing anti-abuse controls

- Honeypot field support in contact and reservation APIs
- Input validation and sanitization

## Required Environment Variables

Configure these in Vercel `Project -> Settings -> Environment Variables`.

### Recommended (production)

```env
UPSTASH_REDIS_REST_URL=https://<your-db-endpoint>.upstash.io
UPSTASH_REDIS_REST_TOKEN=<your-upstash-rest-token>
PUBLIC_API_ALLOWED_ORIGINS=https://vivo.com,https://www.vivo.com
```

Notes:

- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are provided by Upstash in the database `REST API` section.
- `PUBLIC_API_ALLOWED_ORIGINS` is comma-separated (no spaces recommended).
- Same-origin requests are always allowed automatically.

### Local development (optional)

Put the same values in `nextjs-base/.env.local` for local testing.

## Upstash Setup Notes

1. Create a Redis database in Upstash.
2. For a rate-limiter-only DB, `Eviction` can be enabled.
3. Copy `REST URL` and `REST TOKEN`.
4. Add them to Vercel env vars.

## Deployment Checklist

1. Add env vars in Vercel for `Production`.
2. If needed, add them for `Preview` too.
3. Redeploy the project.
4. Validate behavior:

- From allowed origin: API requests succeed (`200`/`400` depending on payload).
- From non-allowed origin: API returns `403`.
- After repeated requests: API returns `429` with rate-limit headers.

## Quick Verification

After deployment, test endpoints:

- `POST /api/contact`
- `POST /api/reservation`

Expected:

- Normal traffic: success or validation errors.
- Excessive traffic: `429`.
- Bad origin/referer: `403`.

## Troubleshooting

### `X-RateLimit-Source: memory` in production

Cause:

- Upstash env vars missing/invalid, or Upstash temporary issue.

Action:

1. Verify `UPSTASH_REDIS_REST_URL`.
2. Verify `UPSTASH_REDIS_REST_TOKEN`.
3. Redeploy after env update.

### Unexpected `403` on frontend requests

Cause:

- Domain missing in `PUBLIC_API_ALLOWED_ORIGINS`.

Action:

1. Add exact origin(s), including protocol.
2. Redeploy.

## Future Hardening (Optional)

- Add CAPTCHA (Cloudflare Turnstile) on contact and reservation forms.
- Add structured logging and monitoring alerts for repeated `429` and `403`.
