import { fechaLocalISO } from "./date";

// Formato de edades a partir de meses, para toda la app.

const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

// Hasta 12 meses se muestra en meses; a partir de 13, en años y meses:
// 5 -> "5 meses", 12 -> "12 meses", 13 -> "1 año y 1 mes", 30 -> "2 años y 6 meses", 48 -> "4 años".
// Acepta meses con decimales (curvas de crecimiento). Sin valor devuelve null.
export const formatEdad = (meses) => {
  if (meses === null || meses === undefined || meses === "") return null;
  const m = Number(meses);
  if (Number.isNaN(m)) return null;

  if (m <= 12) {
    const texto = m.toLocaleString("es-SV", { maximumFractionDigits: 1 });
    return `${texto} ${m === 1 ? "mes" : "meses"}`;
  }

  let anios = Math.floor(m / 12);
  let resto = Math.round(m - anios * 12);
  if (resto === 12) {
    anios += 1;
    resto = 0;
  }
  const textoAnios = plural(anios, "año", "años");
  return resto ? `${textoAnios} y ${plural(resto, "mes", "meses")}` : textoAnios;
};

// Meses cumplidos entre dos fechas (mismo criterio que TIMESTAMPDIFF(MONTH) en
// la API). Acepta "YYYY-MM-DD" o fechas completas de la API; se comparan como
// día local para que la zona horaria no corra la fecha. Sin fechas devuelve null.
export const edadEnMeses = (fechaNacimiento, fechaReferencia) => {
  if (!fechaNacimiento || !fechaReferencia) return null;
  const [y1, m1, d1] = fechaLocalISO(fechaNacimiento).split("-").map(Number);
  const [y2, m2, d2] = fechaLocalISO(fechaReferencia).split("-").map(Number);
  if ([y1, m1, d1, y2, m2, d2].some(Number.isNaN)) return null;
  let meses = (y2 - y1) * 12 + (m2 - m1);
  if (d2 < d1) meses -= 1;
  return Math.max(meses, 0);
};

// Edades del esquema de vacunación: igual que formatEdad, pero 0 -> "Al nacer".
export const formatAgeMonths = (months) => (months === 0 ? "Al nacer" : formatEdad(months));

// Rango recomendado: "2 meses", "6–12 meses", "4–6 años", "6 meses – 1 año y 6 meses", "Desde 6 meses"
export const formatAgeRange = (from, to) => {
  if (to === null || to === undefined) return `Desde ${formatAgeMonths(from).toLowerCase()}`;
  if (from === to) return formatAgeMonths(from);
  if (to <= 12) {
    if (from === 0) return `Al nacer – ${formatAgeMonths(to)}`;
    return `${from}–${to} meses`;
  }
  if (from > 12 && from % 12 === 0 && to % 12 === 0) return `${from / 12}–${to / 12} años`;
  return `${formatAgeMonths(from)} – ${formatAgeMonths(to)}`;
};
