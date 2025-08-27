export const API_BASE_URL = (import.meta as any).env.VITE_API_URL || "http://localhost:3000";

export async function fetchJson(input: RequestInfo | string, init?: RequestInit) {
  const url = String(input).startsWith("http") ? String(input) : API_BASE_URL + String(input);
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  const isJson = res.headers.get("content-type")?.includes("application/json");
  if (!res.ok) {
    const err = isJson
      ? await res.json()
      : { error: { code: "HTTP_ERROR", message: res.statusText } };
    throw err;
  }
  return isJson ? res.json() : (undefined as unknown as any);
}
