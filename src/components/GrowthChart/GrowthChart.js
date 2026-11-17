import { useEffect, useRef, useState } from "react";

// Gráfico de una curva de crecimiento OMS: curvas de referencia (−3, −2, 0, +2, +3 DE)
// y el punto del paciente. SVG propio, sin librería de gráficos.
//
// Codificación (guía de visualización del proyecto):
//  - Las curvas son tinta neutra: se identifican por su etiqueta directa al final
//    (+3, +2, 0, −2, −3), no por color. La mediana es la más marcada.
//  - El rango normal (−2 a +2) es una franja suave de color "good".
//  - El paciente es la única marca de color (azul, slot 1), con aro de superficie.

export const COLORES = {
  superficie: "#ffffff",
  grid: "#e1e0d9",
  eje: "#c3c2b7",
  tenue: "#898781",
  secundario: "#52514e",
  primario: "#0b0b0b",
  franja: "rgba(12, 163, 12, 0.08)",
  paciente: "#2a78d6",
};

const ESTILO_CURVA = {
  3: { stroke: COLORES.secundario, width: 1.5 },
  2: { stroke: COLORES.tenue, width: 1.5 },
  0: { stroke: COLORES.primario, width: 2 },
  "-2": { stroke: COLORES.tenue, width: 1.5 },
  "-3": { stroke: COLORES.secundario, width: 1.5 },
};

export const etiquetaZ = (z) => (z === 0 ? "Mediana" : `${z > 0 ? "+" : "−"}${Math.abs(z)} DE`);
const etiquetaCorta = (z) => (z === 0 ? "0" : `${z > 0 ? "+" : "−"}${Math.abs(z)}`);

const MARGEN = { top: 16, right: 40, bottom: 52, left: 56 };
const ALTO_PLOT = 340;

// Valor de una curva en x por interpolación lineal (los puntos vienen ordenados)
export const interpolar = (puntos, x) => {
  if (x <= puntos[0][0]) return puntos[0][1];
  for (let i = 1; i < puntos.length; i++) {
    const [x1, y1] = puntos[i];
    if (x <= x1) {
      const [x0, y0] = puntos[i - 1];
      return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
    }
  }
  return puntos[puntos.length - 1][1];
};

// Marcas "redondas" del eje Y (paso 1, 2, 2.5 o 5 × 10^k)
const marcasY = (min, max, cantidad = 6) => {
  const bruto = (max - min) / cantidad;
  const pot = Math.pow(10, Math.floor(Math.log10(bruto)));
  const paso = [1, 2, 2.5, 5, 10].map((f) => f * pot).find((p) => p >= bruto);
  // De la marca redonda por debajo del mínimo a la marca por encima del máximo,
  // para que el eje empiece y termine en un valor etiquetado.
  const marcas = [];
  const fin = Math.ceil(max / paso - 1e-9) * paso;
  for (let v = Math.floor(min / paso + 1e-9) * paso; v <= fin + 1e-9; v += paso) {
    marcas.push(Math.round(v * 100) / 100);
  }
  return marcas;
};

const formato = (n, d = 1) => n.toLocaleString("es-SV", { maximumFractionDigits: d });

const useAncho = () => {
  const ref = useRef(null);
  const [ancho, setAncho] = useState(800);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new ResizeObserver(([entry]) => setAncho(entry.contentRect.width));
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, ancho];
};

