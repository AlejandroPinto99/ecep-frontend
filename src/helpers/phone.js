// Teléfonos de El Salvador: 8 dígitos, mostrados como "7768-6881".
// En la base de datos se guardan solo los dígitos ("77686881").

export const soloDigitos = (valor) => String(valor ?? "").replace(/\D/g, "").slice(0, 8);

// Formato mientras se escribe: limita a 8 dígitos y agrega el guion después del 4.º
export const formatTelefono = (valor) => {
  const d = soloDigitos(valor);
  return d.length > 4 ? `${d.slice(0, 4)}-${d.slice(4)}` : d;
};

// Para mostrar un número guardado: si no tiene exactamente 8 dígitos (registros
// antiguos), se muestra tal cual en lugar de recortarlo.
export const mostrarTelefono = (valor) =>
  /^\d{8}$/.test(String(valor ?? "")) ? formatTelefono(valor) : valor;

export const PATRON_TELEFONO = "\\d{4}-\\d{4}";
