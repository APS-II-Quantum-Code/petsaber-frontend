import { toast } from "@/hooks/use-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

export async function apiFetch<T>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: unknown;
    token?: string | null;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const { method = "GET", body, token, headers = {} } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const err: ApiError = {
      status: res.status,
      message: (data && (data.message || data.error)) || res.statusText,
      details: data,
    };
    toast({ title: "Erro", description: err.message, variant: "destructive" });
    throw err;
  }

  return data as T;
}

export const AuthAPI = {
  login: <T>(payload: { email: string; senha: string; }) =>
    apiFetch<T>("/auth/login", { method: "POST", body: payload }),
  register: <T>(payload: { nome: string; email: string; senha: string; role: "TUTOR" }) =>
    apiFetch<T>("/auth/register", { method: "POST", body: { nome: payload.nome, email: payload.email, senha: payload.senha, role: payload.role } }),
};
