import { EHttpHeaders } from "@/common/constants";
import tokenCache from "@/utils/token-cache";
import { API_ROUTES } from "./endpoint";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
interface RequestOptions {
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

const handleTimeout = (timeout: number) =>
  new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), timeout)
  );

const request = async <T>(
  url: string,
  method: HttpMethod,
  options: RequestOptions = {}
): Promise<T> => {
  const { headers = {}, body, timeout = API_ROUTES.TIMEOUT } = options;

  const token = tokenCache.getAccessToken();
  const authHeaders: Record<string, string> = {};

  if (token) {
    authHeaders[EHttpHeaders.AUTHORIZATION] = `Bearer ${token}`;
  }

  const isFormData = body instanceof FormData;
  const requestHeaders: Record<string, string> = {
    ...authHeaders,
    ...headers,
  };

  if (!isFormData) {
    Object.assign(requestHeaders, API_ROUTES.HEADERS);
  }

  const fetchPromise = fetch(`${API_ROUTES.BASE_URL}${url}`, {
    method,
    headers: requestHeaders,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  }).then(async (res) => {
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || res.statusText);
    }
    return res.json() as Promise<T>;
  });

  return Promise.race([fetchPromise, handleTimeout(timeout)]);
};

const rootApiService = {
  get: <T>(url: string, headers?: Record<string, string>) =>
    request<T>(url, "GET", { headers }),
  post: <T>(url: string, body?: any, headers?: Record<string, string>) =>
    request<T>(url, "POST", { body, headers }),
  put: <T>(url: string, body?: any, headers?: Record<string, string>) =>
    request<T>(url, "PUT", { body, headers }),
  delete: <T>(url: string, headers?: Record<string, string>) =>
    request<T>(url, "DELETE", { headers }),
};

export default rootApiService;
