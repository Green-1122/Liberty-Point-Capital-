# Application smoke-test checklist

- `GET /health.php` returns `ok`.
- Unauthenticated users are redirected from protected routes.
- Login regenerates the session identifier.
- Invalid CSRF tokens are rejected.
- Users cannot read another user's account, transaction, trade, or pension data.
- Admin routes reject non-admin users.
- Admins cannot suspend themselves.
- Trade execution remains paper-only unless a separately reviewed broker adapter is enabled.
- Database credentials are not committed.
