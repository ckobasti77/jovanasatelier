const SESSION_KEY = "marija-atelier-session";

export function saveSessionToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, token);
}

export function getSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_KEY);
}

export function clearSessionToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}
