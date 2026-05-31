import { useState } from "react";
import { toast } from "sonner";

// ── Toggle ────────────────────────────────────────────────────────────────────

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer shrink-0 ${checked ? "bg-brand" : "bg-gray-200"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`}/>
    </button>
  );
}

// ── EmailListInput ─────────────────────────────────────────────────────────────

const EMAIL_MAX = 5;

export function EmailListInput({ emails, onChange }: { emails: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");

  function add() {
    const email = draft.trim().toLowerCase();
    if (!email) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("E-mail inválido."); return; }
    if (emails.includes(email))     { toast.error("E-mail já adicionado."); return; }
    if (emails.length >= EMAIL_MAX) { toast.error(`Máximo de ${EMAIL_MAX} e-mails.`); return; }
    onChange([...emails, email]);
    setDraft("");
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="email"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="novo@email.com"
          disabled={emails.length >= EMAIL_MAX}
          className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand transition-all placeholder:text-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={add}
          disabled={!draft.trim() || emails.length >= EMAIL_MAX}
          className="px-3.5 py-2 bg-brand hover:bg-brand-hover disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-base font-bold cursor-pointer transition-colors leading-none"
        >+</button>
      </div>

      {emails.length > 0 && (
        <ul className="flex flex-col gap-1">
          {emails.map(email => (
            <li key={email} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5">
              <span className="text-xs text-gray-700">{email}</span>
              <button
                type="button"
                onClick={() => onChange(emails.filter(e => e !== email))}
                className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors w-5 h-5 flex items-center justify-center rounded hover:bg-red-50 text-sm ml-2"
              >✕</button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-[10px] text-gray-400">{emails.length}/{EMAIL_MAX} e-mails</p>
    </div>
  );
}
