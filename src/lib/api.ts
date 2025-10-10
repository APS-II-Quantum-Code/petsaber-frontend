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

export const TutorAPI = {
  meuProgresso: <T>(token: string | null) =>
    apiFetch<T>("/tutor/meu-progresso", { method: "GET", token }),
  buscarPets: <T>(token: string | null) =>
    apiFetch<T>("/tutor/buscar-pets", { method: "GET", token }),
};

export const EspecieAPI = {
  buscarEspecies: <T>(token: string | null) =>
    apiFetch<T>("/tutor/especies", { method: "GET", token }),
};

export const RacaAPI = {
  buscarRacasPorEspecie: <T>(especieId: number, token: string | null) =>
    apiFetch<T>(`/tutor/especies/${especieId}/racas`, { method: "GET", token }),
};

export const PorteAPI = {
    buscarPortes: <T>(token: string | null) =>
        apiFetch<T>("/tutor/portes", { method: "GET", token }),
};

export const PetAPI = {
    cadastrarPet: <T>(petData: any, token: string | null) =>
        apiFetch<T>("/tutor/novo-pet", { method: "POST", body: petData, token }),
    buscarPetPorId: <T>(id: string, token: string | null) =>
        apiFetch<T>(`/tutor/buscar-pets/${id}`, { method: "GET", token }),
    atualizarPet: <T>(id: string, petData: any, token: string | null) =>
        apiFetch<T>(`/tutor/editar-pet/${id}`, { method: "PUT", body: petData, token }),
    deletarPet: <T>(id: string, token: string | null) =>
        apiFetch<T>(`/tutor/deletar-pet/${id}`, { method: "DELETE", token }),
};
