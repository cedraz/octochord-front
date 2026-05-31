import type { ReactNode } from "react";
import { Link } from "react-router";

interface Props {
  children: ReactNode;
  /** Links de Termos / Privacidade no canto superior direito */
  topNav?: boolean;
  /** Badge "Todos os sistemas operacionais" abaixo do card */
  statusBadge?: boolean;
}

export function AuthLayout({ children, topNav = false }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "var(--font-jetbrains)", background: "var(--auth-gradient)" }}
    >
      {/* Top-right nav (opcional) */}
      {topNav && (
        <nav className="absolute top-0 right-0 p-5 flex items-center gap-6 text-xs text-gray-500 z-10">
          <a href="#" className="hover:text-gray-800 transition-colors">Termos de Uso</a>
          <a href="#" className="hover:text-gray-800 transition-colors">Privacidade</a>
          <a href="#" className="hover:text-gray-800 transition-colors">Status do API</a>
        </nav>
      )}

      {/* Conteúdo central */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 gap-6">
        {/* Logo */}
        <Link to="/login" className="flex items-center gap-3 select-none">
          <img src="/logo.png" alt="Octocord" className="h-12 w-auto" />
          <span className="text-4xl font-bold text-brand tracking-tight">Octocord</span>
        </Link>

        {/* Card */}
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 border-t border-gray-200 bg-white/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
        <span>© 2024 Octocord. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-gray-600 transition-colors">Support</a>
          <a href="#" className="hover:text-gray-600 transition-colors">Legal</a>
          <a href="#" className="hover:text-gray-600 transition-colors">API Status</a>
        </div>
      </footer>
    </div>
  );
}
