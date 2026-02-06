# dAIgest — Project reference

Use this file as a single place to look up what was built, how it’s set up, and what to do next.

---

## 1. Project overview

- **Product:** dAIgest — AI-powered knowledge digest. One feed from all your sources (Substack, Medium, SVPG, Maven, OpenAI blog, email, etc.); skim, save, and get clarity when stuck.
- **Website:** www.dAIgest.in
- **Status:** Hobby project, prototype. Phase 1 (reading module) planned next.
- **Repo:** https://github.com/MayurMittal/dAIgest

---

## 2. What’s in the repo

| Item | Purpose |
|------|--------|
| `index.html` | Single-page landing: hero, problem, story (Substack/Medium/SVPG/Maven/OpenAI), how it works (Digest/Decide/Vault/Clarity), coming soon + waitlist form |
| `styles.css` | Dark theme, Fraunces + DM Sans, responsive layout |
| `script.js` | Waitlist form: POSTs to `/api/notify`, shows success/error message |
| `api/notify.js` | Vercel serverless API: validates email, inserts into Supabase `waitlist` table |
| `vercel.json` | Static site config for Vercel (no build) |
| `.gitignore` | node_modules, .env, .vercel, etc. |
| `docs/SUPABASE_SETUP.md` | Step-by-step Supabase setup for beginners |
| `docs/PROJECT_REFERENCE.md` | This file |

---

## 3. Tech stack

- **Frontend:** HTML, CSS, JavaScript (no framework).
- **Hosting:** Vercel (static site + serverless API).
- **Database:** Supabase (PostgreSQL) for waitlist emails.
- **Version control:** Git, GitHub.

---

## 4. GitHub

- **Repo URL:** https://github.com/MayurMittal/dAIgest
- **Default branch:** `main` (all site code lives here).
- **Pushing updates:**  
  `git add .` → `git commit -m "message"` → `git push origin main`

---

## 5. Vercel (hosting & API)

- **Dashboard:** https://vercel.com → select dAIgest project.
- **Deploy:** Automatic on push to `main` (if repo is connected).
- **Custom domain:**  
  - In Vercel: **Settings → Domains** → Add `www.dAIgest.in` (and optionally `dAIgest.in`).  
  - At your domain registrar: add the **CNAME** record Vercel shows (e.g. `www` → `xxxx.vercel-dns-017.com`).  
  - Wait for DNS; then click **Refresh** next to the domain in Vercel until it shows valid.
- **Env vars (required for “Notify me”):**  
  **Settings → Environment Variables**
  - `SUPABASE_URL` — Supabase project URL (e.g. `https://xxxx.supabase.co`)
  - `SUPABASE_ANON_KEY` — Supabase anon public key  
  After changing env vars, **Redeploy** (Deployments → ⋯ → Redeploy).

---

## 6. “Notify me” / waitlist

- **Flow:** User enters email → form POSTs to `/api/notify` → API validates and inserts into Supabase `waitlist` table → success or error message shown.
- **API:** `api/notify.js` (Vercel serverless). Only accepts POST; expects JSON body `{ "email": "..." }`.
- **Success:** 200, message “You’re on the list!”
- **Errors:** 400 (invalid email / already on list), 503 (env vars missing), 500 (server/Supabase error). Messages shown under the button.
- **Supabase:** Table `waitlist` in schema `public` with columns:
  - `id` — uuid, primary key, default `gen_random_uuid()`
  - `email` — text, unique, not null
  - `created_at` — timestamptz, default `now()`
- **RLS:** Can be disabled for the table, or use a policy that allows INSERT for anon. See `docs/SUPABASE_SETUP.md`.

---

## 7. Supabase quick reference

- **Project URL:** From Supabase **Settings → API** (e.g. `https://dqxmwjrmyfrhwfllzggy.supabase.co`). Store only in Vercel env as `SUPABASE_URL`.
- **Anon key:** From same page. Store only in Vercel env as `SUPABASE_ANON_KEY`. Never commit to git.
- **Table:** `public.waitlist` — view/edit in **Table Editor**.
- **If table stays empty after submit:** Use live site URL (not local file); confirm env vars in Vercel and redeploy; check browser Network tab (POST to `/api/notify`) and Vercel function logs.

---

## 8. Common tasks

- **Change copy or design:** Edit `index.html` / `styles.css` → commit → push → Vercel auto-deploys.
- **Change waitlist behavior:** Edit `api/notify.js` or `script.js` → commit → push.
- **Add a new env var:** Vercel → Settings → Environment Variables → add → Redeploy.
- **See waitlist signups:** Supabase → Table Editor → `waitlist`.

---

## 9. Next steps (product)

- **Landing page:** Optional — favicon, meta/OG tags, analytics; ensure domain and waitlist work.
- **Phase 1 MVP:** Ingestion (email forward or link import) → feed + summary cards → Dismiss / Save to Vault / Open full → Vault + search. Build web first, then consider mobile.

---

## 10. File locations

- Landing page: `index.html`, `styles.css`, `script.js`
- Waitlist API: `api/notify.js`
- Config: `vercel.json`, `.gitignore`
- Docs: `README.md`, `docs/SUPABASE_SETUP.md`, `docs/PROJECT_REFERENCE.md` (this file)
