import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Eye, EyeOff, Pencil, User, Loader2 } from "lucide-react";
import { useSidebar } from "../../contexts/SidebarContext";
import { getUserProfile, updateProfile, uploadAvatar, changePassword, type UserProfile } from "../../services/authService";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[11px] font-semibold tracking-widest text-gray-500 uppercase">{children}</label>;
}

function TextInput({ value, onChange, placeholder, readOnly }: { value: string; onChange?: (v: string) => void; placeholder?: string; readOnly?: boolean }) {
  return (
    <input value={value} readOnly={readOnly} placeholder={placeholder}
      onChange={e => onChange?.(e.target.value)}
      className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand transition-all placeholder:text-gray-300 w-full bg-white disabled:bg-gray-50"/>
  );
}

export default function UserProfile() {
  const navigate = useNavigate();
  const { setOpen: _setOpen } = useSidebar();

  const [profile,    setProfile]    = useState<UserProfile | null>(null);
  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [loading,    setLoading]    = useState(true);
  const [curPw,      setCurPw]      = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [showCurPw,  setShowCurPw]  = useState(false);
  const [showNewPw,  setShowNewPw]  = useState(false);
  const [savingPro,      setSavingPro]      = useState(false);
  const [savingPw,       setSavingPw]       = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getUserProfile()
      .then(p => {
        setProfile(p);
        setName(p.name ?? "");
        setEmail(p.email ?? "");
      })
      .catch(() => toast.error("Erro ao carregar perfil."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingPro(true);
    try {
      const updated = await updateProfile({ name });
      setProfile(updated);
      setName(updated.name ?? "");
      toast.success("Perfil atualizado!");
    } catch {
      toast.error("Erro ao salvar perfil.");
    } finally {
      setSavingPro(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Formato inválido. Use JPG, PNG ou WebP.");
      return;
    }

    setUploadingAvatar(true);
    try {
      const updated = await uploadAvatar(file);
      setProfile(updated);
      toast.success("Avatar atualizado!");
    } catch {
      toast.error("Erro ao enviar o avatar.");
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  }

  async function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!curPw)              { toast.error("Informe a senha atual."); return; }
    if (newPw !== confirmPw) { toast.error("As senhas não coincidem."); return; }
    if (newPw.length < 8)    { toast.error("Senha deve ter pelo menos 8 caracteres."); return; }
    setSavingPw(true);
    try {
      await changePassword({ oldPassword: curPw, newPassword: newPw });
      toast.success("Senha alterada com sucesso!");
      setCurPw(""); setNewPw(""); setConfirmPw("");
    } catch {
      toast.error("Senha atual incorreta.");
    } finally {
      setSavingPw(false);
    }
  }

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join("");

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-800 transition-colors cursor-pointer self-start">← Voltar</button>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-sm text-gray-400">Carregando perfil...</div>
        ) : (
          <>
            {/* Profile header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand to-teal-400 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                    {uploadingAvatar ? (
                      <Loader2 className="w-7 h-7 text-white animate-spin"/>
                    ) : profile?.image ? (
                      <img src={profile.image} alt={name} className="w-full h-full object-cover"/>
                    ) : initials ? (
                      <span className="text-2xl font-bold text-white">{initials}</span>
                    ) : (
                      <User className="w-10 h-10 text-white"/>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand rounded-full flex items-center justify-center cursor-pointer shadow disabled:opacity-50"
                  >
                    <Pencil className="w-3 h-3 text-white"/>
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{name || "—"}</h1>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                    <span className="text-gray-400">✉</span> {email}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Profile form */}
              <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-5">
                <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                  <User className="w-4 h-4 text-brand"/>
                  <h2 className="text-[11px] font-semibold tracking-widest text-gray-700 uppercase">Informações de Perfil</h2>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel>Nome</FieldLabel>
                    <TextInput value={name} onChange={setName}/>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <FieldLabel>E-mail</FieldLabel>
                    <TextInput value={email} readOnly/>
                  </div>
                </div>

                <div className="h-px border-t border-dashed border-gray-200"/>
                <div className="flex items-center justify-end gap-3">
                  <button type="button" onClick={() => navigate(-1)}
                    className="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer uppercase tracking-wide">
                    Cancelar
                  </button>
                  <button type="submit" disabled={savingPro || name === (profile?.name ?? "")}
                    className="px-5 py-2.5 text-xs font-semibold bg-brand hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl transition-colors cursor-pointer uppercase tracking-wide">
                    {savingPro ? "Salvando..." : "Aplicar Mudanças"}
                  </button>
                </div>
              </form>

              {/* Password form */}
              <form onSubmit={handleSavePassword} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                  <span className="text-brand">🔒</span>
                  <h2 className="text-[11px] font-semibold tracking-widest text-gray-700 uppercase">Alterar Senha</h2>
                </div>

                {[
                  { label: "Senha Atual",         value: curPw,     set: setCurPw,     placeholder: "••••••••",               show: showCurPw, toggle: () => setShowCurPw(s => !s) },
                  { label: "Nova Senha",           value: newPw,     set: setNewPw,     placeholder: "Digite sua nova senha",   show: showNewPw, toggle: () => setShowNewPw(s => !s) },
                  { label: "Confirmar Nova Senha", value: confirmPw, set: setConfirmPw, placeholder: "Confirme sua nova senha", show: showNewPw, toggle: () => setShowNewPw(s => !s) },
                ].map(({ label, value, set, placeholder, show, toggle }) => (
                  <div key={label} className="flex flex-col gap-1.5">
                    <FieldLabel>{label}</FieldLabel>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-brand/25 focus-within:border-brand transition-all">
                      <input
                        type={show ? "text" : "password"}
                        value={value}
                        onChange={e => set(e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-300"
                      />
                      <button type="button" onClick={toggle} className="text-gray-400 hover:text-gray-600 cursor-pointer shrink-0">
                        {show ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                      </button>
                    </div>
                  </div>
                ))}

                <button type="submit" disabled={savingPw}
                  className="w-full py-2.5 border border-gray-200 hover:bg-gray-50 disabled:opacity-60 text-sm font-semibold text-gray-700 rounded-xl transition-colors cursor-pointer uppercase tracking-wide mt-1">
                  {savingPw ? "Atualizando..." : "Atualizar"}
                </button>
              </form>
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-gray-200 bg-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
        <span>© 2024 Octocord Monitoring. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-700 transition-colors">Support</a>
          <a href="#" className="hover:text-gray-700 transition-colors">Legal</a>
          <a href="#" className="hover:text-gray-700 transition-colors">API Status</a>
        </div>
      </footer>
    </div>
  );
}
