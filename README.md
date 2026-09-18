# PG Workbench

A PostgreSQL learning app with 7, 15 and 30-day study plans, learner accounts and an administrator progress dashboard. This is the account-enabled Vercel source edition. Start with **[ACCOUNT_SETUP.md](ACCOUNT_SETUP.md)** before deployment.

## Included

- 30 teaching modules covering querying, analytics, relational design and production concepts.
- 90 exercises with tasks, hints, reference SQL and automatic result or schema/behavior checks.
- 25 related tables, 90,532 deterministic synthetic records, and a reporting view.
- Commerce, HR/project, subscription/event and telecom datasets.
- A real PostgreSQL engine through PGlite 0.5.8 (PostgreSQL 18.3) running in a browser worker.
- SQL highlighting, autocomplete, query history, statement result tabs, CSV export and SQL downloads.
- 60 interview cards, a 20-question knowledge check and a 45-minute SQL mock.
- Sign-in, self-service sign-up, email invitations and password reset.
- Cloud progress per user, with private notes/drafts and JSON export/import.
- Administrator dashboard to create learners and track progress by username.
- pgAdmin, DBeaver, optional Docker, backup/restore, roles, locking and portfolio guides.

Supabase stores authentication and learning progress. The practice SQL engine still runs in the browser. Setup requires your own Supabase project and Vercel environment variables; see ACCOUNT_SETUP.md. The earlier offline Laptop ZIP remains a separate edition without accounts.

## Run locally

Use Node.js 22+, run `npm ci`, copy `.env.example` to `.env`, and configure your Supabase project as described in ACCOUNT_SETUP.md. Run `npm run dev` and open `http://localhost:4173`. Internet is required for accounts and cloud progress.

## Deploy the Vercel edition

1. Extract the Vercel ZIP.
2. Upload the folder contents to a GitHub repository. The repository root should contain `package.json`, `package-lock.json`, `index.html`, `src/`, `public/` and `vercel.json`.
3. In Vercel, choose **Add New → Project**, import the repository and set the correct Root Directory if your files are nested.
4. Use these settings:

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js version | 22.x or newer supported by Vercel |
| Environment variables | Four values listed in ACCOUNT_SETUP.md |

5. Complete ACCOUNT_SETUP.md: install the Supabase schema, configure the four environment variables and email redirect URLs, and deploy. Sign up and promote your own account using the supplied SQL. Open the HTTPS URL and sign in. The first visit downloads and seeds the PostgreSQL engine, so allow time for the database-ready indicator.

`vercel.json` supplies the framework, build command, output directory and basic response headers. Navigation uses URL hashes. Vercel serves the application and the protected `/api/invite` function. Supabase provides authentication and cloud progress; each account has an independent browser practice database. This archive has been built and tested locally, but has not been deployed to your Vercel account.

