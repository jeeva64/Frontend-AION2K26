import { API_BASE } from "@/lib/constants";
import type { ApiEnvelope } from "@/lib/types";

export class ApiError extends Error {
  status: number;
  errors?: unknown;

  constructor(status: number, message: string, errors?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export class NetworkError extends Error {
  constructor(message = "Network error. Please check your connection.") {
    super(message);
    this.name = "NetworkError";
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string | null;
  rawBody?: BodyInit;
  rawHeaders?: Record<string, string>;
}

/**
 * Core fetch wrapper. Always resolves the JSON body and branches on
 * `body.success` first — never on `res.ok` alone.
 */
export async function api<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiEnvelope<T>> {
  const { body, token, rawBody, rawHeaders, headers, ...rest } = options;

  const requestHeaders: Record<string, string> = {
    ...rawHeaders,
    ...(headers as Record<string, string>),
  };

  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: requestHeaders,
      body:
        rawBody !== undefined
          ? rawBody
          : body !== undefined
            ? JSON.stringify(body)
            : undefined,
    });
  } catch {
    throw new NetworkError();
  }

  let payload: ApiEnvelope<T>;
  try {
    payload = (await res.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError(res.status, res.statusText || "Unexpected response");
  }

  if (res.status === 401) {
    throw new ApiError(res.status, payload.message || "Session expired.", payload.errors);
  }
  if (res.status === 403) {
    throw new ApiError(res.status, payload.message || "Access denied.", payload.errors);
  }
  if (res.status === 404) {
    throw new ApiError(res.status, payload.message || "Not found.", payload.errors);
  }
  if (res.status === 409) {
    throw new ApiError(res.status, payload.message || "Conflict.", payload.errors);
  }
  if (res.status === 429) {
    throw new ApiError(res.status, payload.message || "Too many requests.", payload.errors);
  }
  if (res.status >= 500) {
    throw new ApiError(res.status, "Server error. Please try again later.", payload.errors);
  }
  if (!res.ok) {
    throw new ApiError(res.status, payload.message || "Request failed.", payload.errors);
  }

  return payload;
}

/** 400 validation failure — thrown separately since message may be combined. */
export async function apiPost<T = unknown>(
  path: string,
  body: unknown,
  token?: string | null
): Promise<ApiEnvelope<T>> {
  try {
    return await api<T>(path, { method: "POST", body, token });
  } catch (error) {
    if (error instanceof ApiError && error.status === 400) {
      throw new ApiError(400, error.message, error.errors);
    }
    throw error;
  }
}
