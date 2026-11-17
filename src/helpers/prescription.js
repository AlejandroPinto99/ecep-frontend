import { jsPDF } from "jspdf";

import { formatDate } from "./date";
import { formatEdad } from "./age";

// Receta médica en PDF a partir del detalle de una consulta.
// Hoja A5 horizontal (210 × 148 mm), siempre en una sola página: si el texto no
// cabe, se reduce el tamaño de la letra.

const CLINICA = "Clínica Pediátrica Soyapango";
const DOCTORA = "Dra. Margarita Aracely Santos de Pinto";
const HORARIO =
  "Horario de atención: lunes a viernes de 9:30 a.m. a 12:00 p.m. · sábados de 9:00 a.m. a 12:00 p.m.";
const TELEFONO = "Tel.: 2227 4657 · WhatsApp: 7768 6881";

// Logo de la esquina superior derecha (public/images/image.png, 739 × 572 px).
// Se precarga al importar el módulo para que ya esté listo al hacer clic.
const LOGO = { alto: 20, y: 4, proporcion: 739 / 572 };
const cargarLogo = () =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); // sin logo, la receta se genera igual
    img.src = `${process.env.PUBLIC_URL}/images/image.png`;
  });
let logo = null;
const logoPromesa = cargarLogo().then((img) => (logo = img));

const PAGINA = { ancho: 210, alto: 148 }; // mm, A5 horizontal
const MARGEN = 12;
const ANCHO_UTIL = PAGINA.ancho - MARGEN * 2;
const ESPACIO_SELLO = 36; // reservado al pie de la última página para firma y sello
const VERDE = [63, 175, 125]; // klintoRed (#3FAF7D)
const GRIS = [90, 90, 90];
const NEGRO = [20, 20, 20];

const LB_A_KG = 0.45359237;
const VACIO = "No registrado";

const formato = (n, d = 1) => n.toLocaleString("es-SV", { maximumFractionDigits: d });

// Edad exacta a la fecha de la consulta: "2 años y 3 meses", "5 meses 12 días", "8 días"
export const edadEnConsulta = (fechaNacimiento, fechaConsulta, edadMesesRespaldo) => {
  if (!fechaNacimiento) return formatEdad(edadMesesRespaldo) ?? VACIO;
  const nac = new Date(fechaNacimiento);
  const ref = fechaConsulta ? new Date(fechaConsulta) : new Date();

  let meses = (ref.getFullYear() - nac.getFullYear()) * 12 + (ref.getMonth() - nac.getMonth());
  let dias = ref.getDate() - nac.getDate();
  if (dias < 0) {
    meses -= 1;
    dias += new Date(ref.getFullYear(), ref.getMonth(), 0).getDate(); // días del mes anterior
  }
  if (meses < 0) return VACIO;

  const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

  // A partir de 13 meses: años y meses ("1 año y 1 mes"); 12 meses cumplidos se
  // muestran como "12 meses", con los días si los hay.
  if (meses > 12) return formatEdad(meses);
  if (meses > 0) {
    return dias ? `${plural(meses, "mes", "meses")} ${plural(dias, "día", "días")}` : plural(meses, "mes", "meses");
  }
  return plural(dias, "día", "días");
};

const textoSexo = (sexo) => (sexo === "M" ? "Masculino" : sexo === "F" ? "Femenino" : VACIO);

const textoPeso = (lb) =>
  lb === null || lb === undefined ? VACIO : `${formato(lb, 2)} lb (${formato(lb * LB_A_KG, 2)} kg)`;

const textoTalla = (cm) => (cm === null || cm === undefined ? VACIO : `${formato(cm, 1)} cm`);

const encabezado = (doc, fecha) => {
  if (logo) {
    const ancho = LOGO.alto * LOGO.proporcion;
    doc.addImage(logo, "PNG", PAGINA.ancho - MARGEN - ancho, LOGO.y, ancho, LOGO.alto);
  }

  doc.setTextColor(...VERDE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(CLINICA, PAGINA.ancho / 2, 15, { align: "center" });

  doc.setTextColor(...NEGRO);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(DOCTORA, PAGINA.ancho / 2, 21, { align: "center" });

  doc.setFontSize(8.5);
  doc.setTextColor(...GRIS);
  doc.text(HORARIO, PAGINA.ancho / 2, 26, { align: "center" });

  doc.setDrawColor(...VERDE);
  doc.setLineWidth(0.6);
  doc.line(MARGEN, 29, PAGINA.ancho - MARGEN, 29);

  doc.setFontSize(9);
  doc.setTextColor(...GRIS);
  doc.text(`Fecha: ${fecha}`, PAGINA.ancho - MARGEN, 35, { align: "right" });
  return 35;
};

// "Etiqueta: valor" con la etiqueta en negrita. Con dibujar = false solo mide.
const campo = (doc, etiqueta, valor, x, y, ancho, tamano, dibujar) => {
  doc.setFontSize(tamano);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NEGRO);
  const label = `${etiqueta}: `;
  if (dibujar) doc.text(label, x, y);
  const anchoLabel = doc.getTextWidth(label);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRIS);
  const lineas = doc.splitTextToSize(valor, ancho - anchoLabel);
  if (dibujar) doc.text(lineas, x + anchoLabel, y);
  return lineas.length;
};

