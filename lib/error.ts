export type Language = "en" | "sr";

export class UserFacingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserFacingError";
  }
}

type LocalizedCopy = Record<Language, string>;

const KNOWN_ERROR_COPY: Record<string, LocalizedCopy> = {
  auth_user_not_found: {
    en: "No account found for that email.",
    sr: "Nalog sa tim emailom ne postoji.",
  },
  auth_invalid_password: {
    en: "Incorrect password.",
    sr: "Pogresna lozinka.",
  },
  auth_email_already_registered: {
    en: "This email is already registered.",
    sr: "Ovaj email je vec registrovan.",
  },
  auth_signup_failed: {
    en: "Account created, but we couldn't sign you in. Please sign in.",
    sr: "Nalog je napravljen, ali prijava nije uspela. Prijavite se.",
  },
  auth_unauthorized: {
    en: "Please sign in to continue.",
    sr: "Prijavite se da biste nastavili.",
  },
  permission_admin_only: {
    en: "You don't have access to that page.",
    sr: "Nemate dozvolu za tu stranicu.",
  },
  order_not_found: {
    en: "We can't find that order.",
    sr: "Ne mozemo da pronadjemo tu porudzbinu.",
  },
  profile_not_found: {
    en: "We can't find that profile.",
    sr: "Ne mozemo da pronadjemo taj profil.",
  },
  order_update_forbidden: {
    en: "You don't have permission to update this order.",
    sr: "Nemate dozvolu da izmenite ovu porudzbinu.",
  },
  "invalid credentials": {
    en: "Incorrect email or password.",
    sr: "Pogresan email ili lozinka.",
  },
  "email already registered": {
    en: "This email is already registered.",
    sr: "Ovaj email je vec registrovan.",
  },
  unauthorized: {
    en: "Please sign in to continue.",
    sr: "Prijavite se da biste nastavili.",
  },
  "admin only": {
    en: "You don't have access to that page.",
    sr: "Nemate dozvolu za tu stranicu.",
  },
  "order not found": {
    en: "We can't find that order.",
    sr: "Ne mozemo da pronadjemo tu porudzbinu.",
  },
  "profile not found": {
    en: "We can't find that profile.",
    sr: "Ne mozemo da pronadjemo taj profil.",
  },
  "not permitted to update this order": {
    en: "You don't have permission to update this order.",
    sr: "Nemate dozvolu da izmenite ovu porudzbinu.",
  },
  "failed to load user after sign up": {
    en: "Account created, but we couldn't sign you in. Please sign in.",
    sr: "Nalog je napravljen, ali prijava nije uspela. Prijavite se.",
  },
};

const NETWORK_COPY: LocalizedCopy = {
  en: "Network error. Check your connection and try again.",
  sr: "Problem sa internetom. Proverite vezu i pokusajte ponovo.",
};

function extractMessage(error: unknown): string | null {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    return typeof message === "string" ? message : null;
  }
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data?: unknown }).data;
    if (typeof data === "string") return data;
    if (data && typeof data === "object" && "code" in data) {
      const code = (data as { code?: unknown }).code;
      return typeof code === "string" ? code : null;
    }
  }
  return null;
}

function normalizeMessage(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function stripPrefixes(message: string): string {
  return message
    .replace(
      /^(convex(error)?|uncaught (error|exception)|error|typeerror|server error|servererror)\b[:\s-]*/i,
      "",
    )
    .trim();
}

function extractErrorCode(message: string): string | null {
  const prioritized = message.match(
    /\b(?:AUTH|ORDER|PROFILE|PERMISSION)_[A-Z0-9_]+\b/g,
  );
  if (prioritized?.length) return prioritized[prioritized.length - 1];

  const matches = message.match(/\b[A-Z][A-Z0-9_]{2,}\b/g);
  if (!matches?.length) return null;

  const blacklist = new Set([
    "CONVEX",
    "ERROR",
    "MUTATION",
    "QUERY",
    "ACTION",
    "SERVER",
    "CLIENT",
    "INTERNAL",
  ]);

  const withUnderscore = matches.filter(
    (item) => item.includes("_") && !blacklist.has(item),
  );
  if (withUnderscore.length) return withUnderscore[withUnderscore.length - 1];

  const filtered = matches.filter((item) => !blacklist.has(item));
  return filtered.length ? filtered[filtered.length - 1] : null;
}

function canonicalKey(message: string): string {
  const stripped = stripPrefixes(message);
  const code = extractErrorCode(stripped);
  const base = code ?? stripped;
  return base
    .replace(/^[\[\(\{<\s]+|[\]\)\}>\s]+$/g, "")
    .replace(/^["']+|["']+$/g, "")
    .replace(/\.+$/, "")
    .trim()
    .toLowerCase();
}

function looksLikeNetworkError(message: string): boolean {
  return (
    /failed to fetch/i.test(message) ||
    /fetch failed/i.test(message) ||
    /networkerror/i.test(message) ||
    /load failed/i.test(message) ||
    /\b(ECONNRESET|ECONNREFUSED|ENOTFOUND|ETIMEDOUT)\b/i.test(message) ||
    /\btimeout\b/i.test(message)
  );
}

function looksTechnical(message: string): boolean {
  return (
    /\bconvex\b/i.test(message) ||
    /\bwebpack\b/i.test(message) ||
    /\breact\b/i.test(message) ||
    /\bnext\.?js\b/i.test(message) ||
    /\b(node|npm|pnpm|yarn)\b/i.test(message) ||
    /\bat\s+\S+\s*\(/.test(message) ||
    /https?:\/\//i.test(message)
  );
}

export function getErrorMessage(
  error: unknown,
  fallback: string,
  language?: Language,
): string {
  if (error instanceof UserFacingError) {
    const message = normalizeMessage(error.message);
    return message || fallback;
  }

  const raw = extractMessage(error);
  if (!raw) return fallback;

  const message = normalizeMessage(raw);
  if (!message) return fallback;

  if (language && looksLikeNetworkError(message)) {
    return NETWORK_COPY[language];
  }

  if (language) {
    const mapped = KNOWN_ERROR_COPY[canonicalKey(message)];
    if (mapped) return mapped[language];
  }

  if (looksTechnical(message)) return fallback;

  return fallback;
}
