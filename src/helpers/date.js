export function formatDate(date) {
  const d = new Date(date);
  
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const anio = d.getFullYear();

  return `${dia}/${mes}/${anio}`;
}
// Fecha local (no UTC) como YYYY-MM-DD, el formato de <input type="date">.
// Un texto que ya es "YYYY-MM-DD" se devuelve tal cual: new Date() lo leería
// como medianoche UTC y en El Salvador quedaría en el día anterior.
export function fechaLocalISO(date = new Date()) {
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const d = new Date(date);
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}
