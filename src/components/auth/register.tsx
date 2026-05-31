import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { register } from "@/services/authService";

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

export function Register() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ name, email, password });
      navigate("/verify-email", { state: { email } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout statusBadge>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Registre-se</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Nome Completo</FieldLabel>
          <InputWrapper>
            <User className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-300 text-gray-900"
            />
          </InputWrapper>
        </div>

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
              minLength={8}
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-300 text-gray-900"
            />
            <button type="button" tabIndex={-1} onClick={() => setShowPw((v) => !v)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </InputWrapper>
          <p className="text-xs text-gray-400">Mínimo de 8 caracteres com letras e números.</p>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-btn-primary hover:bg-btn-primary-hover disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl transition-colors cursor-pointer mt-1">
          {loading ? "Criando conta..." : "Criar minha conta"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-5">
        Já tem uma conta?{" "}
        <Link to="/login" className="text-brand hover:text-brand-hover font-medium transition-colors">
          Entre aqui
        </Link>
      </p>
    </AuthLayout>
  );
}
