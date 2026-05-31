import { apiFetch } from "../utils/apiFetch";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DiscordIntegration {
  webhooks: string[];
  alertsSent: number;
  avgLatency: number;
  globalStatus: number; // percentual
  status: "ATIVO" | "INATIVO";
}

export interface GitHubIntegration {
  payloadUrl: string;
  secret: string;
  status: "ATIVO" | "PENDENTE";
}

// ── Requests ──────────────────────────────────────────────────────────────────

export async function getDiscordIntegration(): Promise<DiscordIntegration> {
  return apiFetch<DiscordIntegration>("/integrations/discord");
}

export async function updateDiscordWebhooks(webhooks: string[]): Promise<void> {
  return apiFetch<void>("/integrations/discord", {
    method: "PUT",
    body: JSON.stringify({ webhooks }),
  });
}

export async function getGitHubIntegration(): Promise<GitHubIntegration> {
  return apiFetch<GitHubIntegration>("/integrations/github");
}

export async function testGitHubConnection(): Promise<void> {
  return apiFetch<void>("/integrations/github/test", { method: "POST" });
}
