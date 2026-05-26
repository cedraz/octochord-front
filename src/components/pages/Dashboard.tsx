import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Plug2,
  GitCommit,
  User,
  Bell,
  Search,
  Plus,
  SlidersHorizontal,
  RefreshCw,
  Menu,
  X,
  GitBranch,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type MonitorStatus = "UP" | "DOWN" | "PENDING";

interface Monitor {
  id: number;
  url: string;
  service: string;
  status: MonitorStatus;
  lastCheck: string;
  interval: string;
  uptime: string;
  sparkline: "up-wavy" | "down" | "pending" | "up-flat";
}

type NavItem = "dashboard" | "integrations" | "github" | "profile";
type Tab = "monitores" | "alertas" | "equipe";

// ── Mock data ─────────────────────────────────────────────────────────────────

const MONITORS: Monitor[] = [
  { id: 1, url: "api.vigilant.io/v1/auth",        service: "AUTH SERVICE - PRODUCTION", status: "UP",      lastCheck: "Agora mesmo", interval: "60s", uptime: "99.99%",  sparkline: "up-wavy"  },
  { id: 2, url: "gateway.vigilant.io/payments",   service: "STRIPE INTEGRATION",        status: "DOWN",    lastCheck: "4 min atrás", interval: "30s", uptime: "94.20%",  sparkline: "down"     },
  { id: 3, url: "internal.inventory.svc",         service: "DATABASE SYNC",             status: "PENDING", lastCheck: "Checando...", interval: "5m",  uptime: "98.50%",  sparkline: "pending"  },
  { id: 4, url: "api.vigilant.io/v1/users",       service: "USER MANAGEMENT",           status: "UP",      lastCheck: "2 min atrás", interval: "60s", uptime: "100.00%", sparkline: "up-flat"  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function ShieldLogo({ size = 5 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" className={`w-${size} h-${size} fill-brand shrink-0`} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z" />
    </svg>
  );
}

const STATUS_STYLES: Record<MonitorStatus, string> = {
  UP:      "bg-green-100  text-green-700",
  DOWN:    "bg-red-100    text-red-700",
  PENDING: "bg-amber-100  text-amber-700",
};

const STATUS_DOT: Record<MonitorStatus, string> = {
  UP:      "bg-green-500",
  DOWN:    "bg-red-500",
  PENDING: "bg-amber-500",
};

function StatusBadge({ status }: { status: MonitorStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {status}
    </span>
  );
}

const UPTIME_COLOR: Record<string, string> = {
  "99.99%":  "text-green-600",
  "94.20%":  "text-red-500",
  "98.50%":  "text-gray-500",
  "100.00%": "text-brand font-bold",
};

function Sparkline({ type }: { type: Monitor["sparkline"] }) {
  const w = 90; const h = 30;
  if (type === "up-wavy")
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <path d="M0,18 C10,10 20,24 30,18 C40,12 50,24 60,18 C70,12 80,24 90,18"
          fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  if (type === "down")
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <path d="M0,8 C20,12 40,18 60,23 L90,28"
          fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  if (type === "pending")
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <path d="M0,15 L90,15" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="5,4" />
      </svg>
    );
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d="M0,15 L90,15" fill="none" stroke="#1A6B5D" strokeWidth="2" />
    </svg>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

interface SidebarProps {
  activeNav: NavItem;
  setActiveNav: (n: NavItem) => void;
  onClose?: () => void;
}

const NAV_ITEMS: { id: NavItem; label: string; Icon: React.ElementType }[] = [
  { id: "dashboard",    label: "Dashboard",      Icon: LayoutDashboard },
  { id: "integrations", label: "Integrations",   Icon: Plug2            },
  { id: "github",       label: "GitHub Commits", Icon: GitCommit        },
  { id: "profile",      label: "User Profile",   Icon: User             },
];

function Sidebar({ activeNav, setActiveNav, onClose }: SidebarProps) {
  return (
    <aside className="w-56 shrink-0 flex flex-col border-r border-gray-200 bg-white h-full">
      {/* Brand */}
      <div className="px-5 pt-6 pb-4 border-b border-gray-100">
        {onClose && (
          <button onClick={onClose} className="lg:hidden mb-3 text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        )}
        <p className="font-bold text-sm text-gray-900">Octochord</p>
        <p className="text-[10px] tracking-widest text-gray-400 uppercase mt-0.5 leading-tight">
          Monitoramento de<br />Infraestrutura
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = activeNav === id;
          return (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left
                ${active
                  ? "bg-brand/8 text-brand border-l-2 border-brand rounded-l-none pl-[10px]"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Plan footer */}
      <div className="px-5 py-5 border-t border-gray-100">
        <p className="text-[10px] tracking-widest text-gray-400 uppercase mb-1">Plano Atual</p>
        <p className="text-sm font-bold text-gray-900 mb-2">Enterprise Pro</p>
        <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
          <div className="h-full w-3/4 bg-brand rounded-full" />
        </div>
      </div>
    </aside>
  );
}

// ── Dashboard page ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [activeTab,  setActiveTab]  = useState<Tab>("monitores");
  const [activeNav,  setActiveNav]  = useState<NavItem>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  function handleAddMonitor() {
    // TODO: open modal or navigate to add monitor page
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-50 text-gray-900"
      style={{ fontFamily: "var(--font-jetbrains)" }}
    >
      {/* ── Top nav ── */}
      <header className="h-14 shrink-0 bg-white border-b border-gray-200 flex items-center px-4 gap-4 z-20">
        {/* Hamburger (mobile) */}
        <button
          className="lg:hidden text-gray-500 hover:text-gray-800 cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
          <ShieldLogo size={5} />
          <span className="font-bold text-base text-gray-900 hidden sm:block">Octochord</span>
        </Link>

        {/* Tab nav */}
        <nav className="flex items-center gap-1 flex-1 justify-center overflow-x-auto">
          {(["monitores", "alertas", "equipe"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-sm font-medium capitalize transition-colors whitespace-nowrap cursor-pointer
                ${activeTab === tab
                  ? "text-brand border-b-2 border-brand"
                  : "text-gray-500 hover:text-gray-800"
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-400 bg-gray-50 w-44">
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs">Procurar monitor...</span>
          </div>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer">
            <Bell className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden shrink-0 cursor-pointer"
          >
            <div className="w-full h-full bg-gradient-to-br from-brand to-teal-400 flex items-center justify-center text-white text-xs font-bold">
              U
            </div>
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — desktop always visible */}
        <div className="hidden lg:flex h-[calc(100vh-3.5rem)] sticky top-14">
          <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
        </div>

        {/* Sidebar — mobile overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-30 flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <div className="relative z-10 h-full">
              <Sidebar
                activeNav={activeNav}
                setActiveNav={(n) => { setActiveNav(n); setSidebarOpen(false); }}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto flex flex-col min-w-0">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col gap-6">

            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Status das APIs</h1>
                <p className="text-sm text-gray-500 mt-1">Monitoramento em tempo real de seus serviços críticos.</p>
              </div>
              <button
                onClick={handleAddMonitor}
                className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Plus className="w-4 h-4" />
                Adicionar Novo Monitor
              </button>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard label="Total de APIs" value="42" sub="Ativos em 4 regiões" />
              <StatCard label="Status UP"     value="39" valueColor="text-green-600" sub="92.8% de disponibilidade" />
              <StatCard label="Status DOWN"   value="2"  valueColor="text-red-500"   sub="Incidente ativo em: API-Auth" />
              <StatCard label="Latência Média" value="124ms" sub="↓ 12ms vs ontem" />
            </div>

            {/* Monitors table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {/* Table header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-sm text-gray-900">Monitores Ativos</h2>
                <div className="flex items-center gap-2 text-gray-400">
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      {["URL / Serviço", "Status", "Última Checagem", "Intervalo", "Uptime", "Histórico"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MONITORS.map((m, i) => (
                      <tr
                        key={m.id}
                        className={`border-b border-gray-100 hover:bg-gray-50/70 transition-colors ${i === MONITORS.length - 1 ? "border-b-0" : ""}`}
                      >
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-gray-900 text-xs">{m.url}</p>
                          <p className="text-[10px] tracking-widest text-gray-400 uppercase mt-0.5">{m.service}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={m.status} />
                        </td>
                        <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{m.lastCheck}</td>
                        <td className="px-5 py-3.5 text-gray-600">{m.interval}</td>
                        <td className={`px-5 py-3.5 font-semibold ${UPTIME_COLOR[m.uptime] ?? "text-gray-700"}`}>
                          {m.uptime}
                        </td>
                        <td className="px-5 py-3.5">
                          <Sparkline type={m.sparkline} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-t border-gray-100">
                <span className="text-xs text-gray-400">Exibindo 1-4 de 42 monitores</span>
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-gray-600">
                    Anterior
                  </button>
                  <button className="px-4 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-gray-900 bg-white shadow-sm">
                    Próximo
                  </button>
                </div>
              </div>
            </div>

            {/* Branch badge */}
            <div className="inline-flex items-center gap-2 self-start bg-gray-900 text-gray-300 text-xs px-3.5 py-2 rounded-xl">
              <GitBranch className="w-3.5 h-3.5 text-brand" />
              <span className="text-gray-400">branch:</span>
              <span className="text-white font-semibold">main</span>
              <span className="text-gray-500 ml-1">commit:</span>
              <span className="text-brand">#8f2a1b</span>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-gray-200 bg-white px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-gray-400">
            <span>© 2024 Octochord Monitoring. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-gray-700 transition-colors">Support</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Legal</a>
              <a href="#" className="hover:text-gray-700 font-semibold underline transition-colors">API Status</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, valueColor = "text-gray-900" }: {
  label: string;
  value: string;
  sub: string;
  valueColor?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 px-5 py-4 flex flex-col gap-1">
      <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">{label}</p>
      <p className={`text-3xl font-bold leading-none ${valueColor}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{sub}</p>
    </div>
  );
}
