// Author: UKARAKAS | Date: 09.11.2026 | Small client for the PHP API under /api

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "POST";
  body?: unknown;
  form?: FormData;
}

/** Calls /api/<path>. Throws ApiError with a Turkish message the UI can show as is. */
export async function apiRequest<T = Record<string, unknown>>(path: string, opts: RequestOptions = {}): Promise<T> {
  // The custom header blocks cross-site form posts (CSRF): other sites cannot send it without CORS
  const headers: Record<string, string> = { "X-Requested-With": "aktas" };
  let body: BodyInit | undefined;
  if (opts.form) {
    body = opts.form;
  } else if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }

  let res: Response;
  try {
    res = await fetch(`/api/${path}`, {
      method: opts.method ?? (body ? "POST" : "GET"),
      headers,
      body,
      credentials: "same-origin",
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edin.", 0);
  }

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    throw new ApiError("Sunucu beklenmeyen bir yanıt verdi. Sitenin PHP dosyaları yüklü mü?", res.status);
  }

  const obj = (typeof data === "object" && data !== null ? data : {}) as { ok?: boolean; error?: string };
  if (!res.ok || !obj.ok) {
    throw new ApiError(obj.error || "Bir hata oluştu, lütfen tekrar deneyin.", res.status);
  }
  return data as T;
}
