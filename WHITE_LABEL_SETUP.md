# White-label deployment checklist

## Environment settings
`BRAND_NAME`, `BRAND_TAGLINE`, `BRAND_LOGO_URL`, `BRAND_PRIMARY_COLOR`, `BRAND_CONTACT_PHONE`, `BRAND_CONTACT_ADDRESS`, `BRAND_LOCATION_QR_URL`, `PROGRAM_NAME`, `ADMISSION_PREFIX`, `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_PASSWORD`, and `MANAGER_PASSWORD`.

## Routes
- `/` — registration site
- `/management` — management dashboard/login
- `/management/students`, `/management/fees`, `/management/backup`, etc. — management features under the same prefix

## Before production
1. Add a real logo and review all pages, PDFs, WhatsApp messages, QR/location content and notification copy for customer-specific details.
2. Set strong unique secrets and passwords.
3. Verify database schema initialization and back up existing data.
4. Configure persistent storage or object storage for uploads, PDFs, and backups.
5. Execute the acceptance checklist in README_COMBINED.md on staging.
6. Test restore from a backup and verify authorization boundaries.

This source bundle is not a guarantee of zero defects or a substitute for customer-specific security and acceptance testing.