export const GrowthChart = ({ grafico, dominioX, pasoX, formatoX = (x) => formato(x, 1) }) => {
  const [ref, ancho] = useAncho();
  const [hover, setHover] = useState(null); // { x } del cursor
  const [hoverPaciente, setHoverPaciente] = useState(false);

  const { curvas, paciente, eje_x, eje_y } = grafico;
  const plotAncho = Math.max(ancho - MARGEN.left - MARGEN.right, 100);
  const [x0, x1] = dominioX;

  // Dominio Y: el de las curvas ±3 en la ventana. Si el paciente queda poco
  // afuera se amplía; si queda muy lejos, se marca en el borde (para no aplastar
  // las curvas por un dato probablemente mal capturado).
  const curva = (z) => curvas.find((c) => c.z === z).puntos;
  const yCurvas = [...curva(-3), ...curva(3)].filter(([x]) => x >= x0 && x <= x1).map(([, y]) => y);
  let yMin = Math.min(...yCurvas);
  let yMax = Math.max(...yCurvas);
  const margenY = (yMax - yMin) * 0.2;
  let fueraDeEscala = null; // "arriba" | "abajo"
  if (paciente) {
    if (paciente.y > yMax + margenY) fueraDeEscala = "arriba";
    else if (paciente.y < yMin - margenY) fueraDeEscala = "abajo";
    else {
      yMin = Math.min(yMin, paciente.y);
      yMax = Math.max(yMax, paciente.y);
    }
  }
  const ticksY = marcasY(yMin, yMax);
  yMin = ticksY[0];
  yMax = ticksY[ticksY.length - 1];

  const sx = (x) => MARGEN.left + ((x - x0) / (x1 - x0)) * plotAncho;
  const sy = (y) => MARGEN.top + (1 - (y - yMin) / (yMax - yMin)) * ALTO_PLOT;
  const invX = (px) => x0 + ((px - MARGEN.left) / plotAncho) * (x1 - x0);

  const ticksX = [];
  for (let x = Math.ceil(x0 / pasoX) * pasoX; x <= x1 + 1e-9; x += pasoX) ticksX.push(x);

  const camino = (puntos) =>
    puntos
      .filter(([x]) => x >= x0 - 1e-9 && x <= x1 + 1e-9)
      .map(([x, y], i) => `${i ? "L" : "M"}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`)
      .join("");

  const franja = (() => {
    const bajo = curva(-2).filter(([x]) => x >= x0 && x <= x1);
    const alto = curva(2).filter(([x]) => x >= x0 && x <= x1).reverse();
    return [...bajo, ...alto].map(([x, y], i) => `${i ? "L" : "M"}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join("") + "Z";
  })();

  // Posición del marcador del paciente (en el borde si está fuera de escala)
  const pacientePx = paciente && {
    x: sx(paciente.x),
    y: fueraDeEscala === "arriba" ? MARGEN.top + 8 : fueraDeEscala === "abajo" ? MARGEN.top + ALTO_PLOT - 8 : sy(paciente.y),
  };

  const altoTotal = MARGEN.top + ALTO_PLOT + MARGEN.bottom;
  const hoverX = hover ? Math.min(Math.max(hover.x, x0), x1) : null;
  const tooltipIzquierda = hover && sx(hoverX) > MARGEN.left + plotAncho * 0.6;

  const onMove = (e) => {
    const rect = e.currentTarget.ownerSVGElement.getBoundingClientRect();
    setHover({ x: invX(e.clientX - rect.left) });
  };

  const resumenAria = paciente
    ? `${grafico.titulo}. Paciente: ${formatoX(paciente.x)} ${eje_x.unidad}, ${formato(paciente.y, 2)} ${eje_y.unidad}${grafico.z !== null ? `, puntaje z ${formato(grafico.z, 2)}` : ""}.`
    : `${grafico.titulo}. Sin medición del paciente.`;

  return (
    // min-w-0 + SVG al 100%: el gráfico nunca impone su ancho al contenedor (si no,
    // en pantallas angostas el contenedor flex no se encoge y se desborda).
    <div ref={ref} className="relative w-full min-w-0" style={{ height: altoTotal }}>
      <svg
        width="100%"
        height={altoTotal}
        viewBox={`0 0 ${ancho} ${altoTotal}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={resumenAria}
        className="block"
      >
        {/* Grid y ejes: líneas finas sólidas */}
        {ticksY.map((v) => (
          <g key={`y${v}`}>
            <line x1={MARGEN.left} x2={MARGEN.left + plotAncho} y1={sy(v)} y2={sy(v)} stroke={COLORES.grid} strokeWidth={1} />
            <text x={MARGEN.left - 8} y={sy(v)} dy="0.32em" textAnchor="end" fontSize={12} fill={COLORES.tenue} style={{ fontVariantNumeric: "tabular-nums" }}>
              {formato(v, 2)}
            </text>
          </g>
        ))}
        {ticksX.map((v) => (
          <g key={`x${v}`}>
            <line x1={sx(v)} x2={sx(v)} y1={MARGEN.top} y2={MARGEN.top + ALTO_PLOT} stroke={COLORES.grid} strokeWidth={1} />
            <text x={sx(v)} y={MARGEN.top + ALTO_PLOT + 18} textAnchor="middle" fontSize={12} fill={COLORES.tenue} style={{ fontVariantNumeric: "tabular-nums" }}>
              {formatoX(v)}
            </text>
          </g>
        ))}
        <line x1={MARGEN.left} x2={MARGEN.left + plotAncho} y1={MARGEN.top + ALTO_PLOT} y2={MARGEN.top + ALTO_PLOT} stroke={COLORES.eje} strokeWidth={1} />
        <text x={MARGEN.left + plotAncho / 2} y={altoTotal - 8} textAnchor="middle" fontSize={12} fill={COLORES.secundario}>
          {eje_x.etiqueta}
        </text>
        <text transform={`translate(14 ${MARGEN.top + ALTO_PLOT / 2}) rotate(-90)`} textAnchor="middle" fontSize={12} fill={COLORES.secundario}>
          {eje_y.etiqueta}
        </text>

        {/* Rango normal y curvas de referencia */}
        <path d={franja} fill={COLORES.franja} />
        {curvas.map((c) => (
          <path key={c.z} d={camino(c.puntos)} fill="none" stroke={ESTILO_CURVA[c.z].stroke} strokeWidth={ESTILO_CURVA[c.z].width} strokeLinejoin="round" />
        ))}
        {/* Etiquetas directas al final de cada curva */}
        {curvas.map((c) => {
          const yFin = interpolar(c.puntos, x1);
          return (
            <text key={`l${c.z}`} x={MARGEN.left + plotAncho + 6} y={sy(yFin)} dy="0.32em" fontSize={11} fill={COLORES.secundario} fontWeight={c.z === 0 ? 600 : 400}>
              {etiquetaCorta(c.z)}
            </text>
          );
        })}

        {/* Capa de hover: cruz + punto en cada curva */}
        <rect
          x={MARGEN.left}
          y={MARGEN.top}
          width={plotAncho}
          height={ALTO_PLOT}
          fill="transparent"
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        />
        {hover && !hoverPaciente && (
          <g pointerEvents="none">
            <line x1={sx(hoverX)} x2={sx(hoverX)} y1={MARGEN.top} y2={MARGEN.top + ALTO_PLOT} stroke={COLORES.eje} strokeWidth={1} />
            {curvas.map((c) => (
              <circle key={c.z} cx={sx(hoverX)} cy={sy(interpolar(c.puntos, hoverX))} r={3} fill={ESTILO_CURVA[c.z].stroke} stroke={COLORES.superficie} strokeWidth={1.5} />
            ))}
          </g>
        )}

        {/* Paciente */}
        {pacientePx && (
          <g
            tabIndex={0}
            role="button"
            aria-label={resumenAria}
            onMouseEnter={() => setHoverPaciente(true)}
            onMouseLeave={() => setHoverPaciente(false)}
            onFocus={() => setHoverPaciente(true)}
            onBlur={() => setHoverPaciente(false)}
            style={{ outline: "none", cursor: "default" }}
          >
            <circle cx={pacientePx.x} cy={pacientePx.y} r={14} fill="transparent" />
            {fueraDeEscala ? (
              <path
                d={
                  fueraDeEscala === "arriba"
                    ? `M${pacientePx.x},${pacientePx.y - 7} l7,12 l-14,0 Z`
                    : `M${pacientePx.x},${pacientePx.y + 7} l7,-12 l-14,0 Z`
                }
                fill={COLORES.paciente}
                stroke={COLORES.superficie}
                strokeWidth={2}
              />
            ) : (
              <circle cx={pacientePx.x} cy={pacientePx.y} r={6} fill={COLORES.paciente} stroke={COLORES.superficie} strokeWidth={2} />
            )}
            {hoverPaciente && (
              <circle cx={pacientePx.x} cy={pacientePx.y} r={10} fill="none" stroke={COLORES.paciente} strokeWidth={1.5} />
            )}
            {/* Etiqueta directa del paciente (la única marca etiquetada) */}
            <text
              x={pacientePx.x + (pacientePx.x > MARGEN.left + plotAncho - 120 ? -12 : 12)}
              y={pacientePx.y}
              dy="0.32em"
              textAnchor={pacientePx.x > MARGEN.left + plotAncho - 120 ? "end" : "start"}
              fontSize={12}
              fontWeight={600}
              fill={COLORES.primario}
              stroke={COLORES.superficie}
              strokeWidth={3}
              paintOrder="stroke"
            >
              {fueraDeEscala ? `Fuera de escala: ${formato(paciente.y, 1)} ${eje_y.unidad}` : `${formato(paciente.y, 1)} ${eje_y.unidad}`}
            </text>
          </g>
        )}
      </svg>

      {/* Tooltip: valores de las curvas en el x del cursor */}
      {hover && !hoverPaciente && (
        <div
          className="absolute pointer-events-none bg-white border border-gray-200 shadow-md rounded-lg px-3 py-2 text-xs"
          style={{
            top: MARGEN.top + 8,
            left: tooltipIzquierda ? undefined : sx(hoverX) + 12,
            right: tooltipIzquierda ? ancho - sx(hoverX) + 12 : undefined,
          }}
        >
          <p className="font-semibold text-gray-800 mb-1">
            {eje_x.etiqueta.replace(/ \(.*\)/, "")}: {formatoX(hoverX)} {eje_x.unidad}
          </p>
          {[...curvas].reverse().map((c) => (
            <p key={c.z} className="flex justify-between gap-4 text-gray-600" style={{ fontVariantNumeric: "tabular-nums" }}>
              <span>{etiquetaZ(c.z)}</span>
              <span className="text-gray-800">
                {formato(interpolar(c.puntos, hoverX), 1)} {eje_y.unidad}
              </span>
            </p>
          ))}
        </div>
      )}

      {/* Tooltip del paciente */}
      {hoverPaciente && pacientePx && (
        <div
          className="absolute pointer-events-none bg-white border border-gray-200 shadow-md rounded-lg px-3 py-2 text-xs"
          style={{
            top: Math.max(pacientePx.y - 70, 0),
            left: pacientePx.x > ancho * 0.6 ? undefined : pacientePx.x + 16,
            right: pacientePx.x > ancho * 0.6 ? ancho - pacientePx.x + 16 : undefined,
          }}
        >
          <p className="font-semibold text-gray-800 mb-1">Paciente</p>
          <p className="text-gray-600">
            {eje_x.etiqueta.replace(/ \(.*\)/, "")}: <span className="text-gray-800">{formatoX(paciente.x)} {eje_x.unidad}</span>
          </p>
          <p className="text-gray-600">
            {eje_y.etiqueta.replace(/ \(.*\)/, "")}: <span className="text-gray-800">{formato(paciente.y, 2)} {eje_y.unidad}</span>
          </p>
          {grafico.z !== null && (
            <p className="text-gray-600">
              Puntaje z: <span className="text-gray-800">{formato(grafico.z, 2)}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};
