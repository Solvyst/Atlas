//CHECK EMAIL IS VALID
export const isEmail = (e?: string) =>
  !!e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

//NORMALIZE EMAIL (LOWERCASE & TRIM)
export const normEmail = (e: string) => e.toLowerCase().trim();

// SANITIZE NEXT
export function sanitizeNext(raw?: string | null): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/")) return null;
  const allowedPrefixes = ["/onboarding", "/invoice", "/"];
  if (!allowedPrefixes.some((p) => raw.startsWith(p))) return null;

  return raw;
}
