import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { Menu, Pencil, Trash2, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSidebar } from "../../contexts/SidebarContext";
import {
  getMonitor,
  getMonitorStats,
  getMonitorChart,
  getMonitorLogs,
  exportMonitorLogs,
  deleteMonitor,
} from "../../services/monitorService";
import type {
  Monitor,
  MonitorStats,
  ChartPoint,
  VerificationLog,
} from "../../services/monitorService";

function formatInterval(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}min`;
  return `${Math.round(seconds / 3600)}h`;
}

function formatChecks(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

const RANGE_LABELS: Record<string, string> = {
  "1h": "1 hora", "6h": "6 horas", "24h": "24 horas", "7d": "7 dias",
};

function ResponseChart({ points, rangeLabel }: { points: ChartPoint[]; rangeLabel: string }) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; val: number; time: string } | null>(null);
  const W = 100; const H = 40;

  if (points.length === 0) return (
    <div className="h-48 flex items-center justify-center text-sm text-gray-400">
      Sem dados disponíveis para este período.
    </div>
  );

  const data = points.map(p => p.responseTime);
  const min = Math.min(...data); const max = Math.max(...data); const range = max - min || 1;

  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: 4 + ((max - v) / range) * 32,
  }));

  const linePath = pts.reduce((acc, p, i) => {
    if (i === 0) return `M${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    const pp = pts[i - 1];
    const cx = (pp.x + p.x) / 2;
    return `${acc} C${cx.toFixed(2)},${pp.y.toFixed(2)} ${cx.toFixed(2)},${p.y.toFixed(2)} ${p.x.toFixed(2)},${p.y.toFixed(2)}`;
  }, "");

  const areaPath = `${linePath} L${W},${H} L0,${H} Z`;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full h-48"
        onMouseMove={e => {
          const rect = (e.target as SVGSVGElement).closest("svg")!.getBoundingClientRect();
          const ratio = (e.clientX - rect.left) / rect.width;
          const idx = Math.min(Math.round(ratio * (data.length - 1)), data.length - 1);
          setTooltip({
            x: ratio * 100,
            y: pts[idx]?.y ?? 20,
            val: data[idx],
            time: new Date(points[idx].checkedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
          });
        }}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A6B5D" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="#1A6B5D" stopOpacity="0.02"/>
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#cg)"/>
        <path d={linePath} fill="none" stroke="#1A6B5D" strokeWidth="0.6"/>
        {tooltip && <circle cx={tooltip.x} cy={tooltip.y} r="1" fill="#1A6B5D"/>}
      </svg>
      {tooltip && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg pointer-events-none">
          {tooltip.time} — {tooltip.val}ms
        </div>
      )}
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{rangeLabel} atrás</span><span>Agora</span>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const LOGS_PER_PAGE = 10;

