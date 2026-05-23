function fallbackRedirect(): string {
  return String(import.meta.env.VITE_REDIRECT_URL ?? "/");
}

function configuredAllowedOrigins(): string[] {
  return String(import.meta.env.VITE_ALLOWED_REDIRECT_ORIGINS ?? "")
    .split(",")
    .map((origin: string) => origin.trim())
    .filter((origin: string) => origin.length > 0);
}

function resolveDefaultOrigin(): string | null {
  try {
    return new URL(fallbackRedirect()).origin;
  } catch {
    return null;
  }
}

function allowedOrigins(): Set<string> {
  const origins = new Set(configuredAllowedOrigins());
  const fallbackOrigin = resolveDefaultOrigin();
  if (fallbackOrigin) origins.add(fallbackOrigin);
  return origins;
}

function normalizeAbsoluteHttpUrl(candidate: string): URL | null {
  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url;
  } catch {
    return null;
  }
}

export function resolvePostAuthRedirect(rawRedirect: string | null): string {
  const fallback = normalizeAbsoluteHttpUrl(fallbackRedirect());
  if (!rawRedirect) return fallback?.toString() ?? "/";

  const candidate = normalizeAbsoluteHttpUrl(rawRedirect);
  if (!candidate) return fallback?.toString() ?? "/";

  if (!allowedOrigins().has(candidate.origin)) return fallback?.toString() ?? "/";

  return candidate.toString();
}

export function appendRedirectParam(pathname: string, redirectTarget: string): string {
  const url = new URL(pathname, "http://localhost");
  url.searchParams.set("redirect", redirectTarget);
  return `${url.pathname}${url.search}`;
}

export function redirectToTarget(target: string): void {
  if (typeof window === "undefined") return;
  window.location.assign(target);
}
