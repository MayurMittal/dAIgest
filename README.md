# dAIgest

Landing page for [dAIgest](https://www.dAIgest.in) — your best reads, distilled. One feed from all your sources and email accounts.

## Deploy on Vercel

Connect this repo to [Vercel](https://vercel.com); it will detect the static site and deploy. No build step required.

## “Notify me” waitlist

The form submits to the `/api/notify` serverless function, which stores emails in [Supabase](https://supabase.com) (free tier).

**New to Supabase?** → See **[Step-by-step Supabase setup](docs/SUPABASE_SETUP.md)** for a full walkthrough.

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. In **Table Editor**, create a table named `waitlist` with:
   - `id` — type **uuid**, default `gen_random_uuid()`, primary key
   - `email` — type **text**, unique, not null
   - `created_at` — type **timestamptz**, default `now()`
   - If you use the **anon** key: in **Table Editor → waitlist → RLS**, add a policy that allows **INSERT** for all. Or use the **service_role** key in Vercel (as `SUPABASE_SERVICE_ROLE_KEY`) so the API bypasses RLS.
3. In **Settings → API**: copy **Project URL** and **anon public** (or **service_role**) key.

### 2. Add env vars in Vercel

In your Vercel project: **Settings → Environment Variables** add:

- `SUPABASE_URL` — your Project URL  
- `SUPABASE_ANON_KEY` — your anon public key (or use `SUPABASE_SERVICE_ROLE_KEY` with the service role key)

Redeploy the project so the API picks up the new variables. After that, “Notify me” signups will be stored in the `waitlist` table.
