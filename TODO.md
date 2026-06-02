# TODO - Fix Railway/Deployed backend not working

## Step 1: Fix API base URL for production
- Update `src/api/api.js` to use `import.meta.env.VITE_API_BASE_URL` with fallback.

## Step 2: Fix Django to use MySQL in deployment
- Update `config/config/settings.py` to read MySQL settings from environment variables:
  - DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT
- Default to SQLite for local dev.

## Step 3: Ensure MySQL driver installed
- Ensure `mysqlclient` is used/compatible with Windows build.

## Step 4: Migrate on deployment
- Verify Railway/Render command runs `python manage.py migrate`.
- If needed, add migration command into deploy Procfile.

## Step 5: Run tests locally
- Run backend locally and verify endpoints:
  - /api/search/
  - /api/booked/<bus_id>/
  - /api/book/

## Step 6: Validate React works
- Confirm frontend now calls deployed backend URL and booked seats show properly.

