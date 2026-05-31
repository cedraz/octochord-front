import { apiFetch } from "../utils/apiFetch";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyCodeRequest {
  identifier: string; // email
  code: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
}

// ── Requests ──────────────────────────────────────────────────────────────────

export async function login(data: LoginRequest): Promise<AuthTokens> {
  return apiFetch<AuthTokens>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/user", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<void> {
  return apiFetch<void>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function verifyCode(data: VerifyCodeRequest): Promise<void> {
  return apiFetch<void>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function resendCode(email: string): Promise<void> {
  return apiFetch<void>("/auth/resend-code", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
  emailVerifiedAt?: string | null;
}

export async function getUserProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>("/user/profile");
}

export async function updateProfile(data: { name?: string }): Promise<UserProfile> {
  return apiFetch<UserProfile>("/user/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function changePassword(data: { oldPassword: string; newPassword: string }): Promise<void> {
  return apiFetch<void>("/auth/change-password", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function uploadAvatar(file: File): Promise<UserProfile> {
  const Cookies = (await import("js-cookie")).default;
  const token   = Cookies.get("accessToken");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const form = new FormData();
  form.append("image", file);

  const res = await fetch(`${API_URL}/user/profile/avatar`, {
    method: "PATCH",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });

  if (!res.ok) throw new Error(`Erro ao enviar avatar: ${res.status}`);
  return res.json() as Promise<UserProfile>;
}
