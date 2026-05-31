import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { login } from "@/services/authService";
import { AuthLayout } from "./AuthLayout";

// ── Shared primitives ─────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
      {children}
    </span>
  );
}

function InputWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-3.5 py-2.5 bg-white focus-within:ring-2 focus-within:ring-brand/25 focus-within:border-brand transition-all">
      {children}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const tokens = await login({ email, password });

      if (!tokens?.accessToken) {
        console.error("Resposta da API sem accessToken:", tokens);
        toast.error("Resposta inválida do servidor. Contate o suporte.");
        return;
      }

      Cookies.set("accessToken",  tokens.accessToken,  { expires: 7 });
      Cookies.set("refreshToken", tokens.refreshToken, { expires: 30 });

      navigate("/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err?.message ?? "";
      if (msg.includes("401") || msg.includes("403")) {
        toast.error("Email ou senha incorretos.");
      } else {
        toast.error("Erro ao fazer login. Tente novamente.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout statusBadge>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Acessar sua conta</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <FieldLabel>E-mail Profissional</FieldLabel>
          <InputWrapper>
            <Mail className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="email"
              placeholder="nome@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-300 text-gray-900"
            />
          </InputWrapper>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Senha</FieldLabel>
          <InputWrapper>
            <Lock className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-300 text-gray-900"
            />
            <button type="button" tabIndex={-1} onClick={() => setShowPw((v) => !v)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </InputWrapper>
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs text-brand hover:text-brand-hover transition-colors">
              Esqueceu sua senha?
            </Link>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading}
          className="w-full bg-btn-primary hover:bg-btn-primary-hover disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl transition-colors cursor-pointer mt-1">
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {/* Divider */}
      {/* <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-[11px] tracking-widest text-gray-400 font-medium">OU CONTINUE COM</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div> */}

      {/* GitHub */}
      {/* <button className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
        <Github className="w-4 h-4" />
        GitHub
      </button> */}

      {/* Register link */}
      <p className="text-center text-sm text-gray-500 mt-5">
        Não tem uma conta?{" "}
        <Link to="/register" className="text-brand hover:text-brand-hover font-medium transition-colors">
          Crie aqui
        </Link>
      </p>
    </AuthLayout>
  );
}
