import { apiFetch } from "./apiFetch";

export async function getUserData(token: string) {
    return apiFetch("/user/profile", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}