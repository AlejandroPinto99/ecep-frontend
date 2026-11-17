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
