import { ApiError } from "@/lib/api";

export type ApiEnvelope<T> = {
  statusCode: number;
  message: string;
  data: T;
};

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Query string params (undefined values omitted). */
  query?: Record<string, string | number | boolean | undefined | null>;
};

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  const url = new URL(
    `/api/backend/${normalized}`,
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  );
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }
  return `${url.pathname}${url.search}`;
}

async function parseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

function messageFromBody(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;
  const record = body as Record<string, unknown>;
  if (typeof record.message === "string" && record.message) return record.message;
  if (Array.isArray(record.message) && record.message.length) {
    return record.message.map(String).join(", ");
  }
  if (typeof record.error === "string" && record.error) return record.error;
  return fallback;
}

/**
 * Authenticated Nest API call via the same-origin `/api/backend` proxy.
 * Unwraps `{ statusCode, message, data }` envelopes.
 */
export async function backendFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, query, ...rest } = options;
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const response = await fetch(buildUrl(path, query), {
    ...rest,
    credentials: "include",
    headers: isFormData
      ? { ...headers }
      : {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...headers,
        },
    body:
      body === undefined
        ? undefined
        : isFormData
          ? (body as FormData)
          : JSON.stringify(body),
  });

  const payload = await parseBody(response);

  if (!response.ok) {
    throw new ApiError(
      messageFromBody(
        payload,
        `Request failed with status ${String(response.status)}`,
      ),
      response.status,
      payload,
    );
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    ("statusCode" in payload || "message" in payload)
  ) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
}
