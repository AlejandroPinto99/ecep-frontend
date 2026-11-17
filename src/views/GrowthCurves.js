import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

import { useGetGrowthCurves } from "../hooks/consultas/useGetGrowthCurves";
import { GrowthChart, COLORES, etiquetaZ, interpolar } from "../components/GrowthChart/GrowthChart";
import { formatDate } from "../helpers/date";
import { formatEdad } from "../helpers/age";

// Colores de estado (reservados para la clasificación), siempre con ícono + texto
const NIVELES = {
  normal: { color: "#0ca30c", fondo: "bg-green-50", Icono: CheckCircleIcon },
  alerta: { color: "#fab219", fondo: "bg-yellow-50", Icono: ExclamationTriangleIcon },
  serio: { color: "#ec835a", fondo: "bg-orange-50", Icono: ExclamationCircleIcon },
  critico: { color: "#d03b3b", fondo: "bg-red-50", Icono: XCircleIcon },
};

const formato = (n, d = 1) =>
  n === null || n === undefined ? "—" : n.toLocaleString("es-SV", { maximumFractionDigits: d });

const formatoEdad = (meses) => formatEdad(meses) ?? "—";

const Clasificacion = ({ clasificacion }) => {
  if (!clasificacion) return null;
  const { color, fondo, Icono } = NIVELES[clasificacion.nivel];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium text-gray-800 ${fondo}`}>
      <Icono className="h-5 w-5" style={{ color }} aria-hidden="true" />
      {clasificacion.texto}
    </span>
  );
};

const Dato = ({ etiqueta, valor, detalle }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-4">
    <p className="text-sm text-gray-500">{etiqueta}</p>
    <p className="text-2xl font-bold text-gray-800">{valor}</p>
    {detalle && <p className="text-xs text-gray-500 mt-1">{detalle}</p>}
  </div>
);

const Leyenda = () => (
  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600">
    <span className="flex items-center gap-2">
      <svg width="12" height="12" aria-hidden="true">
        <circle cx="6" cy="6" r="5" fill={COLORES.paciente} />
      </svg>
      Paciente
    </span>
    <span className="flex items-center gap-2">
      <svg width="20" height="12" aria-hidden="true">
        <line x1="0" x2="20" y1="6" y2="6" stroke={COLORES.primario} strokeWidth="2" />
      </svg>
      Mediana (0)
    </span>
    <span className="flex items-center gap-2">
      <svg width="20" height="12" aria-hidden="true">
        <line x1="0" x2="20" y1="6" y2="6" stroke={COLORES.tenue} strokeWidth="1.5" />
      </svg>
      ±2 DE
    </span>
    <span className="flex items-center gap-2">
      <svg width="20" height="12" aria-hidden="true">
        <line x1="0" x2="20" y1="6" y2="6" stroke={COLORES.secundario} strokeWidth="1.5" />
      </svg>
      ±3 DE
    </span>
    <span className="flex items-center gap-2">
      <span className="inline-block h-3 w-5 rounded-sm" style={{ background: COLORES.franja, border: "1px solid rgba(12,163,12,0.3)" }} />
      Rango normal (−2 a +2 DE)
    </span>
  </div>
);

// Tabla equivalente al gráfico: la medición del paciente y los valores de
// referencia en su misma edad/talla.
const TablaReferencia = ({ grafico }) => {
  const { paciente, curvas, eje_x, eje_y } = grafico;
  if (!paciente) return <p className="text-sm text-gray-500">Sin medición del paciente.</p>;
  return (
    <table className="w-full text-sm text-left">
      <caption className="text-left text-gray-600 mb-2">
        Valores de referencia OMS a{" "}
        {eje_x.unidad === "meses" ? formatoEdad(paciente.x) : `${formato(paciente.x, 1)} ${eje_x.unidad}`}
      </caption>
      <thead>
        <tr className="border-b">
          <th className="py-1 pr-4 font-semibold">Curva</th>
          <th className="py-1 font-semibold text-right">{eje_y.etiqueta}</th>
        </tr>
      </thead>
      <tbody style={{ fontVariantNumeric: "tabular-nums" }}>
        {[...curvas].reverse().map((c) => (
          <tr key={c.z} className="border-b">
            <td className="py-1 pr-4 text-gray-600">{etiquetaZ(c.z)}</td>
            <td className="py-1 text-right">{formato(interpolar(c.puntos, paciente.x), 1)}</td>
          </tr>
        ))}
        <tr className="font-semibold">
          <td className="py-1 pr-4">Paciente</td>
          <td className="py-1 text-right">{formato(paciente.y, 2)}</td>
        </tr>
      </tbody>
    </table>
  );
};

const TarjetaGrafico = ({ grafico, rango }) => {
  const [verTabla, setVerTabla] = useState(false);
  const porEdad = grafico.eje_x.unidad === "meses";
  const xs = grafico.curvas[0].puntos.map(([x]) => x);
  const dominioX = porEdad
    ? [rango.edad_desde_meses, rango.edad_hasta_meses]
    : [xs[0], xs[xs.length - 1]];
  const pasoX = porEdad ? (rango.edad_hasta_meses <= 24 ? 2 : 6) : 5;

  return (
    <section className="bg-white shadow-md rounded-lg p-6 border-klintoRed border w-full mb-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">{grafico.titulo}</h2>
          <p className="text-sm text-gray-500">
            Puntaje z:{" "}
            <span className="font-semibold text-gray-800">
              {grafico.z !== null ? formato(grafico.z, 2) : "—"}
            </span>
          </p>
        </div>
        <Clasificacion clasificacion={grafico.clasificacion} />
      </div>

      {grafico.mensaje && (
        <p className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-4">
          {grafico.mensaje}
        </p>
      )}

      <GrowthChart
        grafico={grafico}
        dominioX={dominioX}
        pasoX={pasoX}
        formatoX={(x) => formato(x, porEdad ? 0 : 1)}
      />

      <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
        <Leyenda />
        <button
          type="button"
          onClick={() => setVerTabla((v) => !v)}
          className="text-sm text-klintoRed hover:underline font-semibold"
          aria-expanded={verTabla}
        >
          {verTabla ? "Ocultar tabla" : "Ver tabla"}
        </button>
      </div>
      {verTabla && (
        <div className="mt-4 max-w-md">
          <TablaReferencia grafico={grafico} />
        </div>
      )}
    </section>
  );
};

// /consultas/:id/curvacrecimiento
const GrowthCurves = () => {
  const { id } = useParams();
  const { data, isError } = useGetGrowthCurves({ consulta_id: id });

  if (isError) {
    return <div className="p-8 w-full">No se encontró la consulta.</div>;
  }
  if (!data) {
    return <div className="p-8 w-full">Cargando...</div>;
  }

  const { paciente, consulta } = data;

  return (
    <div className="p-8 w-full min-w-0">
      <div className="mb-6">
        <Link to={`/consultas/${consulta.id_consulta}`} className="text-sm text-klintoRed hover:underline">
          ← Volver a la consulta
        </Link>
        <h1 className="text-2xl font-bold mt-2">Curvas de crecimiento</h1>
        <p className="text-gray-600 mt-1">
          Paciente:{" "}
          <Link to={`/pacientes/${paciente.id_paciente}`} className="text-klintoRed hover:underline">
            {paciente.nombre}
          </Link>{" "}
          · {paciente.sexo === "M" ? "Niño" : "Niña"} · Consulta del {formatDate(consulta.fecha_consulta)}
          {data.rango && <> · Curvas de {data.rango.etiqueta}</>}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Dato etiqueta="Edad en la consulta" valor={formatoEdad(consulta.edad_meses)} detalle={`${consulta.edad_dias} días`} />
        <Dato
          etiqueta="Peso"
          valor={consulta.peso_kg !== null ? `${formato(consulta.peso_kg, 2)} kg` : "No registrado"}
          detalle={consulta.peso_lb !== null ? `${formato(consulta.peso_lb, 2)} lb capturadas` : null}
        />
        <Dato etiqueta="Talla" valor={consulta.talla_cm !== null ? `${formato(consulta.talla_cm, 1)} cm` : "No registrada"} />
        <Dato
          etiqueta="Perímetro cefálico"
          valor={
            consulta.circunferencia_cefalica_cm != null
              ? `${formato(consulta.circunferencia_cefalica_cm, 1)} cm`
              : "No registrado"
          }
        />
      </div>

      {!data.aplica ? (
        <p className="bg-white border border-gray-200 rounded-lg p-6 text-gray-700">{data.motivo}</p>
      ) : (
        data.graficos.map((g) => <TarjetaGrafico key={g.id} grafico={g} rango={data.rango} />)
      )}

      <p className="text-xs text-gray-500">
        {data.fuente}. Hasta los 2 años se usa la longitud (medida acostado) y de 2 a 5 años la talla (de pie).
        El peso capturado en libras se convierte a kilogramos.
      </p>
    </div>
  );
};

export default GrowthCurves;
