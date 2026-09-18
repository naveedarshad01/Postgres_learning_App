# Activate accounts and the administrator dashboard

This Vercel edition now requires a Supabase project for authentication and account progress. The 25-table practice database still runs privately in each learner's browser. No paid service has been purchased and no live accounts have been created by this update.

## 1. Prepare Supabase

1. Create a dedicated project at https://supabase.com/dashboard. Keep its database password private.
2. Open **SQL Editor → New query**. Paste and run the entire `supabase/setup.sql` file **once**. It creates the profiles, progress storage, access policies and functions. Do not run this file in the app's SQL studio or a pgAdmin practice database.
3. Under **Authentication → Providers → Email**, enable email/password sign-in and new-user sign-ups. Keep email confirmation enabled. Set the minimum password length to 12 characters.
4. Configure a production SMTP provider under the authentication email settings. Supabase's default mail service is restricted and should not be relied on for inviting arbitrary learners. Test email delivery before launch.
5. Find the project URL and the public **anon** (or publishable) key in the project API settings. Find the **service_role** key for the invitation endpoint. Never place the service-role key in a variable beginning with `VITE_`, commit it, or share it in chat.

## 2. Configure Vercel

Extract the ZIP and upload its contents to your existing GitHub repository, replacing the previous source. Include the new `api/`, `supabase/`, `src/account/`, `.env.example` and updated lockfile. Do not upload `.env`, `.env.local`, `node_modules` or any actual credentials.

Use Vite; install `npm ci`; build `npm run build`; output `dist`; Node.js 22 or newer. The repository root must contain `package.json`, `vercel.json` and `api/`.

In **Vercel → Project → Settings → Environment Variables**, enter:

| Variable | Value | Exposure |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` | Public |
| `VITE_SUPABASE_ANON_KEY` | Project anon/publishable key | Public; protected by database policies |
| `SUPABASE_SERVICE_ROLE_KEY` | Project service-role key | Server only |
| `APP_URL` | Exact origin, e.g. `https://your-app.vercel.app` | Used for invitation links and origin checking |

Use your real deployment domain in APP_URL, without a path. Apply the values to Production. For Preview deployments, use a separate test project and that preview origin if you need full account testing there. Redeploy after every environment-variable change: Vite embeds its public variables at build time.

The `/api/invite` Vercel function sends invitations only after checking the caller's signed-in identity and their database administrator role. All account access is enforced by Supabase policies/functions; hiding a button is not the security boundary.

## 3. Set email redirect URLs

In **Supabase → Authentication → URL Configuration**:

- Site URL: `https://your-app.vercel.app`
- Add redirect URLs: `https://your-app.vercel.app/` and `https://your-app.vercel.app/?account=setup`
- For local development, also allow `http://localhost:4173/` and `http://localhost:4173/?account=setup`.

Use the same hostname consistently. Leave the standard Supabase confirmation, invitation and password-recovery link templates in place unless you understand their token flow. Confirmation returns to sign-in; invitations and resets open the choose-password screen. Link errors appear on the welcome page.

## 4. Make your own account administrator

1. Open your app, choose **Sign up**, and create your own account with your email and preferred username.
2. Confirm your email and sign in.
3. In the **Supabase SQL Editor**, run the following after replacing the example email with YOUR exact account email:

```sql
UPDATE public.profiles AS p
SET role = 'admin'
FROM auth.users AS u
WHERE p.id = u.id
  AND lower(u.email) = lower('YOUR_EMAIL@example.com')
RETURNING p.username, p.role;
```

Confirm that exactly your account is returned. Do not promote ordinary learners. Reload the application; **Learner management** will appear in your navigation. Administrator access is never granted from sign-up fields or editable user metadata. There is no default admin password.

## 5. Create users and track progress

