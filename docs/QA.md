# Delivery validation record

Tested with Node.js 24 in the build environment; project prerequisite is Node.js 22+.

## Completed

- Production build completes and includes the PostgreSQL WASM/data assets.
- Production bundle opened in Chrome and ran a real query returning the expected 10,000 orders.
- SQL integration: all 90 reference answers pass against the actual seeded PostgreSQL engine.
- Design integration includes positive and negative constraint behavior, view/materialized-view types, numeric precision, function volatility and RLS policy expression checks.
- All plans contain exactly the requested number of days and cover every module once.
- Incorrect answer produces actionable column/row feedback; representative multiple-statement and mutation attempts are rejected by the query checker.
- Browser run-query workflow, passing answer check and passing design check exercised.
- 7/15/30 plan selection and corresponding day counts inspected.
- Knowledge check submitted with 20 correct answers, scored 20/20 and retained its score after reload.
- Desktop layout visually reviewed. Phone-width roadmap and studio checked at a 390px iframe viewport with no document-level horizontal overflow.
- Laptop static server serves HTML, SQL and WebAssembly with correct MIME types; non-GET/HEAD methods and path traversal are rejected.
- Source, seed, full course handbook, local setup guide, schema reference and third-party license files included.

## Validation limits

- No deployment to the user's Vercel account was performed. The source build and settings are supplied ready for import.
- Windows/macOS launcher scripts were reviewed, but those operating systems were not available for native execution. The dependency-free Node launcher was exercised on Linux.
- A separate native PostgreSQL installation and Docker were not available. The full seed and reference exercises were executed in PGlite's actual PostgreSQL 18.3 engine.
- The internal preview uses HTTP on a non-localhost hostname, so browser Web Locks are not available there. The in-memory fallback was tested. The secure-origin IndexedDB/tab-lock branch is supplied but not browser-verified in this environment.
- WebMCP is feature-detected; its optional exercise-navigation tool could not be exercised because the preview browser did not expose modelContext. Normal interface behavior is independent of it.
- Automated result checks validate the stated fixtures, not every possible alternate dataset or adversarial submission. Local operational drills and portfolio checkboxes are self-assessments.


## Account-enabled update (1.1.0)

- Added Supabase sign-in, self-registration, recovery and invited-account password setup; account-scoped lab storage; cloud progress; administrator learner list and invitation API.
- `npm run test:accounts`: SQL migration tested with PGlite and a simulated Supabase auth schema. Checks two learners and an admin, unique usernames, row visibility, prevention of role escalation and unauthorized writes, admin-only summary access, notes/draft exclusion, stale-write rejection, save retries and serialized writes, and invitation authorization/redirect control.
- Production Vite build checked with configured public placeholder values. No real credentials bundled.
- Welcome and admin layouts reviewed in browser; 390-pixel iframe checks showed no horizontal overflow; admin interactions use an explicitly synthetic fixture, not live Supabase results.
- Supabase Auth, actual email delivery, real Vercel function routing and cross-device sessions are not end-to-end verified: no user's live service credentials were supplied. Follow ACCOUNT_SETUP.md's launch checks after configuration.
- The older test results below/above describe the original curriculum and practice engine. The account update does not change the exercise answers or seed data.
