// Remove "server-only" import for client components
// import { getCookies } from "cookies-next"; // Not needed on client
// import { cookies } from "next/headers"; // Server-only

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1";

// Fix: Use Omit to exclude 'body' from RequestInit
interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown> | FormData | string;
}

export async function clientFetch(
  path: string,
  options: ApiFetchOptions = {},
): Promise<Response> {
  // On client side, cookies are automatically included with 'include' credentials
  // No need to manually get and set cookies
  
  // Merge headers with proper type handling
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Handle body: stringify object unless it's FormData or string
  let processedBody: BodyInit | undefined;
  
  if (options.body) {
    if (typeof options.body === "string" || options.body instanceof FormData) {
      processedBody = options.body;
      // Remove Content-Type for FormData to let browser set it with boundary
      if (options.body instanceof FormData) {
        delete (headers as Record<string, string>)["Content-Type"];
      }
    } else {
      // It's a Record<string, unknown>, so stringify it
      processedBody = JSON.stringify(options.body);
    }
  }

  return fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include", // This automatically includes cookies
    headers,
    body: processedBody,
  });
}