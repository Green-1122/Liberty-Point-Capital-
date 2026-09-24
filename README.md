# Liberty Point Capital

Production-oriented PHP 8+ fintech banking platform for LAMP/LEMP deployments.

> This repository contains a staged financial application. Trading is paper-only until a regulated broker, suitability controls, KYC/AML review, double-entry ledger, reconciliation, and operational approval are implemented.

## Platform layout

```text
config/          Application and database configuration
controllers/     HTTP controllers and request orchestration
core/            Router, controller, model, and application primitives
database/        MySQL/phpMyAdmin-compatible migrations
helpers/         Environment, CSRF, flash, formatting, and security helpers
middleware/      Authentication and authorization middleware
models/          PDO-backed domain models
public/          Web root, rewrite rules, CSS, and JavaScript
views/           Server-rendered layouts and feature views
storage/         Runtime logs/cache (outside the public web root)
tests/           Application smoke and security test notes
```

## Quick start

1. Create a MySQL database and least-privilege application user.
2. Copy `.env.example` to a server-side environment file and set credentials.
3. Apply migrations in order:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p hana_eunhaeng < database/schema-extended.sql
mysql -u root -p hana_eunhaeng < database/pension.sql
mysql -u root -p hana_eunhaeng < database/trading.sql
mysql -u root -p hana_eunhaeng < database/security.sql
```

4. Point Apache/Nginx document root to `public/`.
5. Ensure PHP 8.1+ has `pdo_mysql`, `mbstring`, `openssl`, and `json` enabled.
6. Run a syntax smoke check:

```bash
find config controllers core helpers middleware models public -name '*.php' -print0 | xargs -0 -n1 php -l
```

## Security baseline

- Keep application directories outside the web root.
- Never commit `.env` or production credentials.
- Use HTTPS and secure, HttpOnly, SameSite cookies.
- Use prepared statements only.
- Keep real-money execution disabled until regulated integrations and controls are approved.
- Back up the database before every migration.
