import { useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGetConsultaById } from "../hooks/consultas/useGetConsultas";
import { formatDate } from "../helpers/date";
import { SyringeIcon } from "../components/Icons/SyringeIcon";
import {
  PresentationChartLineIcon,
  PencilSquareIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { generarReceta } from "../helpers/prescription";
import { formatEdad } from "../helpers/age";

const EMPTY = "No registrado";

const Section = ({ title, children }) => (
  <div className="bg-white shadow-md rounded-lg p-6 border-klintoRed border w-full mb-6">
    <h2 className="text-lg font-bold text-klintoRed mb-4">{title}</h2>
    {children}
  </div>
);

const Field = ({ label, value }) => (
  <div className="mb-3">
    <span className="font-bold text-gray-900">{label}:</span>{" "}
    <span className="font-normal text-gray-600 whitespace-pre-line">
      {value !== null && value !== undefined && value !== "" ? value : EMPTY}
    </span>
  </div>
);

const withUnit = (value, unit) =>
  value !== null && value !== undefined ? `${value} ${unit}` : null;

const Consultation = () => {
  const { id } = useParams();
  const { data, isError } = useGetConsultaById({ consulta_id: id });
  const location = useLocation();

  // Viene del formulario de nueva consulta o de edición.
  // toastId evita el doble aviso de StrictMode.
  useEffect(() => {
    if (location.state?.created) {
      toast.success("Consulta registrada con éxito!", { toastId: `consulta-creada-${id}` });
    }
    if (location.state?.updated) {
      toast.success("Consulta actualizada con éxito!", { toastId: `consulta-actualizada-${id}` });
    }
  }, [location.state, id]);

  if (isError) {
    return <div className="p-8 w-full"><ToastContainer />No se encontró la consulta.</div>;
  }
  if (!data) {
    return <div className="p-8 w-full"><ToastContainer />Cargando...</div>;
  }

  const { datos_consulta, examen_fisico, resultados } = data;
  const patientName = data.nombre_paciente;

  const vitals = [
    { label: "Peso", value: withUnit(examen_fisico.peso_lb, "lb") },
    { label: "Talla", value: withUnit(examen_fisico.talla_cm, "cm") },
    {
      label: "Circunferencia cefálica",
      value: withUnit(examen_fisico.circunferencia_cefalica_cm, "cm"),
    },
    { label: "Temperatura", value: withUnit(examen_fisico.temperatura_c, "°C") },
    {
      label: "Frecuencia cardiaca",
      value: withUnit(examen_fisico.frecuencia_cardiaca, "lpm"),
    },
    { label: "Edad", value: formatEdad(examen_fisico.edad_meses) },
  ];

  return (
    <div className="p-8 w-full">
      <ToastContainer />
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <Link to="/consultas" className="text-sm text-klintoRed hover:underline">
            ← Volver a consultas
          </Link>
          <h1 className="text-2xl font-bold mt-2">Detalle de la consulta</h1>
          {patientName && (
            <p className="text-gray-600 mt-1">
              Paciente:{" "}
              <Link
                to={`/pacientes/${data.id_paciente}`}
                className="text-klintoRed hover:underline"
              >
                {patientName}
              </Link>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
        <Link
          to={`/consultas/${data.id_consulta}/curvacrecimiento`}
          title="Curvas de crecimiento"
          className="border border-klintoRed text-klintoRed hover:bg-klintoRed hover:bg-opacity-10 rounded-lg py-2 px-4 flex items-center space-x-2"
        >
          <PresentationChartLineIcon className="h-5 w-5" />
          <span>Curva de crecimiento</span>
        </Link>
        <Link
          to={`/pacientes/${data.id_paciente}/esquemavacunas`}
          title="Esquema de vacunación"
          className="border border-klintoRed text-klintoRed hover:bg-klintoRed hover:bg-opacity-10 rounded-lg py-2 px-4 flex items-center space-x-2"
        >
          <SyringeIcon className="h-5 w-5" />
          <span>Esquema de vacunación</span>
        </Link>
        <button
          type="button"
          onClick={() => generarReceta(data)}
          title="Generar receta en PDF"
          className="border border-klintoRed text-klintoRed hover:bg-klintoRed hover:bg-opacity-10 rounded-lg py-2 px-4 flex items-center space-x-2"
        >
          <DocumentTextIcon className="h-5 w-5" />
          <span>Generar receta</span>
        </button>
        <Link
          to={`/consultas/${data.id_consulta}/editar`}
          className="bg-klintoRed hover:bg-opacity-80 text-white rounded-lg py-2 px-4 flex items-center space-x-2"
        >
          <PencilSquareIcon className="h-5 w-5" />
          <span>Editar</span>
        </Link>
        </div>
      </div>

      <Section title="Datos de la consulta">
        <Field label="Fecha" value={formatDate(datos_consulta.fecha_consulta)} />
        <Field label="Motivo de la consulta" value={datos_consulta.motivo_consulta} />
        <Field label="Signos y síntomas" value={datos_consulta.signos_sintomas} />
      </Section>

      <Section title="Examen físico">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
          {vitals.map((v) => (
            <Field key={v.label} label={v.label} value={v.value} />
          ))}
        </div>

        <h3 className="font-semibold text-gray-800 mt-4 mb-2">Revisiones</h3>
        {examen_fisico.revisiones.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-4 w-1/4">Aspecto</th>
                <th className="py-2">Observación</th>
              </tr>
            </thead>
            <tbody>
              {examen_fisico.revisiones.map((r) => (
                <tr key={r.id_revision_fisica} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-bold text-gray-900 align-top">
                    {r.titulo}
                  </td>
                  <td className="py-2 whitespace-pre-line">{r.observacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No se registraron revisiones.</p>
        )}
      </Section>

      <Section title="Exámenes de laboratorio">
        {data.examenes_laboratorio?.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-4 w-1/4">Tipo de examen</th>
                <th className="py-2">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {data.examenes_laboratorio.map((e) => (
                <tr key={e.id_examen_consulta} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-bold text-gray-900 align-top">
                    {e.titulo}
                  </td>
                  <td className="py-2 whitespace-pre-line">
                    {e.observacion || (
                      <span className="text-gray-400">Sin observaciones</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No se registraron exámenes de laboratorio.</p>
        )}
      </Section>

      <Section title="Resultados">
        <Field label="Diagnóstico" value={resultados.diagnostico} />
        <Field label="Tratamiento" value={resultados.tratamiento} />
      </Section>
    </div>
  );
};

export default Consultation;
