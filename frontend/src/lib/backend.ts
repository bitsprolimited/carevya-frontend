const DEFAULT_BACKEND_API_URL = "https://carevya-backend.onrender.com";

/** Single Carevya backend origin (no trailing slash). */
export function getBackendBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_BACKEND_API_URL ??
    process.env.BACKEND_API_URL ??
    // Legacy fallbacks
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ??
    DEFAULT_BACKEND_API_URL;

  return raw.replace(/\/+$/, "");
}

/** Join a path onto the backend base URL. */
export function backendUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getBackendBaseUrl()}${normalized}`;
}
