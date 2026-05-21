import { NetworkError } from "~/shared/domain/errors/network-error";
import { NotFoundError } from "~/shared/domain/errors/not-found-error";
import { ValidationError } from "~/shared/domain/errors/validation-error";
import { GoneError } from "~/shared/domain/errors/gone-error";
import type { RequestOptions } from "./types";
import { getAccessToken } from "~/shared/infrastructure/auth";
import { clientLogger, createClientRequestId } from "~/shared/infrastructure/logger/client-logger";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const REQUEST_ID_HEADER = "X-Request-ID";

function buildUrl(path: string, params?: RequestOptions["params"]): string {
  const base =
    BASE_URL ||
    (typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "http://localhost");
  const url = new URL(`${BASE_URL}${path}`, base);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

async function parseErrorResponse(
  response: Response,
  context: { method: string; path: string; requestId: string },
): Promise<never> {
  let message = `Request failed with status ${response.status}`;
  let fieldErrors: Record<string, string[]> | undefined;
  const responseRequestId = response.headers.get(REQUEST_ID_HEADER.toLowerCase()) ?? context.requestId;

  try {
    const body = (await response.json()) as {
      message?: string;
      errors?: Record<string, string[]>;
    };
    if (body.message) message = body.message;
    if (body.errors) fieldErrors = body.errors;
  } catch {
    // Body not parseable as JSON — use default message
  }

  const metadata = {
    requestId: responseRequestId,
    method: context.method,
    path: context.path,
    status: response.status,
  };

  if (response.status >= 500) {
    clientLogger.error("api_request_failed_server_error", metadata, { message });
  } else {
    clientLogger.warn("api_request_failed_client_error", { ...metadata, message });
  }

  switch (response.status) {
    case 404:
      throw new NotFoundError("Resource", undefined, metadata);
    case 410:
      throw new GoneError(message, metadata);
    case 422:
      throw new ValidationError(message, fieldErrors, metadata);
    default:
      throw new NetworkError(message, response.status, metadata);
  }
}

async function request<T>(
  method: string,
  path: string,
  options?: RequestOptions & { body?: unknown },
): Promise<T> {
  const { params, body, headers, ...rest } = options ?? {};

  const url = buildUrl(path, params);
  const bearerToken = getAccessToken();
  const requestId = createClientRequestId();

  clientLogger.debug("api_request_started", {
    requestId,
    method,
    path,
  });

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        [REQUEST_ID_HEADER]: requestId,
        ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
        ...headers,
      },
      credentials: "include",
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...rest,
    });
  } catch (error) {
    const metadata = { requestId, method, path };
    clientLogger.error("api_request_transport_failure", metadata, error);
    throw new NetworkError("Unable to reach authentication service.", undefined, metadata);
  }

  if (!response.ok) {
    await parseErrorResponse(response, { method, path, requestId });
  }

  clientLogger.debug("api_request_succeeded", {
    requestId: response.headers.get(REQUEST_ID_HEADER.toLowerCase()) ?? requestId,
    method,
    path,
    status: response.status,
  });

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>("GET", path, options),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, { ...options, body }),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PUT", path, { ...options, body }),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, { ...options, body }),

  delete: <T = void>(path: string, options?: RequestOptions) => request<T>("DELETE", path, options),
};
