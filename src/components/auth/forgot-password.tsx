import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowRight } from "lucide-react";
import { AuthLayout } from "./AuthLayout";

export function ForgotPassword() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: await forgotPassword({ email });
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout topNav>
      {sent ? (
        /* ── Feedback pós-envio ── */
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-600 text-xl">✓</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">E-mail enviado!</h2>
          <p className="text-sm text-gray-500">
            Verifique a caixa de entrada de <span className="font-medium text-gray-700">{email}</span> e
            siga as instruções para redefinir sua senha.
          </p>
          <Link to="/login"
            className="mt-2 text-sm text-brand hover:text-brand-hover font-medium transition-colors">
            ← Voltar para o login
          </Link>
        </div>
      ) : (
        /* ── Formulário ── */
        <>
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Esqueceu sua senha?</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Não se preocupe, acontece com os melhores.{" "}
              Insira seu e-mail abaixo para receber as instruções de recuperação.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                Digite seu e-mail
              </span>
              <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-3.5 py-2.5 bg-white focus-within:ring-2 focus-within:ring-brand/25 focus-within:border-brand transition-all">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="email"
                  placeholder="nome@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-300 text-gray-900"
                />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-btn-primary hover:bg-btn-primary-hover disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2">
              {loading ? "Enviando..." : (
                <> Enviar link de recuperação <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="flex flex-col items-center gap-3 mt-6">
            <Link to="/login"
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
              ← Voltar para o login
            </Link>
            <div className="w-12 h-px bg-gray-200" />
            <p className="text-sm text-gray-500 text-center">
              Ainda está com problemas?{" "}
              <a href="#" className="text-brand hover:text-brand-hover font-medium transition-colors">
                Fale com o suporte técnico
              </a>
            </p>
          </div>
        </>
      )}
    </AuthLayout>
  );
}