export default function MonitorDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { setOpen } = useSidebar();

  const [range, setRange] = useState<"1h" | "6h" | "24h" | "7d">("24h");
  const [logPage, setLogPage] = useState(0);

  const [monitor, setMonitor] = useState<Monitor | null>(null);
  const [stats, setStats] = useState<MonitorStats | null>(null);
  const [chartPoints, setChartPoints] = useState<ChartPoint[]>([]);
  const [logs, setLogs] = useState<VerificationLog[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting,  setDeleting]  = useState(false);

  const skipChartEffect = useRef(true);
  const skipLogsEffect = useRef(true);

  async function handleDelete() {
    if (!id || !window.confirm("Remover este monitor permanentemente?")) return;
    setDeleting(true);
    try {
      await deleteMonitor(id);
      toast.success("Monitor removido.");
      navigate("/dashboard");
    } catch {
      toast.error("Erro ao remover monitor.");
      setDeleting(false);
    }
  }

  async function handleExport() {
    if (!id) return;
    setExporting(true);
    try {
      await exportMonitorLogs(id);
    } catch {
      toast.error("Erro ao exportar CSV. Tente novamente.");
    } finally {
      setExporting(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    Promise.all([
      getMonitor(id),
      getMonitorStats(id),
      getMonitorChart(id, "24h"),
      getMonitorLogs(id, { init: 0, limit: LOGS_PER_PAGE, order: "DESC" }),
    ])
      .then(([mon, st, chart, logsPage]) => {
        setMonitor(mon);
        setStats(st);
        setChartPoints(chart.points);
        setLogs(logsPage.results);
        setTotalLogs(logsPage.total);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (skipChartEffect.current) { skipChartEffect.current = false; return; }
    if (!id) return;
    setChartLoading(true);
    getMonitorChart(id, range)
      .then(chart => setChartPoints(chart.points))
      .catch(() => {})
      .finally(() => setChartLoading(false));
  }, [range, id]);

  useEffect(() => {
    if (skipLogsEffect.current) { skipLogsEffect.current = false; return; }
    if (!id) return;
    setLogsLoading(true);
    getMonitorLogs(id, { init: logPage * LOGS_PER_PAGE, limit: LOGS_PER_PAGE, order: "DESC" })
      .then(result => {
        setLogs(result.results);
        setTotalLogs(result.total);
      })
      .catch(() => {})
      .finally(() => setLogsLoading(false));
  }, [logPage, id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-500 text-sm">
      Carregando...
    </div>
  );

  if (error || !monitor || !stats) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3">
      <p className="text-red-500 text-sm">{error || "Monitor não encontrado."}</p>
      <button onClick={() => navigate(-1)} className="text-sm text-brand underline cursor-pointer">Voltar</button>
    </div>
  );

  const totalPages = Math.ceil(totalLogs / LOGS_PER_PAGE);

  const statusBadge = monitor.status === "UP"
    ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"><span className="w-1.5 h-1.5 rounded-full bg-green-500"/> ATIVO</span>
    : monitor.status === "DOWN"
      ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"><span className="w-1.5 h-1.5 rounded-full bg-red-500"/> DOWN</span>
      : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"/> PENDENTE</span>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shrink-0">
        <button onClick={() => setOpen(true)} className="lg:hidden text-gray-500 cursor-pointer"><Menu className="w-5 h-5"/></button>
        <div className="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="" className="h-8 w-auto"/>
          <span className="font-bold text-base text-gray-900 hidden sm:block">Octocord</span>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-800 transition-colors cursor-pointer self-start">← Voltar</button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{monitor.name || monitor.url}</h1>
              {statusBadge}
            </div>
            <p className="text-sm text-gray-500">{monitor.url}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => navigate(`/dashboard/monitors/${id}/edit`)}
              className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <Pencil className="w-3.5 h-3.5"/> Editar
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              {deleting
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin"/> Excluindo...</>
                : <><Trash2 className="w-3.5 h-3.5"/> Excluir</>}
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">Uptime (30 dias)</p>
            <p className="text-4xl font-bold text-gray-900 mt-1">{stats.uptime.toFixed(2)}<span className="text-2xl">%</span></p>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>SLA Alvo</span><span>{stats.slaTarget}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand rounded-full" style={{ width: `${Math.min(stats.uptime, 100)}%` }}/>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3">
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">Tempo de Resposta Médio</p>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-4xl font-bold text-gray-900">{Math.round(stats.avgResponseTime)}</span>
                <span className="text-xl text-gray-500 mb-1">ms</span>
              </div>
            </div>
            <div className="h-px bg-gray-100"/>
            <div className="flex justify-between text-xs text-gray-500">
              <span>P95 Latência</span>
              <span className="font-medium text-gray-700">{Math.round(stats.p95ResponseTime)}ms</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3">
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">Total de Verificações</p>
              <p className="text-4xl font-bold text-gray-900 mt-1">{formatChecks(stats.totalChecks)}</p>
              <p className="text-xs text-gray-500">nas últimas 24h</p>
            </div>
            <div className="h-px bg-gray-100"/>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Intervalo</span>
              <span className="font-medium text-gray-700">{formatInterval(stats.interval)}</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="font-semibold text-sm text-gray-900">Tempo de Resposta ({range})</h3>
              <p className="text-xs text-gray-500">Latência ao longo do tempo.</p>
            </div>
            <div className="flex gap-1">
              {(["1h", "6h", "24h", "7d"] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg cursor-pointer transition-colors
                    ${range === r ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >{r}</button>
              ))}
            </div>
          </div>
          {chartLoading ? (
            <div className="h-48 flex items-center justify-center text-sm text-gray-400">Carregando gráfico...</div>
          ) : (
            <ResponseChart points={chartPoints} rangeLabel={RANGE_LABELS[range]}/>
          )}
        </div>

        {/* Verification history */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-sm text-gray-900">Histórico de Verificações</h3>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-1.5 text-xs text-brand hover:text-brand-hover font-medium cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin"/> Exportando...</>
                : <><Download className="w-3.5 h-3.5"/> Exportar CSV</>}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {["Status", "Resposta", "Data/Hora"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logsLoading ? (
                  <tr><td colSpan={3} className="px-5 py-6 text-center text-gray-400">Carregando...</td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan={3} className="px-5 py-6 text-center text-gray-400">Nenhuma verificação encontrada.</td></tr>
                ) : logs.map((log, i) => {
                  const isError = log.status === "DOWN";
                  const statusLabel = log.statusCode
                    ? `${log.statusCode} ${log.errorMessage || (log.status === "UP" ? "OK" : log.status)}`
                    : log.status;
                  return (
                    <tr key={log.id} className={`border-b border-gray-100 ${i === logs.length - 1 ? "border-b-0" : ""}`}>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 font-semibold ${isError ? "text-red-500" : "text-gray-700"}`}>
                          <span className={`w-2 h-2 rounded-full ${isError ? "bg-red-500" : "bg-green-500"}`}/>{statusLabel}
                        </span>
                      </td>
                      <td className={`px-5 py-3.5 font-medium ${isError ? "text-red-500" : "text-gray-600"}`}>{log.responseTime}ms</td>
                      <td className="px-5 py-3.5 text-gray-500">{formatDate(log.checkedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Mostrando {logs.length} de {totalLogs.toLocaleString("pt-BR")} verificações
            </span>
            <div className="flex gap-1">
              <button
                disabled={logPage === 0}
                onClick={() => setLogPage(p => p - 1)}
                className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors text-xs px-2"
              >‹</button>
              <button
                disabled={logPage >= totalPages - 1}
                onClick={() => setLogPage(p => p + 1)}
                className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors text-xs px-2"
              >›</button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
        <span>© 2024 Octocord Monitoring. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-700 transition-colors">Support</a>
          <a href="#" className="hover:text-gray-700 transition-colors">Legal</a>
          <a href="#" className="hover:text-gray-700 transition-colors">API Status</a>
        </div>
      </footer>
    </div>
  );
}
