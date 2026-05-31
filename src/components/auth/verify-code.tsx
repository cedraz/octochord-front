import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { AuthLayout } from "./AuthLayout";
import { resendCode, verifyCode } from "@/services/authService";

export function VerifyCode() {
  const { state }     = useLocation();
  const navigate      = useNavigate();
  const email: string = state?.email ?? "";

  const [code, setCode]           = useState("");
  const [loading, setLoading]     = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length < 6) return;

    setLoading(true);
    try {
      await verifyCode({ identifier: email, code });

      toast.success("E-mail verificado! Faça login para continuar.");
      navigate("/login");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err?.message ?? "";
      if (msg.includes("400") || msg.includes("422")) {
        toast.error("Código inválido ou expirado. Verifique e tente novamente.");
      } else {
        toast.error("Erro ao verificar código. Tente novamente.");
      }
      console.error("VerifyCode error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email) {
      toast.error("Nenhum e-mail encontrado. Volte e tente novamente.");
      return;
    }
    setResending(true);
    try {
      await resendCode(email);
      setCode("");
      toast.success("Novo código enviado para " + email);
    } catch {
      toast.error("Erro ao reenviar o código. Tente novamente.");
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center gap-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">
            Digite o código para continuar
          </h2>
          <p className="text-sm text-gray-500 mt-3 leading-relaxed max-w-xs mx-auto">
            Código de 6 dígitos enviado para o e-mail cadastrado.
            Insira a chave para continuar.
          </p>
          {email && (
            <p className="text-xs text-brand mt-1 font-medium">{email}</p>
          )}
        </div>

        {/* OTP + submit */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-6">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            value={code}
            onChange={setCode}
          >
            <InputOTPGroup className="gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="h-12 w-12 rounded-xl border text-base font-semibold
                    data-[active=true]:border-brand data-[active=true]:ring-brand/20"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <button
            type="submit"
            disabled={loading || code.length < 6}
            className="w-full bg-btn-primary hover:bg-btn-primary-hover disabled:opacity-50
              text-white font-semibold text-sm py-3 rounded-xl transition-colors cursor-pointer"
          >
            {loading ? "Verificando..." : "Enviar"}
          </button>
        </form>

        {/* Reenvio */}
        <div className="w-full flex flex-col items-center gap-3">
          <div className="w-full h-px bg-gray-200" />
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            Não deu certo? Verifique o spam ou gere nova chave.
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-sm text-brand hover:text-brand-hover font-medium
              transition-colors cursor-pointer disabled:opacity-60"
          >
            {resending ? "Enviando..." : "Solicitar nova chave"}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