// Tamaños base (escala 1). Con mucho texto se reducen todos en la misma proporción.
const BASE = { dato: 10, titulo: 11, texto: 10, linea: 5, espacioTitulo: 6, espacioBloque: 5 };
const ESCALA_MINIMA = 0.4; // texto de 4 pt: por debajo deja de ser legible
const PASO_ESCALA = 0.025;

// Datos del paciente y tratamiento a partir de `y`.
// Devuelve la `y` donde termina, para poder medir antes de dibujar.
const cuerpo = (doc, consulta, yInicio, escala, dibujar) => {
  const { datos_consulta, examen_fisico, resultados } = consulta;
  const t = Object.fromEntries(Object.entries(BASE).map(([k, v]) => [k, v * escala]));
  let y = yInicio;

  // Nombre en la línea de la fecha, el resto en cuatro columnas
  const nLineasNombre = campo(
    doc, "Nombre", consulta.nombre_paciente || VACIO, MARGEN, y, ANCHO_UTIL - 40, t.dato, dibujar,
  );
  y += nLineasNombre * t.linea + 1.5 * escala;

  const col = ANCHO_UTIL / 4;
  const edad = edadEnConsulta(
    consulta.fecha_nacimiento_paciente,
    datos_consulta.fecha_consulta,
    examen_fisico.edad_meses,
  );
  const datos = [
    ["Edad", edad],
    ["Sexo", textoSexo(consulta.sexo_paciente)],
    ["Peso", textoPeso(examen_fisico.peso_lb)],
    ["Talla", textoTalla(examen_fisico.talla_cm)],
  ];
  const nLineasDatos = Math.max(
    ...datos.map(([etiqueta, valor], i) =>
      campo(doc, etiqueta, valor, MARGEN + col * i, y, col - 3, t.dato, dibujar),
    ),
  );
  y += (nLineasDatos - 1) * t.linea + 4 * escala;

  if (dibujar) {
    doc.setDrawColor(210, 210, 210);
    doc.setLineWidth(0.2);
    doc.line(MARGEN, y, PAGINA.ancho - MARGEN, y);
  }
  y += 6 * escala;

  const bloque = (titulo, texto) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(t.titulo);
    doc.setTextColor(...VERDE);
    if (dibujar) doc.text(titulo, MARGEN, y);
    y += t.espacioTitulo;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(t.texto);
    doc.setTextColor(...NEGRO);
    const lineas = doc.splitTextToSize(texto?.trim() ? texto.trim() : VACIO, ANCHO_UTIL);
    for (const linea of lineas) {
      if (dibujar) doc.text(linea, MARGEN, y);
      y += t.linea;
    }
    y += t.espacioBloque;
  };

  bloque("Tratamiento", resultados.tratamiento);

  // La última línea de texto queda en y - espacioBloque - linea; su parte baja,
  // aproximadamente un renglón más abajo.
  return y - t.espacioBloque - t.linea + t.texto * 0.35;
};

export const generarReceta = async (consulta) => {
  // Normalmente ya está cargado; si no, se espera (y si el navegador bloquea la
  // pestaña nueva por la espera, se descarga el PDF).
  if (!logo) await logoPromesa;

  const { datos_consulta } = consulta;
  const doc = new jsPDF({ unit: "mm", format: "a5", orientation: "landscape" });
  const fecha = formatDate(datos_consulta.fecha_consulta);

  const yInicio = encabezado(doc, fecha);

  // La receta siempre cabe en una sola hoja: se busca la escala más grande con
  // la que el texto termina antes del espacio reservado para firma y sello.
  const limite = PAGINA.alto - ESPACIO_SELLO;
  let escala = 1;
  while (escala > ESCALA_MINIMA && cuerpo(doc, consulta, yInicio, escala, false) > limite) {
    escala = Math.max(ESCALA_MINIMA, Math.round((escala - PASO_ESCALA) * 1000) / 1000);
  }
  cuerpo(doc, consulta, yInicio, escala, true);

  // Esquina inferior derecha, donde se suele poner el sello
  const yFirma = PAGINA.alto - MARGEN - 2;
  const anchoFirma = 65;
  const xFirma = PAGINA.ancho - MARGEN - anchoFirma;
  doc.setDrawColor(...GRIS);
  doc.setLineWidth(0.3);
  doc.line(xFirma, yFirma, xFirma + anchoFirma, yFirma);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GRIS);
  doc.text("Firma y sello", xFirma + anchoFirma / 2, yFirma + 4, { align: "center" });

  // Pie de página: teléfono de contacto, a la altura de "Firma y sello"
  doc.setFontSize(9);
  doc.text(TELEFONO, MARGEN, yFirma + 4);

  const nombreArchivo = `receta-${(consulta.nombre_paciente || "paciente")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase()}-${fecha.replace(/\//g, "-")}.pdf`;
  doc.setProperties({ title: nombreArchivo.replace(/\.pdf$/, "") });

  // Se abre en una pestaña nueva para imprimir; si el navegador bloquea la
  // ventana emergente, se descarga.
  const ventana = window.open(doc.output("bloburl"), "_blank");
  if (!ventana) doc.save(nombreArchivo);
};
