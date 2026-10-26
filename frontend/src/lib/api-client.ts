export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  token?: string;
  cache?: RequestCache;
  revalidate?: number;
  lang?: string;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(endpoint: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, cache, revalidate, lang } = opts;

  const url = new URL(`${API_BASE}/${endpoint.replace(/^\//, "")}`);
  if (lang) url.searchParams.set("lang", lang);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const fetchOpts: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  if (cache) fetchOpts.cache = cache;
  if (revalidate !== undefined) {
    fetchOpts.next = { revalidate };
  }

  const res = await fetch(url.toString(), fetchOpts);

  if (!res.ok) {
    let data: unknown;
    try { data = await res.json(); } catch { data = null; }
    throw new ApiError(res.status, `API Error ${res.status}: ${endpoint}`, data);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ─── Public API helpers ───────────────────────────────────────────────────────

import type {
  PaginatedResponse,
  Division, Product, ProductCategory,
  Service, Certificate, Partner,
  Project, Statistic, PageContent,
  LeadCreate, LeadCreateResponse,
} from "@/types/api";

export const api = {
  divisions: {
    list: (lang?: string) =>
      request<PaginatedResponse<Division>>("divisions/?page_size=100", { lang, revalidate: 60 }),
    detail: (slug: string, lang?: string) =>
      request<Division>(`divisions/${slug}/`, { lang, revalidate: 60 }),
  },
  products: {
    categories: (lang?: string) =>
      request<PaginatedResponse<ProductCategory>>("products/categories/?page_size=100", { lang, revalidate: 300 }),
    list: (params?: Record<string, string>, lang?: string) => {
      const qs = params && Object.keys(params).length ? "&" + new URLSearchParams(params).toString() : "";
      return request<PaginatedResponse<Product>>(`products/?page_size=200${qs}`, { lang, revalidate: 60 });
    },
    detail: (slug: string, lang?: string) =>
      request<Product>(`products/${slug}/`, { lang, revalidate: 60 }),
  },
  services: {
    list: (lang?: string) =>
      request<PaginatedResponse<Service>>("services/?page_size=100", { lang, revalidate: 300 }),
    detail: (slug: string, lang?: string) =>
      request<Service>(`services/${slug}/`, { lang, revalidate: 300 }),
  },
  certificates: {
    list: (lang?: string) =>
      request<PaginatedResponse<Certificate>>("certificates/?page_size=100", { lang, revalidate: 300 }),
  },
  partners: {
    list: (featured?: boolean, lang?: string) => {
      const qs = featured ? "?is_featured=true&is_active=true&page_size=100" : "?is_active=true&page_size=100";
      return request<PaginatedResponse<Partner>>(`partners/${qs}`, { lang, revalidate: 60 });
    },
  },
  projects: {
    list: (lang?: string) =>
      request<PaginatedResponse<Project>>("projects/?page_size=50", { lang, revalidate: 300 }),
    detail: (slug: string, lang?: string) =>
      request<Project>(`projects/${slug}/`, { lang, revalidate: 300 }),
  },
  stats: {
    list: (lang?: string) =>
      request<PaginatedResponse<Statistic>>("stats/", { lang, revalidate: 600 }),
  },
  pages: {
    byKey: (key: string, lang?: string) =>
      request<PageContent>(`pages/by-key/${key}/`, { lang, revalidate: 60 }),
  },
  leads: {
    create: (data: LeadCreate) =>
      request<LeadCreateResponse>("leads/", { method: "POST", body: data }),
  },
};
