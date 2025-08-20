import Cookies from "js-cookie";

const API_URL = "https://octochord.cedraz.dev"


export async function apiFetch<T = any>(
    endpoint: string,
    options: RequestInit = {}): Promise<T> {

    const token = Cookies.get("accessToken");

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
        });
        if (response.status === 401) {
            Cookies.remove("accessToken");
            window.location.href = "/login"; // forced logout
            throw new Error("Unauthorized - please check your credentials.");
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`)
        }

        return (await response.json()) as T;

    } catch (error) {
        console.error("apiFetch error:", error);
        throw error
    }
}