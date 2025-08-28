const domain = import.meta.env.VITE_COGNITO_DOMAIN;
const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
const redirectUri = import.meta.env.VITE_COGNITO_REDIRECT_URI;

function pkce() {
  const arr = new Uint8Array(32); crypto.getRandomValues(arr);
  const verifier = btoa(String.fromCharCode(...arr)).replace(/[^a-zA-Z0-9]/g,'').slice(0,128);
  const enc = new TextEncoder().encode(verifier);
  return crypto.subtle.digest('SHA-256', enc).then(buf => {
    const hash = Array.from(new Uint8Array(buf)).map(b=>('00'+b.toString(16)).slice(-2)).join('');
    const challenge = btoa(String.fromCharCode(...hash.match(/.{2}/g).map(h=>parseInt(h,16))))
      .replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
    return { verifier, challenge };
  });
}

export async function login() {
  const { verifier, challenge } = await pkce();
  sessionStorage.setItem('pkce_verifier', verifier);
  const url = `${domain}/login?client_id=${encodeURIComponent(clientId)}&response_type=code&scope=openid+email+profile&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge_method=S256&code_challenge=${challenge}`;
  window.location.href = url;
}

export function logout() {
  localStorage.removeItem('id_token');
  const url = `${domain}/logout?client_id=${encodeURIComponent(clientId)}&logout_uri=${encodeURIComponent(window.location.origin + '/')}`;
  window.location.href = url;
}

export async function handleCallback() {
  const code = new URL(window.location.href).searchParams.get('code');
  if (!code) return false;
  const verifier = sessionStorage.getItem('pkce_verifier');
  // Exchange code for tokens
  const res = await fetch(`${domain}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      code,
      redirect_uri: redirectUri,
      code_verifier: verifier
    })
  });
  const data = await res.json();
  if (data.id_token) {
    localStorage.setItem('id_token', data.id_token);
    return true;
  }
  console.error('Token exchange failed', data);
  return false;
}

export function getIdToken() {
  return localStorage.getItem('id_token') || '';
}

export function isLoggedIn() {
  return !!getIdToken();
}
