import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { Menu, Link2, ChevronDown, Loader2 } from "lucide-react";
import { useSidebar } from "../../contexts/SidebarContext";
import { getMonitor, updateMonitor, type HttpMethod } from "@/services/monitorService";
import { Toggle, EmailListInput } from "./MonitorFormShared";

const HTTP_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"];

const MIN_INTERVAL = 300;
const MAX_INTERVAL = 1800;

function intervalLabel(s: number) {
  if (s < 60)   return `${s}s`;
  if (s < 3600) return `${Math.round(s / 60)}min`;
  return `${(s / 3600).toFixed(0)}h`;
}

export default function EditMonitor() {
  const { id }    = useParams<{ id: string }>();
  const navigate  = useNavigate();
  const { setOpen } = useSidebar();

  const [name,          setName]          = useState("");
  const [method,        setMethod]        = useState<HttpMethod>("GET");
  const [url,           setUrl]           = useState("");
  const [interval,      setInterval]      = useState(900);
  const [emailEnabled,  setEmailEnabled]  = useState(false);
  const [notifEmails,   setNotifEmails]   = useState<string[]>([]);
  const [fetching,      setFetching]      = useState(true);
  const [loading,       setLoading]       = useState(false);

  const sliderPct = ((interval - MIN_INTERVAL) / (MAX_INTERVAL - MIN_INTERVAL)) * 100;

  function handleSliderChange(v: number) {
    setInterval(Math.min(MAX_INTERVAL, Math.max(MIN_INTERVAL, v)));
  }

  function handleInputChange(v: number) {
    if (isNaN(v)) return;
    setInterval(Math.min(MAX_INTERVAL, Math.max(MIN_INTERVAL, v)));
  }

  useEffect(() => {
    if (!id) return;
    getMonitor(id)
      .then(m => {
        console.log("[EditMonitor] monitor payload:", m);
        setName(m.name ?? "");
        setMethod(m.method);
        setUrl(m.url);
        setInterval(Math.min(MAX_INTERVAL, Math.max(MIN_INTERVAL, m.interval)));
        const emails = m.emailNotification?.emails ?? [];
        if (emails.length > 0) {
          setEmailEnabled(true);
          setNotifEmails(emails);
        }
      })
      .catch(() => {
        toast.error("Monitor não encontrado.");
        navigate("/dashboard");
      })
      .finally(() => setFetching(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    try {
      await updateMonitor(id, {
        name,
        url,
        method,
        interval,
        emails: emailEnabled ? notifEmails : [],
      });
      toast.success("Monitor atualizado com sucesso!");
      navigate(`/dashboard/monitors/${id}`);
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao atualizar monitor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2"/> Carregando monitor...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shrink-0">
        <button onClick={() => setOpen(true)} className="lg:hidden text-gray-500 cursor-pointer">
          <Menu className="w-5 h-5"/>
        </button>
        <div className="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="" className="h-8 w-auto"/>
          <span className="font-bold text-base text-gray-900 hidden sm:block">Octocord</span>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-800 transition-colors cursor-pointer self-start">
          ← Voltar
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">Editar Monitor</h1>
          <p className="text-sm text-gray-500 mt-1.5 mb-8">
            Atualize os parâmetros de disponibilidade e frequência do monitoramento.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Nome + Método */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Nome / Apelido</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="ex: Produção Gateway"
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand transition-all placeholder:text-gray-300"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Método HTTP</label>
                <div className="relative">
                  <select
                    value={method}
                    onChange={e => setMethod(e.target.value as HttpMethod)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand transition-all appearance-none bg-white cursor-pointer"
                  >
                    {HTTP_METHODS.map(m => <option key={m}>{m}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/>
                </div>
              </div>
            </div>

            {/* URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">URL do Endpoint</label>
              <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-brand/25 focus-within:border-brand transition-all">
                <Link2 className="w-4 h-4 text-gray-400 shrink-0"/>
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  required
                  placeholder="https://api.seuservico.com/health"
                  className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Intervalo + Notificações */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700">Intervalo de Check</label>
                  <span className="text-sm font-bold text-brand">{intervalLabel(interval)}</span>
                </div>
                <input
                  type="range"
                  min={MIN_INTERVAL}
                  max={MAX_INTERVAL}
                  step={60}
                  value={interval}
                  onChange={e => handleSliderChange(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #1A6B5D ${sliderPct}%, #E5E7EB ${sliderPct}%)` }}
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>5 min</span><span>30 min</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    min={MIN_INTERVAL}
                    max={MAX_INTERVAL}
                    value={interval}
                    onChange={e => handleInputChange(Number(e.target.value))}
                    onBlur={e => handleInputChange(Number(e.target.value))}
                    className="w-24 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors text-gray-700"
                  />
                  <span className="text-xs text-gray-400">segundos (mín. 300)</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Notificações por E-mail</p>
                    <p className="text-xs text-gray-500 mt-0.5">Alertar equipe se o status não for 2xx.</p>
                  </div>
                  <Toggle checked={emailEnabled} onChange={v => { setEmailEnabled(v); if (!v) setNotifEmails([]); }}/>
                </div>
                {emailEnabled && (
                  <EmailListInput emails={notifEmails} onChange={setNotifEmails}/>
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                CANCELAR
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 text-sm font-semibold bg-brand hover:bg-brand-hover disabled:opacity-60 text-white rounded-xl transition-colors cursor-pointer uppercase tracking-wide flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin"/>}
                {loading ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
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
