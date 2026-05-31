/** Converte ISO date string para texto relativo em pt-BR */
export function timeAgo(isoDate: string): string {
  const diff    = Date.now() - new Date(isoDate).getTime();
  const seconds = Math.floor(diff / 1000);

  if (seconds < 30)  return "Agora mesmo";
  if (seconds < 90)  return "1 min atrás";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)  return `${minutes} min atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)    return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  return `${days}d atrás`;
}

/** Formata segundos em string legível: 60→"60s", 900→"15min", 3600→"1h" */
export function formatInterval(seconds: number): string {
  if (seconds < 60)   return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}min`;
  return `${(seconds / 3600).toFixed(0)}h`;
}
