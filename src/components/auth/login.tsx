import { useState } from "react";
import { Link } from "react-router";
import { Mail, Lock, Github } from "lucide-react";
import { login } from "@/services/authService";

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-brand" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.01.043.027.056a19.899 19.899 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ email, password });
    }
    catch(e) {
      console.error("Login failed", e);
      alert("Falha ao fazer login. Verifique suas credenciais e tente novamente.");
    }
    finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-page-bg font-jetbrains"
      style={{ fontFamily: "var(--font-jetbrains)" }}
    >
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Logo + header */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <ShieldIcon />
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Octochord</h1>
          <p className="text-sm text-gray-500">Infraestrutura crítica sob vigilância constante.</p>
        </div>

        {/* Card */}
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Acessar sua conta</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                E-mail Corporativo
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-brand/30 focus-within:border-brand transition-colors">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="email"
                  placeholder="nome@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400 text-gray-900"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Senha</label>
                <Link to="/forgot-password" className="text-sm text-brand hover:text-brand-hover transition-colors">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-brand/30 focus-within:border-brand transition-colors">
                <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400 text-gray-900"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand hover:bg-brand-hover disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 mt-1"
            >
              {isSubmitting ? "Criando conta..." : <>Login</>}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 tracking-widest font-medium">OU CONTINUE COM</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* OAuth buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
              <Github className="w-4 h-4" />
              GitHub
            </button>
            <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
              <DiscordIcon />
              Discord
            </button>
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Não tem uma conta?{" "}
            <Link to="/register" className="text-brand hover:text-brand-hover font-medium transition-colors">
              Cadastre-se
            </Link>
          </p>
        </div>

        {/* Status badge */}
        <div className="mt-6 flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs text-gray-600 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          Todos os sistemas operacionais
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 border-t border-gray-200 bg-white flex items-center justify-between text-xs text-gray-400">
        <span>© 2024 Octochord. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-gray-600 transition-colors">Support</a>
          <a href="#" className="hover:text-gray-600 transition-colors">Legal</a>
          <a href="#" className="hover:text-gray-600 transition-colors">API Status</a>
        </div>
      </footer>
    </div>
  );
}
