import { useState } from "react";
import { toast } from "react-toastify";

import Modal from "../Modal/Modal";
import { ConfirmDelete } from "../ModalViews/ConfirmDeletion";
import { ApplyVaccineForm } from "./ApplyVaccineForm";
import {
  useGetPatientVaccines,
  useGetVaccinationSchemes,
  useDeleteVaccineApplication,
} from "../../hooks/vacunas/useVacunas";
import { formatAgeMonths, formatAgeRange, formatEdad } from "../../helpers/age";
import { formatDate } from "../../helpers/date";

// Estados que calcula la API -> estilo de la etiqueta
const ESTADOS = {
  Aplicada: "bg-green-100 text-green-800",
  Corresponde: "bg-blue-100 text-blue-800",
  Atrasada: "bg-red-100 text-red-800",
  Pendiente: "bg-gray-100 text-gray-600",
  Opcional: "bg-purple-100 text-purple-800",
  "No aplica": "bg-gray-100 text-gray-400",
};

const FILTROS = [
  { id: "todas", label: "Todas", match: () => true },
  { id: "por_aplicar", label: "Por aplicar", match: (d) => d.estado === "Corresponde" || d.estado === "Atrasada" },
  { id: "aplicadas", label: "Aplicadas", match: (d) => d.estado === "Aplicada" },
];

const EstadoBadge = ({ estado }) => (
  <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${ESTADOS[estado] || ""}`}>
    {estado}
  </span>
);

// Agrupa las dosis por la edad a la que empiezan (Al nacer, 2 meses, ...)
const groupByAge = (dosis) => {
  const groups = [];
  dosis.forEach((d) => {
    const label = formatAgeMonths(d.edad_desde_meses);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(d);
    else groups.push({ label, items: [d] });
  });
  return groups;
};

export const VaccinationSchedule = ({ patient_id, birthDate }) => {
  const [esquema, setEsquema] = useState(null);
  const [filtro, setFiltro] = useState("todas");
  const [toApply, setToApply] = useState(null);
  const [toRemove, setToRemove] = useState(null);

  const { data: esquemas } = useGetVaccinationSchemes();
  const { data, isLoading, isError } = useGetPatientVaccines({ patient_id, esquema });
  const { mutate: removeApplication, isPending: isRemoving } = useDeleteVaccineApplication();

  const confirmRemove = () => {
    if (isRemoving) return;
    removeApplication(
      { id_aplicacion: toRemove.aplicacion.id_aplicacion, patient_id },
      {
        onSuccess: () => {
          toast.success("Vacuna desmarcada");
          setToRemove(null);
        },
        onError: () => toast.error("No se pudo quitar la vacuna"),
      },
    );
  };

  const matcher = FILTROS.find((f) => f.id === filtro).match;
  const groups = data ? groupByAge(data.dosis.filter(matcher)) : [];

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border-klintoRed border w-full mt-6">
      <Modal
        isOpen={!!toApply}
        onClose={() => setToApply(null)}
        title="Registrar vacuna aplicada"
      >
        {toApply && (
          <ApplyVaccineForm
            patient_id={patient_id}
            birthDate={birthDate}
            dosis={toApply}
            onClose={() => setToApply(null)}
            onSuccess={() => toast.success("Vacuna registrada con éxito!")}
          />
        )}
      </Modal>
      <Modal isOpen={!!toRemove} onClose={() => setToRemove(null)}>
        <ConfirmDelete onDelete={confirmRemove} onCancel={() => setToRemove(null)} />
      </Modal>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold">Esquema de vacunación</h2>
          {data && (
            <p className="text-sm text-gray-500">
              {data.esquema.nombre} · Edad del paciente:{" "}
              {formatEdad(data.paciente.edad_meses)}
            </p>
          )}
        </div>
        {esquemas?.length > 1 && (
          <select
            value={esquema ?? data?.esquema.id_esquema ?? ""}
            onChange={(e) => setEsquema(Number(e.target.value))}
            className="border border-gray-400 rounded-lg p-2"
          >
            {esquemas.map((e) => (
              <option key={e.id_esquema} value={e.id_esquema}>
                {e.nombre}
              </option>
            ))}
          </select>
        )}
      </div>

      {isLoading && <p className="text-gray-500">Cargando esquema...</p>}
      {isError && <p className="text-red-600">No se pudo cargar el esquema de vacunación.</p>}

      {data && (
        <>
          {/* Resumen */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Aplicadas (de las que ya le corresponden)</p>
              <p className="text-2xl font-bold text-green-700">
                {data.resumen.aplicadas} / {data.resumen.exigibles}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Corresponden ahora</p>
              <p className="text-2xl font-bold text-blue-700">{data.resumen.corresponden}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Atrasadas</p>
              <p className={`text-2xl font-bold ${data.resumen.atrasadas ? "text-red-700" : "text-gray-700"}`}>
                {data.resumen.atrasadas}
              </p>
            </div>
          </div>

          {/* Filtro */}
          <div className="flex space-x-2 mb-4">
            {FILTROS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFiltro(f.id)}
                className={`rounded-full px-4 py-1 text-sm border ${
                  filtro === f.id
                    ? "bg-klintoRed text-white border-klintoRed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {groups.length === 0 && (
            <p className="text-gray-500">No hay dosis en este filtro.</p>
          )}

          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group.label}>
                <h3 className="font-semibold text-gray-800 border-b pb-1 mb-2">{group.label}</h3>
                <table className="w-full text-left">
                  <tbody>
                    {group.items.map((d) => (
                      <tr key={d.id_dosis} className="border-b last:border-0 align-top">
                        <td className="py-2 pr-4">
                          <p className="font-medium text-gray-800">
                            {d.siglas || d.vacuna}{" "}
                            <span className="font-normal text-gray-600">· {d.etiqueta}</span>
                          </p>
                          <p className="text-xs text-gray-500">{d.vacuna}</p>
                          {d.nota && <p className="text-xs text-gray-400 mt-1">{d.nota}</p>}
                        </td>
                        <td className="py-2 pr-4 text-sm text-gray-600 whitespace-nowrap">
                          {formatAgeRange(d.edad_desde_meses, d.edad_hasta_meses)}
                        </td>
                        <td className="py-2 pr-4 whitespace-nowrap">
                          <EstadoBadge estado={d.estado} />
                          {d.aplicacion &&
                            (d.aplicacion.aplicada_externamente ? (
                              <p className="text-xs text-gray-500 mt-1 whitespace-normal max-w-xs">
                                Aplicada en otro lugar
                                {d.aplicacion.observacion && ` · ${d.aplicacion.observacion}`}
                              </p>
                            ) : (
                              <p className="text-xs text-gray-500 mt-1">
                                {d.aplicacion.fecha_aplicacion
                                  ? formatDate(d.aplicacion.fecha_aplicacion)
                                  : "Fecha desconocida"}
                                {d.aplicacion.lote && ` · Lote ${d.aplicacion.lote}`}
                              </p>
                            ))}
                        </td>
                        <td className="py-2 text-right whitespace-nowrap">
                          {d.aplicacion ? (
                            <button
                              type="button"
                              onClick={() => setToRemove(d)}
                              className="text-sm text-gray-500 hover:text-red-600"
                            >
                              Quitar
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setToApply(d)}
                              className="text-sm text-klintoRed hover:underline font-semibold"
                            >
                              Marcar aplicada
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
