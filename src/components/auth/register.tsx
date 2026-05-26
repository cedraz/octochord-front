import { useState } from "react";
import { Link } from "react-router";
import { User, Mail, Lock, Eye, EyeOff, Github, Shield } from "lucide-react";

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-brand" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z" />
    </svg>
  );
}

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // TODO: call register(name, email, password) from authService
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-page-bg font-jetbrains"
      style={{ fontFamily: "var(--font-jetbrains)" }}
    >
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Logo + header */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <ShieldIcon />
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Octochord</h1>
          <p className="text-sm text-gray-500 text-center max-w-xs">
            Configure sua conta de monitoramento de infraestrutura.
          </p>
        </div>

        {/* Card */}
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Full name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                Nome Completo
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-brand/30 focus-within:border-brand transition-colors">
                <User className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400 text-gray-900"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                E-mail Profissional
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-brand/30 focus-within:border-brand transition-colors">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="email"
                  placeholder="nome@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400 text-gray-900"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                Senha
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-brand/30 focus-within:border-brand transition-colors">
                <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400 text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Mínimo de 8 caracteres com letras e números.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand hover:bg-brand-hover disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 mt-1"
            >
              {isSubmitting ? "Criando conta..." : <>Criar minha conta →</>}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 tracking-widest font-medium">OU REGISTRE-SE COM</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* GitHub OAuth */}
          <button className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
            <Github className="w-4 h-4" />
            GitHub Accounts
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500 mt-5">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-brand hover:text-brand-hover font-medium transition-colors">
              Entre aqui
            </Link>
          </p>

          {/* Security badges */}
          <div className="flex items-center justify-center gap-4 mt-6 pt-5 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Shield className="w-3.5 h-3.5" />
              SSL SEGURO
            </div>
            <span className="text-gray-200">•</span>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Shield className="w-3.5 h-3.5" />
              SOC2 COMPLIANT
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 border-t border-gray-200 bg-white flex items-center justify-between text-xs text-gray-400">
        <span>© 2024 Octochord Monitoring. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-gray-600 transition-colors">Support</a>
          <a href="#" className="hover:text-gray-600 transition-colors">Legal</a>
          <a href="#" className="hover:text-gray-600 transition-colors">API Status</a>
        </div>
      </footer>
    </div>
  );
}
