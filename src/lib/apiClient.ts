import "server-only"
import { getCookies } from "cookies-next";
import { cookies } from "next/headers";

const BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api/v1";

// Fix: Use Omit to exclude 'body' from RequestInit
interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown> | FormData | string;
}

export async function apiFetch(
  path: string,
  options: ApiFetchOptions = {},
): Promise<Response> {
  // Get cookies (from Next.js request/response)
  const allCookies = await getCookies({ cookies }) || {};

  const cookieString = Object.entries(allCookies)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");

  // Merge headers with proper type handling
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(cookieString && { cookie: cookieString }),
    ...(options.headers || {}),
  };

  // Handle body: stringify object unless it's FormData or string
  let processedBody: BodyInit | undefined;
  
  if (options.body) {
    if (typeof options.body === "string" || options.body instanceof FormData) {
      processedBody = options.body;
    } else {
      // It's a Record<string, unknown>, so stringify it
      processedBody = JSON.stringify(options.body);
    }
  }

  return fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
    body: processedBody,
  });
}