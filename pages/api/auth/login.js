import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { username, password } = req.body || {};

  const adminUser = process.env.ADMIN_USERNAME || '';
  const adminPass = process.env.ADMIN_PASSWORD || '';
  const secret = process.env.AUTH_SECRET || '';

  if (!adminUser || !adminPass || !secret) {
    return res.status(500).json({ error: 'Server auth is not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD, AUTH_SECRET.' });
  }

  if (username !== adminUser || password !== adminPass) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const payload = JSON.stringify({ sub: username, iat: Date.now() });
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const token = Buffer.from(payload).toString('base64') + '.' + sig;

  const cookie = `admin_session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 4}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
  res.setHeader('Set-Cookie', cookie);
  return res.status(200).json({ success: true });
}


