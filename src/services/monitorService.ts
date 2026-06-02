import { apiFetch } from "../utils/apiFetch";

// ── Types alinhados com ApiHealthCheckEntity ───────────────────────────────────

export type MonitorStatus = "UP" | "DOWN" | "PENDING";
export type HttpMethod    = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";

export interface Monitor {
  id: string;
  name: string;              // campo a ser adicionado no backend
  url: string;
  method: HttpMethod;
  interval: number;          // segundos (default 900)
  status: MonitorStatus;
  lastCheckedAt: string;     // ISO datetime
  consecutiveFailures: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  emailNotification?: {
    id: number;
    emails: string[];
  };
}

/** Formato exato de PaginationResultDto<T> do backend */
export interface PaginatedMonitors {
  results: Monitor[];
  total:   number;
  limit:   number;
  init:    number; // offset (0, 10, 20…)
}

/** Alinhado com CreateApiHealthCheckDto */
export interface CreateMonitorRequest {
  name?: string;            // campo a ser adicionado no backend
  url: string;
  method: HttpMethod;
  interval: number;
  createEmailNotificationDto?: {
    emails: string[];
  };
}

export interface UpdateMonitorRequest {
  name?: string;
  url?: string;
  method?: HttpMethod;
  interval?: number;
  emails?: string[];
}

export interface MonitorQueryParams {
  init?:  number; // offset: 0, 10, 20…
  limit?: number;
  q?:     string; // busca por URL
  order?: "ASC" | "DESC";
}

/** Log individual de verificação — ApiHealthCheckLog */
export interface VerificationLog {
  id: number;
  status: MonitorStatus;
  statusCode?: number;
  errorMessage?: string;
  responseTime: number;   // ms
  checkedAt: string;      // ISO datetime
  apiHealthCheckId: string;
}

export interface PaginatedLogs {
  results: VerificationLog[];
  total:   number;
  limit:   number;
  init:    number;
}

export interface MonitorStats {
  uptime:      number;
  slaTarget:   number;
  avgResponseTime: number;
  p95ResponseTime:         number;
  totalChecks: number;
  interval:    number;
}

export interface ChartPoint {
  checkedAt:    string;
  responseTime: number;
}

export interface ChartResponse {
  range:  string;
  points: ChartPoint[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildQuery(params: MonitorQueryParams): string {
  const q = new URLSearchParams();
  // usa !== undefined para não perder o 0 (falsy mas válido como offset)
  if (params.init  !== undefined) q.set("init",  String(params.init));
  if (params.limit !== undefined) q.set("limit", String(params.limit));
  if (params.q)                   q.set("q",     params.q);
  if (params.order)               q.set("order", params.order);
  const str = q.toString();
  return str ? `?${str}` : "";
}

// ── Requests ──────────────────────────────────────────────────────────────────

export async function getMonitors(params: MonitorQueryParams = {}): Promise<PaginatedMonitors> {
  return apiFetch<PaginatedMonitors>(`/api-health-check${buildQuery(params)}`);
}

export async function createMonitor(data: CreateMonitorRequest): Promise<Monitor> {
  return apiFetch<Monitor>("/api-health-check", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMonitor(id: string): Promise<Monitor> {
  return apiFetch<Monitor>(`/api-health-check/${id}`);
}

export async function updateMonitor(id: string, data: UpdateMonitorRequest): Promise<Monitor> {
  return apiFetch<Monitor>(`/api-health-check/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteMonitor(id: string): Promise<Monitor> {
  return apiFetch<Monitor>(`/api-health-check/${id}`, { method: "DELETE" });
}

export async function exportMonitorLogs(id: string): Promise<void> {
  const token = (await import("js-cookie")).default.get("accessToken");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const res = await fetch(`${API_URL}/api-health-check/${id}/logs/export`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) throw new Error(`Erro ao exportar: ${res.status}`);

  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `monitor-${id}-logs.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function getMonitorStats(id: string): Promise<MonitorStats> {
  return apiFetch<MonitorStats>(`/api-health-check/${id}/stats`);
}

export async function getMonitorChart(id: string, range: "1h" | "6h" | "24h" | "7d" = "24h"): Promise<ChartResponse> {
  return apiFetch<ChartResponse>(`/api-health-check/${id}/chart?range=${range}`);
}

export async function getMonitorLogs(id: string, params: MonitorQueryParams = {}): Promise<PaginatedLogs> {
  return apiFetch<PaginatedLogs>(`/api-health-check/${id}/logs${buildQuery(params)}`);
}
