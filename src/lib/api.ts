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
  meusDados: <T>(token: string | null) =>
    apiFetch<T>("/tutor/meus-dados", { method: "GET", token }),
  meuProgresso: <T>(token: string | null) =>
    apiFetch<T>("/tutor/meu-progresso", { method: "GET", token }),
  atualizarSenha: <T>(payload: { senhaAtual: string; novaSenha: string }, token: string | null) =>
    apiFetch<T>("/tutor/atualizar-senha", { method: "PUT", body: payload, token }),
  atualizarPerfil: <T>(
    payload: {
      nome: string;
      cpf: string;
      telefone: string;
      dataNascimento: string; // ISO format (YYYY-MM-DD)
      genero: string;
      nacionalidade: string;
    },
    token: string | null
  ) =>
    apiFetch<T>("/tutor/atualizar-perfil", { method: "PUT", body: payload, token }),
  buscarPets: <T>(token: string | null) =>
    apiFetch<T>("/tutor/buscar-pets", { method: "GET", token }),
  minhasTrilhas: <T>(token: string | null) =>
    apiFetch<T>("/tutor/trilhas/minhas-trilhas", { method: "GET", token }),
  trilhasDisponiveis: <T>(
    token: string | null,
    opts?: { idRaca?: string | number; nivel?: "INICIANTE" | "INTERMEDIARIO" | "AVANCADO"; page?: number; size?: number }
  ) => {
    const params = new URLSearchParams();
    if (opts?.idRaca !== undefined && opts?.idRaca !== null && String(opts.idRaca).length > 0) {
      params.set("idRaca", String(opts.idRaca));
    }
    if (opts?.nivel) {
      params.set("nivel", opts.nivel);
    }
    if (typeof opts?.page === "number") {
      params.set("page", String(opts.page));
    }
    if (typeof opts?.size === "number") {
      params.set("size", String(opts.size));
    }
    const qs = params.toString();
    const path = `/tutor/trilhas${qs ? `?${qs}` : ""}`;
    return apiFetch<T>(path, { method: "GET", token });
  },
  trilhaMeuProgresso: <T>(trailId: string, token: string | null) =>
    apiFetch<T>(`/tutor/trilhas/${trailId}/meu-progresso`, { method: "GET", token }),
  iniciarTrilha: <T>(trailId: string, token: string | null) =>
    apiFetch<T>(`/tutor/trilhas/${trailId}/iniciar`, { method: "POST", token }),
  moduloDetalhes: <T>(moduloId: string, token: string | null) =>
    apiFetch<T>(`/tutor/modulos/${moduloId}`, { method: "GET", token }),
  exerciciosDoModulo: <T>(moduloId: string, token: string | null) =>
    apiFetch<T>(`/tutor/modulos/${moduloId}/exercicios`, { method: "GET", token }),
  responderExercicio: <T>(exercicioId: number | string, alternativaId: number, token: string | null) =>
    apiFetch<T>(`/tutor/exercicios/${exercicioId}/responder`, { method: "POST", token, body: { idAlternativaEscolhida: alternativaId } }),
  moduloMeuProgresso: <T>(moduloId: string | number, token: string | null) =>
    apiFetch<T>(`/tutor/modulos/${moduloId}/meu-progresso`, { method: "GET", token }),
  ranking: <T>(token: string | null) =>
    apiFetch<T>("/tutor/ranking", { method: "GET", token }),
  recompensas: <T>(token: string | null, opts?: { page?: number; size?: number }) => {
    const page = opts?.page ?? 0;
    const size = opts?.size ?? 5;
    const qs = `?page=${page}&size=${size}`;
    return apiFetch<T>(`/tutor/recompensas${qs}`, { method: "GET", token });
  },
  minhasRecompensas: <T>(token: string | null, opts?: { page?: number; size?: number }) => {
    const page = opts?.page ?? 0;
    const size = opts?.size ?? 5;
    const qs = `?page=${page}&size=${size}`;
    return apiFetch<T>(`/tutor/minhas-recompensas${qs}`, { method: "GET", token });
  },
  resgatarRecompensa: <T>(idRecompensa: string | number, token: string | null) =>
    apiFetch<T>(`/tutor/resgatar-recompensa/${idRecompensa}`, { method: "POST", token }),
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
