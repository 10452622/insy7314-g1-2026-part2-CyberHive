const TOKEN_KEY = 'hustlehubToken';
const USER_KEY = 'hustlehubUser';


export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}


export function getCurrentUser() {
  const storedUser =
    sessionStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
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
    token
  );

  sessionStorage.setItem(
    USER_KEY,
    JSON.stringify(user)
  );
}


export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}