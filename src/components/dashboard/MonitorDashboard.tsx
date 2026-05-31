import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Plus, SlidersHorizontal, RefreshCw, MoreVertical, Menu, Loader2, Pencil, Trash2 } from "lucide-react";
import { useSidebar } from "../../contexts/SidebarContext";
import { getMonitors, deleteMonitor, type Monitor, type MonitorStatus } from "@/services/monitorService";
import { timeAgo, formatInterval } from "@/utils/timeAgo";

const BADGE: Record<MonitorStatus, string> = { UP: "bg-green-100 text-green-700", DOWN: "bg-red-100 text-red-700", PENDING: "bg-amber-100 text-amber-700" };
const DOT:   Record<MonitorStatus, string> = { UP: "bg-green-500", DOWN: "bg-red-500", PENDING: "bg-amber-500" };


// ── Row dropdown menu ─────────────────────────────────────────────────────────

function RowMenu({ id, onDeleted }: { id: string; onDeleted: () => void }) {
  const [open,     setOpen]     = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [menuPos,  setMenuPos]  = useState({ top: 0, right: 0 });
  const btnRef  = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  function handleOpen(e: React.MouseEvent) {
    e.stopPropagation();
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
    }
    setOpen(v => !v);
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!window.confirm("Remover este monitor permanentemente?")) return;
    setDeleting(true);
    setOpen(false);
    try {
      await deleteMonitor(id);
      toast.success("Monitor removido.");
      onDeleted();
    } catch {
      toast.error("Erro ao remover monitor.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div onClick={e => e.stopPropagation()}>
      <button
        ref={btnRef}
        onClick={handleOpen}
        disabled={deleting}
        className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer text-gray-400 disabled:opacity-40"
      >
        {deleting
          ? <Loader2 className="w-4 h-4 animate-spin"/>
          : <MoreVertical className="w-4 h-4"/>}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={e => { e.stopPropagation(); setOpen(false); }}/>
          <div
            className="fixed z-50 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-36 overflow-hidden"
            style={{ top: menuPos.top, right: menuPos.right }}
          >
            <button
              onClick={e => { e.stopPropagation(); setOpen(false); navigate(`/dashboard/monitors/${id}/edit`); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <Pencil className="w-3.5 h-3.5 text-brand"/> Editar
            </button>
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5"/> Excluir
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MonitorDashboard() {
  const navigate = useNavigate();
  const { setOpen } = useSidebar();

  const LIMIT = 10;
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [total,    setTotal]    = useState(0);
  const [init,     setInit]     = useState(0); // offset atual
  const [loading,  setLoading]  = useState(true);

  async function load(offset = 0) {
    setLoading(true);
    try {
      const res = await getMonitors({ init: offset, limit: LIMIT });
      setMonitors(res.results);
      setTotal(res.total);
      setInit(res.init);
    } catch {
      toast.error("Erro ao carregar monitores.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(0); }, []);

  const hasPrev  = init > 0;
  const hasNext  = init + LIMIT < total;
  const pageInfo = `${init + 1}–${Math.min(init + LIMIT, total)} de ${total}`;

  const countByStatus = (s: MonitorStatus) => monitors.filter(m => m.status === s).length;

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
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Status das APIs</h1>
            <p className="text-sm text-gray-500 mt-1">Monitoramento em tempo real de seus serviços críticos.</p>
          </div>
          <button onClick={() => navigate("/dashboard/monitors/new")}
            className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0">
            <Plus className="w-4 h-4"/> Adicionar Novo Monitor
          </button>
        </div>

        {/* Stat cards — derivados dos dados reais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Total de APIs",  value: String(total), sub: "Monitores cadastrados",            color: "" },
            { label: "Status UP",      value: String(countByStatus("UP")),      sub: "Verificações OK",           color: "text-green-600" },
            { label: "Status DOWN",    value: String(countByStatus("DOWN")),     sub: countByStatus("DOWN") > 0 ? "Incidentes ativos" : "Sem incidentes", color: "text-red-500" },
            { label: "Em verificação", value: String(countByStatus("PENDING")),  sub: "Aguardando resultado",      color: "text-amber-600" },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-200 px-5 py-4">
              <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">{label}</p>
              <p className={`text-3xl font-bold leading-none mt-1 ${color || "text-gray-900"}`}>{loading ? "—" : value}</p>
              <p className="text-xs text-gray-500 mt-1.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-sm text-gray-900">Monitores Ativos</h2>
            <div className="flex gap-1 text-gray-400">
              <button className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"><SlidersHorizontal className="w-4 h-4"/></button>
              <button onClick={() => load(init)} className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}/></button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2"/> Carregando monitores...
            </div>
          ) : monitors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
              <p className="text-sm">Nenhum monitor cadastrado ainda.</p>
              <button onClick={() => navigate("/dashboard/monitors/new")}
                className="text-sm text-brand hover:text-brand-hover font-medium cursor-pointer transition-colors">
                + Adicionar seu primeiro monitor
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {["URL / Nome","Status","Última Checagem","Intervalo","Falhas",""].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monitors.map((m, i) => (
                    <tr key={m.id} onClick={() => navigate(`/dashboard/monitors/${m.id}`)}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${i === monitors.length - 1 ? "border-b-0" : ""}`}>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-900">{m.url}</p>
                        {m.name && <p className="text-[10px] tracking-widest text-gray-400 uppercase mt-0.5">{m.name}</p>}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${BADGE[m.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${DOT[m.status]}`}/> {m.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{timeAgo(m.lastCheckedAt)}</td>
                      <td className="px-5 py-3.5 text-gray-600">{formatInterval(m.interval)}</td>
                      <td className={`px-5 py-3.5 font-semibold ${m.consecutiveFailures > 0 ? "text-red-500" : "text-gray-400"}`}>
                        {m.consecutiveFailures}
                      </td>
                      <td className="px-5 py-3.5">
                        <RowMenu id={m.id} onDeleted={() => load(init)}/>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && total > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-t border-gray-100">
              <span className="text-xs text-gray-400">Exibindo {pageInfo} monitores</span>
              <div className="flex gap-2">
                <button disabled={!hasPrev} onClick={() => load(init - LIMIT)}
                  className="px-4 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed">
                  Anterior
                </button>
                <button disabled={!hasNext} onClick={() => load(init + LIMIT)}
                  className="px-4 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-gray-900 bg-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed">
                  Próximo
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
        <span>© 2024 Octocord Monitoring. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-700 transition-colors">Support</a>
          <a href="#" className="hover:text-gray-700 transition-colors">Legal</a>
          <a href="#" className="hover:text-gray-700 font-semibold underline transition-colors">API Status</a>
        </div>
      </footer>
    </div>
  );
}
