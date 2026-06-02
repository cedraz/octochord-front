import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function extractErrorMessage(res: Response): Promise<string> {
    const text = await res.text();
    try {
        const json = JSON.parse(text);
        const msg = json?.message;
        if (Array.isArray(msg)) return msg.join(", ");
        if (typeof msg === "string") return msg;
    } catch {
        // not JSON
    }
    return text || `Erro ${res.status}`;
}

function buildHeaders(token?: string, extra?: HeadersInit): HeadersInit {
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extra,
    };
}

function logout() {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    window.location.href = "/login";
}

// ── Refresh singleton ─────────────────────────────────────────────────────────
// Múltiplas requisições que expirarem ao mesmo tempo compartilham
// o mesmo Promise de refresh, evitando chamadas duplicadas.

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available");

    const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) throw new Error("Refresh token inválido ou expirado");

    const data = await res.json();
    Cookies.set("accessToken",  data.accessToken,  { expires: 7  });
    Cookies.set("refreshToken", data.refreshToken, { expires: 30 });
    return data.accessToken;
}

// ── apiFetch ──────────────────────────────────────────────────────────────────

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<T> {
    const token = Cookies.get("accessToken");

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: buildHeaders(token, options.headers),
        });

        // ── 401: tenta refresh antes de deslogar ──────────────────────────────
        if (response.status === 401) {
            const hasRefreshToken = !!Cookies.get("refreshToken");

            if (!hasRefreshToken) {
                // Sem refresh token → credenciais erradas no login ou sessão já limpa
                if (token) logout(); // só desloga se havia sessão ativa
                throw new Error("Unauthorized");
            }

            // Reutiliza o mesmo Promise se já existe um refresh em andamento
            refreshPromise ??= refreshAccessToken().finally(() => {
                refreshPromise = null;
            });

            let newToken: string;
            try {
                newToken = await refreshPromise;
            } catch {
                // Refresh falhou → sessão expirada, desloga
                logout();
                throw new Error("Sessão expirada. Faça login novamente.");
            }

            // ── Retry da requisição original com o novo token ─────────────────
            const retry = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: buildHeaders(newToken, options.headers),
            });

            if (!retry.ok) {
                throw new Error(await extractErrorMessage(retry));
            }

            return (await retry.json()) as T;
        }

        if (!response.ok) {
            throw new Error(await extractErrorMessage(response));
        }

        return (await response.json()) as T;

    } catch (error) {
        console.error("apiFetch error:", error);
        throw error;
    }
}
