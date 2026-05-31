import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Bell, Search, Globe, Menu, Trash2, Plus, Copy, Eye, EyeOff, RefreshCw, AlertCircle } from "lucide-react";
import { useSidebar } from "../../contexts/SidebarContext";

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#5865F2]" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.01.043.027.056a19.899 19.899 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-900" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

export default function Integrations() {
  const navigate = useNavigate();
  const { setOpen } = useSidebar();

  const [webhooks, setWebhooks]   = useState(["https://discord.com/api/webhooks/982341...", ""]);
  const [showSecret, setShowSecret] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [testing, setTesting]     = useState(false);

  function addWebhook()  { setWebhooks(w => [...w, ""]); }
  function removeWebhook(i: number) { setWebhooks(w => w.filter((_, idx) => idx !== i)); }

  async function handleSave() {
    setSaving(true);
    try {
      // TODO: await updateDiscordWebhooks(webhooks.filter(Boolean));
      toast.success("Configurações salvas!");
    } catch { toast.error("Erro ao salvar."); }
    finally { setSaving(false); }
  }

  async function handleTest() {
    setTesting(true);
    try {
      // TODO: await testGitHubConnection();
      toast.success("Conexão testada com sucesso!");
    } catch { toast.error("Falha na conexão."); }
    finally { setTesting(false); }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shrink-0">
        <button onClick={() => setOpen(true)} className="lg:hidden text-gray-500 cursor-pointer"><Menu className="w-5 h-5"/></button>
        <span className="font-bold text-sm text-gray-900 hidden sm:block">Octocord</span>
        <nav className="hidden md:flex items-center gap-1 ml-2">
          {[["Dashboard","/dashboard"],["Integrations","/dashboard/integrations"],["GitHub Commits","/dashboard/github"]].map(([label, path]) => (
            <button key={path} onClick={() => navigate(path)}
              className={`px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer
                ${path === "/dashboard/integrations" ? "text-brand border-b-2 border-brand" : "text-gray-500 hover:text-gray-800"}`}>{label}</button>
          ))}
        </nav>
        <div className="flex-1"/>
        <div className="hidden md:flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 w-44">
          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0"/>
          <span className="text-xs text-gray-400">Procurar...</span>
        </div>
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"><Bell className="w-4 h-4"/></button>
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"><Globe className="w-4 h-4"/></button>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-800 transition-colors cursor-pointer self-start">← Voltar</button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gerenciamento de Integrações</h1>
          <p className="text-sm text-gray-500 mt-1">Conecte suas ferramentas de monitoramento para receber alertas e sincronizar dados em tempo real.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Discord card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center"><DiscordIcon/></div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Discord Webhooks</p>
                  <p className="text-xs text-gray-500">Envie alertas críticos diretamente para seus canais.</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"/> ATIVO
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">URL do Webhook</label>
              {webhooks.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <input value={url} onChange={e => setWebhooks(w => w.map((v, idx) => idx === i ? e.target.value : v))}
                    placeholder="https://discord.com/api/webhooks/..."
                    className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand transition-all placeholder:text-gray-300"/>
                  <button onClick={() => removeWebhook(i)}
                    className="p-2.5 border border-gray-200 rounded-xl text-red-400 hover:bg-red-50 cursor-pointer transition-colors shrink-0">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>
              ))}
              <button onClick={addWebhook}
                className="flex items-center gap-1.5 text-sm text-brand hover:text-brand-hover font-medium cursor-pointer transition-colors self-start">
                <Plus className="w-4 h-4"/> Adicionar novo Webhook
              </button>
            </div>

            <div className="h-px bg-gray-100"/>
            <button onClick={handleSave} disabled={saving}
              className="w-full py-2.5 bg-btn-primary hover:bg-btn-primary-hover disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer">
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[{ label: "Alertas Enviados", value: "1,284" }, { label: "Latência Média", value: <span className="text-brand">42ms</span> }, { label: "Status Global", value: <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"/>100%</span> }].map(({ label, value }) => (
                <div key={label} className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] tracking-widest text-gray-400 uppercase mb-1">{label}</p>
                  <p className="text-base font-bold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"><GitHubIcon/></div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">GitHub Webhooks</p>
                  <p className="text-xs text-gray-500">Sincronização de commits e builds.</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"/> PENDENTE
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">Payload URL</label>
              <div className="flex gap-2">
                <input readOnly value="https://api.octochord.io/v1/hooks/gh/7x2..."
                  className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 text-gray-600 outline-none"/>
                <button onClick={() => { navigator.clipboard.writeText("https://api.octochord.io/v1/hooks/gh/7x2"); toast.success("Copiado!"); }}
                  className="p-2.5 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors shrink-0">
                  <Copy className="w-4 h-4"/>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">Webhook Secret</label>
              <div className="flex gap-2">
                <input readOnly type={showSecret ? "text" : "password"} value="octo_9k2m_3j1L90xPz_2024"
                  className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white text-gray-700 outline-none"/>
                <button onClick={() => setShowSecret(s => !s)}
                  className="p-2.5 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors shrink-0">
                  {showSecret ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
              <p className="text-xs text-gray-500">Use este segredo nas configurações do seu repositório GitHub para garantir a integridade dos payloads recebidos.</p>
            </div>

            {/* Security tip */}
            <div className="flex gap-2 p-3.5 bg-brand/5 border border-brand/20 rounded-xl">
              <AlertCircle className="w-4 h-4 text-brand shrink-0 mt-0.5"/>
              <div>
                <p className="text-[11px] font-semibold tracking-widest text-brand uppercase mb-0.5">Dica de Segurança</p>
                <p className="text-xs text-brand/80 italic leading-relaxed">Nunca compartilhe sua Secret Key. Se comprometida, regenere-a imediatamente no painel de segurança.</p>
              </div>
            </div>

            <div className="h-px bg-gray-100"/>
            <button onClick={handleTest} disabled={testing}
              className="w-full py-2.5 bg-brand hover:bg-brand-hover disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide">
              <RefreshCw className={`w-4 h-4 ${testing ? "animate-spin" : ""}`}/>
              {testing ? "Testando..." : "Testar Conexão"}
            </button>
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
