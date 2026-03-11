export function formatDate(date) {
  const d = new Date(date);
  
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const anio = d.getFullYear();

  return `${dia}/${mes}/${anio}`;
}