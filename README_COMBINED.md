# Combined White-Label Registration + Student Management

This project combines the original React/Express registration site with the Flask student-management application. Express serves the public site at `/`; it proxies `/management/*` to a private Gunicorn process. Both applications use the configured PostgreSQL URL but keep their own tables.

## Local run
1. Install Node.js 20+, Python 3.11+, and PostgreSQL.
2. Copy `.env.example` to `.env` and fill in a real PostgreSQL URL and strong unique secrets. Export those variables in your shell (or use your host's environment settings).
3. `cd FCFPSL-main && npm ci && npm run build && cd ..`
4. `python -m pip install -r SLManagement-main/requirements.txt`
5. `node start-production.js`
6. Open `/` and `/management`.

## Hosting
A Render blueprint is provided in `render.yaml`. Configure all required environment variables, and ensure the PostgreSQL database is reachable. The host's build environment must support both Node and Python.

## Branding
Set `BRAND_NAME`, `BRAND_TAGLINE`, `BRAND_LOGO_URL`, `BRAND_PRIMARY_COLOR`, `BRAND_CONTACT_PHONE`, `BRAND_CONTACT_ADDRESS`, `BRAND_LOCATION_QR_URL`, `PROGRAM_NAME`, and `ADMISSION_PREFIX`. To use a local logo, place the file at `FCFPSL-main/client/public/branding/logo.png` before building. The app's visible header/footer branding is runtime configurable. The registration pages contain some program-specific copy and original media that must be reviewed/customized per customer; this project should not be represented as fully white-label audited until that review is complete.

## Production cautions
- Configure HTTPS and persistent storage for uploads, generated PDFs, and backups.
- Use a managed PostgreSQL database with backups and least-privilege credentials.
- Configure strong `ADMIN_PASSWORD` and `MANAGER_PASSWORD`; neither has a safe default.
- Review public receipt/profile token logic and access controls before handling real student records.
- Run staging acceptance tests on registration, login, management CRUD, fees, receipts, exports, backup/restore, uploads, mobile layout, and redirects before production.
- Never commit secrets or student data.
