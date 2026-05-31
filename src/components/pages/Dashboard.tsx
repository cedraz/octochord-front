import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, User, X, LogOut } from "lucide-react";
import Cookies from "js-cookie";
import { SidebarContext } from "../../contexts/SidebarContext";

// ── Nav items ─────────────────────────────────────────────────────────────────

const NAV = [
  { path: "/dashboard",              label: "Dashboard",      Icon: LayoutDashboard },
  // { path: "/dashboard/integrations", label: "Integrations",   Icon: Plug2           },
  // { path: "/dashboard/github",       label: "GitHub Commits", Icon: GitCommit       },
  { path: "/dashboard/profile",      label: "User Profile",   Icon: User            },
];

// ── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar({ onClose }: { onClose?: () => void }) {
  const { pathname } = useLocation();
  const navigate     = useNavigate();

  function handleLogout() {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    navigate("/login");
  }

  const active = (p: string) =>
    p === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(p);

  return (
    <aside className="w-56 flex flex-col bg-white border-r border-gray-200 h-full">
      {/* Brand */}
      <div className="px-5 pt-6 pb-4 border-b border-gray-100 flex items-start justify-between">
        <div>
          <p className="font-bold text-sm text-gray-900">Octocord</p>
          <p className="text-[10px] tracking-widest text-gray-400 uppercase mt-0.5 leading-tight">
            Monitoramento de<br />Infraestrutura
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-700 mt-0.5">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ path, label, Icon }) => (
          <button
            key={path}
            onClick={() => { navigate(path); onClose?.(); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium
              transition-colors cursor-pointer text-left
              ${active(path)
                ? "bg-brand/8 text-brand border-l-2 border-brand rounded-l-none pl-[10px]"
                : "text-gray-600 hover:bg-gray-100"}`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [open, setOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <div className="flex min-h-screen bg-gray-50" style={{ fontFamily: "var(--font-jetbrains)" }}>

        {/* Desktop sidebar */}
        <div className="hidden lg:flex flex-col sticky top-0 h-screen shrink-0">
          <Sidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {open && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <div className="relative z-10 h-full flex flex-col">
              <Sidebar onClose={() => setOpen(false)} />
            </div>
          </div>
        )}

        {/* Page content (top bar + content + footer are inside each sub-page) */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
