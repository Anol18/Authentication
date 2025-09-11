import "server-only"
import { getApiToken } from "./getApiToken";
import { NextRequest } from "next/server";

const BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api/v1";

// Fix: Use Omit to exclude 'body' from RequestInit
interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown> | FormData | string;
}

export async function serverFetch(
  path: string,
  options: ApiFetchOptions = {},
  req: NextRequest
): Promise<Response> {
  // Get token from getApiToken function
  const token = await getApiToken({ req });

  
  // Merge headers with proper type handling
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...((token && { Authorization: `Bearer ${token}` }) || {}),
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