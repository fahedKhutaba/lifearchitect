# ADR-0003: Authentication for V1

- **Status:** Accepted
- **Date:** 2026-10-29
- **Deciders:** Lead

## Context

V1 has a small, known set of users: the Lead plus 2–3 invited people. There is no public sign-up. The data is personal (goals, plans), so it must stay private per user. A React Native mobile app is planned later and must be able to use the same backend. V1 has no budget for, or need of, third-party identity services or an email provider.

## Decision

Authentication is built into the NestJS backend, **login only**:

- **Accounts** are created by an admin command in the backend (for example `pnpm --filter backend user:create`). There is no sign-up page or endpoint.
- **Credentials:** email + password. Passwords are hashed with **argon2id**. Plain passwords are never stored or logged.
- **Sessions:** server-side, stored in PostgreSQL. On login the backend issues a random opaque token (at least 32 bytes). Only its SHA-256 hash is stored, with the user id and an expiry date.
- **Web:** the token travels in an `HttpOnly`, `Secure`, `SameSite=Lax` cookie. State-changing requests require a JSON body and an allowed `Origin`, which covers CSRF.
- **Mobile (later):** the same token sent as `Authorization: Bearer <token>`. No new auth system needed.
- **Logout** deletes the session row. Deleting a user's sessions logs them out everywhere.
- **Login throttling:** failed login attempts are rate-limited per IP and per email.
- **Password reset:** not in V1. The admin resets passwords with the same backend command.
- **Authorization:** every goal, milestone and task belongs to one user. Every query is scoped to the logged-in user.

Exact values (session lifetime, throttle limits) are set in the auth spec.

## Options considered

| Option | Pros | Cons |
|---|---|---|
| A. Own auth in NestJS, sessions in Postgres (chosen) | No third party; sessions can be revoked; works for web and mobile; small for login-only | We own the security-sensitive code |
| B. Auth.js in Next.js | Quick for the web app | Auth sits in the frontend; NestJS and mobile need extra work |
| C. Hosted provider (Clerk / Auth0 / Supabase Auth) | Least code; sign-up and reset included | External dependency; personal data with a third party; cost later |
| D. OAuth only (GitHub / Google) | No passwords stored | Needs provider apps and secrets; not every user has these accounts |
| Stateless JWT instead of DB sessions | No session lookup per request | Hard to revoke; refresh-token logic adds complexity |

## Consequences

- The auth surface stays small: login, logout, current user, plus the admin command. No sign-up, email verification or reset flows to build or test.
- QA must cover: wrong password, throttling, expired session, logout, and one user being unable to read another user's data.
- Adding public sign-up, password reset by email, or social login later is a new ADR (it needs an email provider and abuse protection).
- Session secrets and DB credentials come from environment variables only. `.env` is never committed.
