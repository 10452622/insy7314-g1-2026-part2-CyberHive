const TOKEN_KEY = 'hustlehubToken';
const USER_KEY = 'hustlehubUser'; /* //(MDN Web Docs, 2026) */


export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}


export function getCurrentUser() {
  const storedUser =
    sessionStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null; /* //(MDN Web Docs, 2026) */
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}


export function isAuthenticated() {
  return Boolean(getToken());
}


export function saveSession(token, user) {
  sessionStorage.setItem(
    TOKEN_KEY,
    token /* //(MDN Web Docs, 2026) */
  );

  sessionStorage.setItem(
    USER_KEY,
    JSON.stringify(user)
  );
}


export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
} /* //(MDN Web Docs, 2026) */


/* Reference List:
    1. MDN Web Docs, 2026. Resources for Developers, by Developers. [online] Available at: <https://developer.mozilla.org/en-US/> [Accessed 8 October 2026]. */