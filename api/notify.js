/**
 * Waitlist signup API — stores email in Supabase.
 * Set in Vercel: SUPABASE_URL, SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY)
 * and create a table: waitlist (id uuid primary key default gen_random_uuid(), email text unique not null, created_at timestamptz default now())
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  return typeof email === 'string' && email.length <= 320 && EMAIL_REGEX.test(email.trim());
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let email;
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    email = (body.email || '').trim();
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Notify API: SUPABASE_URL and SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY) must be set in Vercel environment.');
    return res.status(503).json({ error: 'Signup is temporarily unavailable. Please try again later.' });
  }

  try {
    const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      return res.status(200).json({ ok: true, message: 'You’re on the list!' });
    }

    const text = await response.text();
    let errMsg = 'Something went wrong. Please try again.';

    if (response.status === 409) {
      errMsg = 'This email is already on the list.';
    } else if (response.status >= 400 && response.status < 500) {
      try {
        const data = JSON.parse(text);
        if (data.message) errMsg = data.message;
      } catch (_) {}
    }

    return res.status(response.status >= 500 ? 500 : 400).json({ error: errMsg });
  } catch (err) {
    console.error('Notify API error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
}
