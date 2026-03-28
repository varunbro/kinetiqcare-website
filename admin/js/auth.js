/* ============================================
   KINETIQ CARE — Admin Auth Guard
   Default password: kinetiq2025
   To change: run in browser console —
     crypto.subtle.digest('SHA-256', new TextEncoder().encode('yourpassword'))
       .then(b => [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join(''))
       .then(console.log)
   Then replace ADMIN_HASH below and redeploy.
   ============================================ */

(function () {
  const SESSION_KEY = 'kc_admin_session';
  const SESSION_TTL = .2 * 60 * 60 * 1000; // 8 hours

  // SHA-256 of "kinetiq2025"
  const ADMIN_HASH = '48cfaf78c49724dc759cd836c5099985b5933b79a35e692f73792da3b3b43fae';

  const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/admin/') || window.location.pathname.endsWith('/admin');

  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
  }

  function isLoggedIn() {
    const s = getSession();
    return s && s.expires > Date.now();
  }

  // Guard: redirect to login if not authenticated (runs on every admin page except login)
  if (!isLoginPage && !isLoggedIn()) {
    window.location.replace('index.html');
  }

  // Public API used by login page and other pages
  window.KCAuth = {
    ADMIN_HASH,

    async hashPassword(pw) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
      return [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join('');
    },

    async login(password) {
      const hash = await this.hashPassword(password);
      if (hash === ADMIN_HASH) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ expires: Date.now() + SESSION_TTL }));
        return true;
      }
      return false;
    },

    logout() {
      localStorage.removeItem(SESSION_KEY);
      window.location.replace('index.html');
    },

    isLoggedIn
  };
})();
