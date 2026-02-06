# Step-by-step: Supabase setup for dAIgest waitlist

This guide gets your “Notify me” form saving emails to Supabase. You’ll create a free Supabase project, add a table, turn on access, then plug the keys into Vercel.

---

## Step 1: Create a Supabase account and project

1. Go to **[supabase.com](https://supabase.com)** and click **Start your project**.
2. Sign in with **GitHub** (or Google / email).
3. Click **New Project**.
4. Fill in:
   - **Name:** e.g. `daigest` (anything you like).
   - **Database Password:** choose a strong password and **save it somewhere safe** (you need it to connect to the database later).
   - **Region:** pick one close to you (e.g. Southeast Asia (Mumbai) if you’re in India).
5. Click **Create new project** and wait 1–2 minutes until the project is ready.

---

## Step 2: Create the `waitlist` table

1. In the left sidebar, click **Table Editor**.
2. Click **New table**.
3. Set:
   - **Name:** `waitlist`
   - Leave “Enable Row Level Security (RLS)” **checked** (we’ll add a policy next).
4. Under **Columns**, you’ll see a default `id` column. Keep it and set:
   - **id**
     - Name: `id`
     - Type: `uuid`
     - Default value: tick **“Use a default value”** and choose **`gen_random_uuid()`**
     - Check **Primary key** and **Unique**.
   - Add two more columns (use **Add column** or the + row):
     - **email**
       - Name: `email`
       - Type: `text`
       - Check **Unique** and **Is nullable** = **No** (required).
     - **created_at**
       - Name: `created_at`
       - Type: `timestamptz`
       - Default value: tick **“Use a default value”** and choose **`now()`**.
5. Click **Save** (or **Create table**).

You should now see a table named `waitlist` with columns: `id`, `email`, `created_at`.

**Alternative: Create the table with SQL**  
If your Table Editor looks different, go to **SQL Editor** → **New query**, paste the following, then click **Run**:

```sql
create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz default now()
);

alter table public.waitlist enable row level security;
```

Then continue from Step 3.

---

## Step 3: Allow inserts with the anon key (RLS policy)

Right now the table is protected by RLS, so the API (using the “anon” key) can’t insert. We’ll add one policy that allows anyone to insert a row.

1. In the left sidebar, open **Authentication** → **Policies** (or stay in **Table Editor**, click the `waitlist` table, then open the **RLS** / **Policies** tab).
2. Click **New Policy**.
3. Choose **“Create a policy from scratch”** (or “For full customization”).
4. Set:
   - **Policy name:** `Allow public insert` (or any name).
   - **Allowed operation(s):** tick only **INSERT**.
   - **Target roles:** leave **public** (or add `anon` if that’s an option).
   - **USING expression:** leave empty (not used for INSERT).
   - **WITH CHECK expression:** type `true` (allows any insert that passes table constraints).
5. Save the policy.

Now the anon key can insert into `waitlist`; it still cannot read or delete rows unless you add more policies (which you don’t need for the waitlist).

**Alternative: Add the policy with SQL**  
In **SQL Editor** → **New query**, paste and run:

```sql
create policy "Allow public insert"
  on public.waitlist
  for insert
  to public
  with check (true);
```

---

## Step 4: Get your Project URL and anon key

1. In the left sidebar, click the **Settings** (gear) icon.
2. Click **API** under “Project Settings”.
3. You’ll see:
   - **Project URL** — e.g. `https://xxxxxxxxxxxx.supabase.co`
   - **Project API keys**:
     - **anon public** — safe to use in the browser / in Vercel env. Copy this.
     - **service_role** — secret; only use on the server if you need to bypass RLS. For this setup, **anon** is enough.
4. Copy and keep:
   - **Project URL**
   - **anon public** key

---

## Step 5: Add the keys to Vercel

1. Open **[vercel.com](https://vercel.com)** → your **dAIgest** project.
2. Go to **Settings** → **Environment Variables**.
3. Add two variables (for **Production**, and optionally **Preview** if you use preview deploys):

   | Name              | Value                    |
   |-------------------|--------------------------|
   | `SUPABASE_URL`    | Your **Project URL**      |
   | `SUPABASE_ANON_KEY` | Your **anon public** key |

   Paste the values (no quotes). Click **Save** for each.
4. **Redeploy** the project:
   - Go to **Deployments**.
   - Open the **⋯** menu on the latest deployment → **Redeploy** (or push a small commit and let it auto-deploy).

---

## Step 6: Test the form

1. Open your live site (e.g. `www.daigest.in` or your `*.vercel.app` URL).
2. Enter an email in the “Notify me” form and submit.
3. You should see: **“You’re on the list!”**
4. In Supabase: **Table Editor** → **waitlist** → you should see the new row with that email and a `created_at` time.

If you see “Signup is temporarily unavailable”, the API didn’t get the env vars — double-check **SUPABASE_URL** and **SUPABASE_ANON_KEY** in Vercel and redeploy.

---

## Quick reference: what you created

- **Supabase project** → one database.
- **Table `waitlist`** → columns: `id` (uuid), `email` (text, unique), `created_at` (timestamptz).
- **RLS policy** → allow **INSERT** for anon so the API can add signups.
- **Vercel env vars** → `SUPABASE_URL`, `SUPABASE_ANON_KEY`.

That’s all you need for the notify-me flow. If you want to export or manage the list later, use Supabase **Table Editor** or **SQL Editor** to view or download the `waitlist` table.
