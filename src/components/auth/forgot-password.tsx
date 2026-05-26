import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowRight } from "lucide-react";

function ShieldIconDark() {
  return (
    <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z" />
      </svg>
    </div>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // TODO: call forgotPassword({ email }) from authService
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col font-jetbrains relative overflow-hidden"
      style={{
        fontFamily: "var(--font-jetbrains)",
        background:
          "radial-gradient(ellipse 80% 60% at 80% 20%, oklch(0.88 0.08 170 / 0.35) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 20% 90%, oklch(0.88 0.07 200 / 0.25) 0%, transparent 55%), #F5F8FB",
      }}
    >
      {/* Top-right nav */}
      <header className="absolute top-0 right-0 p-5 flex items-center gap-5 text-xs text-gray-500">
        <a href="#" className="hover:text-gray-800 transition-colors">Termos de Uso</a>
        <a href="#" className="hover:text-gray-800 transition-colors">Privacidade</a>
        <a href="#" className="hover:text-gray-800 transition-colors">Status do API</a>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col justify-center px-8 md:px-24 lg:px-40 py-24">
        {/* Horizontal logo */}
        <div className="flex items-center gap-3 mb-10">
          <ShieldIconDark />
          <span className="text-xl font-bold text-gray-900 tracking-tight">Octochord</span>
        </div>

        {/* Title + subtitle */}
        <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
          Esqueceu sua senha?
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-8">
          Não se preocupe, acontece com os melhores.
          <br />
          Insira seu e-mail abaixo para receber as
          <br />
          instruções de recuperação.
        </p>

        {/* Card */}
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                Endereço de E-mail
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-brand/30 focus-within:border-brand transition-colors">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="email"
                  placeholder="exemplo@octochord.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400 text-gray-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand hover:bg-brand-hover disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl transition-colors cursor-pointer flex items-center justify-between px-5"
            >
              <span>{isSubmitting ? "Enviando..." : "Enviar link de recuperação"}</span>
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* Links */}
        <div className="flex flex-col items-start gap-3 mt-6">
          <Link
            to="/login"
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            ← Voltar para o login
          </Link>
          <p className="text-sm text-gray-500">
            Ainda está com problemas?{" "}
            <a href="#" className="text-brand hover:text-brand-hover font-medium transition-colors">
              Fale com o suporte técnico
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