See [Vercel's Vite documentation](https://vercel.com/docs/frameworks/frontend/vite).

## Develop or modify

```sh
npm ci
npm run dev
```

Open the printed local address (port 4173). To produce the deployable build:

```sh
npm run build
npm start
```

Do not run both development and laptop servers on port 4173 simultaneously. Keep `package-lock.json` when deploying. Node 22+ is the supported project baseline.

## Study plans

| Plan | Suggested effort | Intended use |
|---|---|---|
| 30 days | 90–120 minutes daily | Beginner-friendly, one module each day |
| 15 days | 3–4 hours daily | Two modules daily; helpful with prior SQL exposure |
| 7 days | 7–9 hours daily | Intensive revision for learners who already know basic SQL |

Every plan covers all 30 modules and 90 exercises. No schedule can guarantee that anyone becomes job-ready in a fixed number of days. Use the knowledge check, unassisted re-solves, design explanations, local server drills and two portfolio deliverables as evidence of progress. Extend the plan when needed.

## Practice workflow

1. Choose a plan and day on **Learning path**.
2. Open the day's lab and read the **Lesson**.
3. Write a query and choose **Run SQL** (or Ctrl/Cmd+Enter). A selected fragment runs on its own; otherwise the whole editor runs.
4. Choose **Check answer** to check the entire editor against an untouched reference dataset.
5. For a design/DML exercise, **Prepare lab** installs the stated fixtures in your personal `lab` schema. This intentionally replaces existing `lab` objects after confirmation. The checker prepares its own fixtures independently.
6. Save useful queries and notes. **Database explorer → Restore original database** restores the sample data and clears your lab objects while keeping learning progress and drafts.

Queries run only on your own browser engine. They do not affect other learners. Arbitrary SQL is intentionally allowed for practice, so the app is not intended as a production database security boundary.

### How checking works

- Query exercises compare column names/order and result values against a reference query. Duplicate multiplicity is significant. Row order is checked when the task requires it.
- Decimal values are normalized without coercing arbitrary large decimal strings to JavaScript floating point.
- Design/DML exercises run on isolated starter fixtures and check final rows, metadata and selected constraint behavior.
- Each check rolls back its work. The grader uses a separate clean in-memory database; changes to your practice database do not change expected answers.
- The checker manages transactions. Do not submit BEGIN, COMMIT, ROLLBACK, session-control statements, DO or CALL to **Check answer**. Use **Run SQL** for open practice of such statements.
- Result matching on one deterministic dataset is learning feedback, not a proof of general correctness or an anti-cheating certification. Manually test edge cases and explain the query.
- Query result preview and CSV exports are capped at 500 returned rows. Add a LIMIT to large exploratory queries; the engine still executes your SQL.
- The browser worker can be cancelled. Long operations time out and require reconnecting. Committed persistent changes are kept; an open transaction may be lost.

## Storage and privacy

Progress, notes and drafts sync to the signed-in Supabase account. Wait for the saved indicator before changing devices. If a save fails, retry or export a backup before closing. Cloud writes use revision checks to prevent silent overwrites between devices. See ACCOUNT_SETUP.md for conflict recovery and shared-computer guidance.

The practice database uses account-specific IndexedDB on secure origins or localhost and a tab lock. Its SQL changes stay on that browser/device and are not included in progress backups. If browser persistence is unavailable, the app uses a temporary database with a visible warning. Keep one active lab tab per account.

The administrator dashboard exposes learning summaries, not private notes/drafts. Records include client-checked and imported progress and are not independently verified assessments. There is no separate third-party analytics integration.

## Bring the database to pgAdmin or DBeaver

Install an actual PostgreSQL server (16+) first; pgAdmin and DBeaver are clients. Create an empty `pg_workbench` database, connect to it and execute all of `public/database/academy.sql`. It intentionally fails if its schemas already exist rather than silently replacing your data.

```sql
SELECT (SELECT count(*) FROM academy.orders) AS orders,
       (SELECT count(*) FROM academy.order_items) AS order_items,
       (SELECT count(*) FROM academy.cells) AS cells;
```

Expected: `10000`, `30000`, `600`.

Use the app's **Local setup** page or `docs/LOCAL_SETUP.md` for detailed instructions. Your native server and the browser engine are independent; this app does not collect your database password or directly connect a public website to your laptop.

### Optional Docker server

```sh
# Copy .env.example to .env and choose a password first.
docker compose up -d
```

Connect with host `localhost`, port `5433`, database `pg_workbench`, user `learner`, and the password in `.env`. The supplied seed runs only on a new empty volume. `docker compose stop` preserves the data. Do not delete the named volume unless you intend to erase the practice database. The compose definition is supplied as an optional setup; Docker was not available in the build environment to execute it.

## Curriculum and files

- `src/data/curriculum.js`: lessons, exercises, expected results and plan mappings.
- `src/data/guides.js`: installation instructions, local drills and 20 quiz questions.
- `src/db.worker.js`: database initialization, execution, schema exploration and checking.
- `src/grading.js`: shared result comparison and behavior checks.
- `src/main.jsx`, `src/Editor.jsx`, `src/styles.css`: interface and SQL editor.
- `public/database/academy.sql`: native PostgreSQL-compatible schema and deterministic seed.
- `docs/COURSE_HANDBOOK.md`: complete lesson/exercise/answer reference for offline reading.
- `docs/LOCAL_SETUP.md`: local client/server instructions and operations drills.
- `docs/DATABASE.md`: table inventory, row counts and foreign keys.
- `docs/verification.json`: actual automated verification results.

## Verification

```sh
npm run verify
npm run build
```

The bundled verifier loads the actual SQL seed into PGlite, runs all 90 reference answers, verifies complete 7/15/30 plan coverage, and checks that representative wrong answers and invalid multi-command/read-write submissions are rejected. It is an integration check, not a replacement for browser or native-server testing. See `docs/QA.md` for the delivery validation record and remaining environment limits.

## Engine boundaries

PGlite runs real PostgreSQL compiled to WebAssembly, not SQLite or a text-based query simulator. It has a single connection and browser resource limits. Use a native server for independent concurrent sessions, operational roles, pg_dump/pg_restore, extensions not bundled here, realistic large-scale performance, production monitoring and deployment practice. The practice engine is not a shared cloud SQL sandbox. Supabase stores accounts/progress separately; provider quotas and browser storage limits apply.

## Credits

React, Vite, CodeMirror, Lucide and ElectricSQL's PGlite power the app. See `THIRD_PARTY_NOTICES.md` for the dependencies and their licenses. PostgreSQL is a trademark of the PostgreSQL Community Association of Canada. This learning project is independent of the PostgreSQL project.
