export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    month: "short",
    day: "numeric",
  }).format(date);
}