- **Owner-created accounts:** Learner management → Create a learner account. Enter full name, unique username and email. The account is created and an invitation is emailed; the learner chooses their password through the link.
- **Self-registration:** Anyone you allow to access your app can choose Sign up, select a unique username, confirm their email and sign in.
- **Sign-in:** Uses email and password. Usernames identify learners in your dashboard; they are case-insensitive, stored lowercase, and must contain 3–30 letters, digits or underscores.
- **Track users:** Search by username/name, inspect completion percentage, selected plan, latest activity, module/exercise completion, assisted answers, reviewed cards and latest quiz score. Refresh to fetch current records. Lists use 50-row pages.
- **Activity:** Updated approximately once per minute while the app is visible. It is not attendance tracking or an exact study-duration measurement.
- **Password reset:** Available on the welcome screen and from the signed-in header. Never ask a learner to send you their password.
- Account deletion and advanced auth administration remain in Supabase's Auth dashboard; this update does not add destructive account controls to the app.

## 6. Progress and privacy

Progress, notes, drafts and recent query history sync after changes. The header shows pending, saving, saved, or failed status. Sign-out waits for pending changes to save. A failed save keeps the current work in memory and offers retry; export progress before closing if connectivity cannot be restored. This edition requires internet for accounts and cloud progress, and does not promise offline progress persistence.

Only the signed-in learner can read their full progress record through the API. The administrator dashboard returns selected learning fields, not notes or SQL drafts. As project owner you still control the underlying Supabase database and its backups. Protect service credentials and administrator accounts.

Two devices cannot silently overwrite each other's progress: a stale save is rejected. If you see a conflict, export your current work, then reload to load the latest cloud version. To intentionally replace that version, import the exported file and confirm. Imports replace the whole progress record; there is no automatic merge. Use one active learning session per account where possible.

The browser practice database is separate for each account and device; SQL table changes do not sync. Browser storage can be inspected by someone with access to that browser profile. On shared computers, use separate OS/browser profiles or private windows and sign out afterward. Do not put confidential data into the practice lab.

Existing anonymous browser progress is not assigned to the first user who signs in. Before replacing the old app, export progress from it. After signing in to the updated app, import that JSON into the intended account. Old local lab changes remain in the old storage; export custom SQL before upgrading. The original offline Laptop ZIP is a separate edition and is not changed by this update.

## 7. Run this account-enabled source locally

Install Node.js 22+, extract the source and run `npm ci`. Copy `.env.example` to `.env`; fill the Supabase values and set `APP_URL=http://localhost:4173`. Run `npm run dev` and open that exact address. The Vite development server includes the invitation API. Do not run another server on port 4173.

For a production build on your laptop, run `npm run build` followed by `npm start`. Keep `.env` in the project folder for the server-only invitation settings. Public values are embedded at build time. The old prebuilt/offline Laptop ZIP has no account service and remains separate.

## Before inviting real learners

1. Sign up two test learners with different usernames and confirm both emails.
2. Complete an exercise under learner A. Wait for “Progress saved to your account”. Sign out, then sign in on another device and check the same completion.
3. Verify learner B starts with a separate record and separate lab.
4. As admin, find both usernames, open details and confirm only A has the completion.
5. Send a test invitation, choose a password from its email, and test password reset.
6. Check duplicate usernames, expired links, a network interruption and two-device save conflicts.

`npm run test:accounts` checks account SQL permissions, role escalation protection, revision conflicts, save retry/serialization and invitation endpoint authorization. Production build and local tests passed during packaging. Actual Supabase-hosted authentication, SMTP delivery, live Vercel functions and cross-device sessions require your project credentials and must be checked after setup; no live deployment was performed.

## Official references

- https://supabase.com/docs/guides/auth/passwords
- https://supabase.com/docs/guides/auth/auth-smtp
- https://supabase.com/docs/guides/auth/redirect-urls
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/reference/javascript/auth-admin-inviteuserbyemail
- https://vercel.com/docs/frameworks/frontend/vite
