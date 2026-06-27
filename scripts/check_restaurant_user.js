// Usage: node scripts/check_restaurant_user.js email@example.com
// Loads .env.local and queries Supabase REST to find restaurant_users by email

require('dotenv').config({ path: './.env.local' });

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/check_restaurant_user.js email@example.com');
  process.exit(1);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

(async () => {
  try {
    const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/restaurant_users?select=*,restaurant_roles(*)&email=eq.${encodeURIComponent(email)}`;

    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: 'application/json',
      },
    });

    const text = await res.text();
    try {
      const json = JSON.parse(text);
      console.log('Status:', res.status);
      console.log('Result:', JSON.stringify(json, null, 2));
    } catch (err) {
      console.log('Status:', res.status);
      console.log('Raw response:', text);
    }
  } catch (err) {
    console.error('Request failed:', err);
  }
})();
