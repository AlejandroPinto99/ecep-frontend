import { useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useGetLabExamParameters } from "../../hooks/consultas/useGetLabExamParameters";

let nextKey = 1;

// Exámenes de laboratorio de una consulta que todavía no se ha guardado.
// `exams` vive en el formulario padre: [{ key, id_examen_laboratorio, titulo, observacion }]
// `key` es solo para React; no se envía a la API.
//
// Este componente se renderiza dentro del <form> de la consulta, por eso no usa
// su propio <form> (no se pueden anidar) y sus botones son type="button".
export const LabExamsSection = ({ exams, onChange }) => {
  const { data: tipos, isLoading } = useGetLabExamParameters();
  const [isAdding, setIsAdding] = useState(false);
  const [tipoId, setTipoId] = useState("");
  const [observacion, setObservacion] = useState("");

  const resetDraft = () => {
    setTipoId("");
    setObservacion("");
  };

  const closeDraft = () => {
    resetDraft();
    setIsAdding(false);
  };

  const addExam = () => {
    if (!tipoId) return;
    const tipo = tipos?.find((t) => String(t.id) === String(tipoId));
    onChange([
      ...exams,
      {
        key: nextKey++,
        id_examen_laboratorio: Number(tipoId),
        titulo: tipo?.titulo,
        observacion: observacion.trim(),
      },
    ]);
    closeDraft();
  };

  const removeExam = (key) => onChange(exams.filter((e) => e.key !== key));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {exams.length === 0
            ? "No se han agregado exámenes."
            : `${exams.length} ${exams.length === 1 ? "examen agregado" : "exámenes agregados"}`}
        </p>
        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="bg-klintoRed hover:bg-opacity-80 text-white rounded-lg py-2 px-4 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Agregar examen</span>
          </button>
        )}
      </div>

      {isAdding && (
        <div className="border border-gray-300 bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4">
            <div>
              <label htmlFor="lab_tipo" className="text-sm font-semibold flex space-x-2">
                <span>Tipo de examen</span>
                <span className="text-red-600">*</span>
              </label>
              <div className="flex items-center border border-gray-400 rounded-lg p-2 w-full bg-white">
                <select
                  id="lab_tipo"
                  value={tipoId}
                  onChange={(e) => setTipoId(e.target.value)}
                  className="focus:outline-none w-full bg-transparent"
                  disabled={isLoading}
                >
                  <option value="">
                    {isLoading ? "Cargando..." : "Seleccione un examen"}
                  </option>
                  {tipos?.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.titulo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="lab_observacion" className="text-sm font-semibold">
                Observaciones
              </label>
              <div className="flex items-center border border-gray-400 rounded-lg p-2 w-full bg-white">
                <input
                  id="lab_observacion"
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                  onKeyDown={(e) => {
                    // Enter agrega el examen en vez de enviar toda la consulta
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addExam();
                    }
                  }}
                  className="focus:outline-none focus:ring-0 w-full"
                  placeholder="Resultados u observaciones del examen"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={closeDraft}
              className="border border-gray-400 text-gray-700 hover:bg-gray-100 rounded-lg py-2 px-4"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={addExam}
              disabled={!tipoId}
              className="bg-klintoRed hover:bg-opacity-80 text-white rounded-lg py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Agregar
            </button>
          </div>
        </div>
      )}

      {exams.length > 0 && (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 pr-4 w-1/4">Tipo de examen</th>
              <th className="py-2 pr-4">Observaciones</th>
              <th className="py-2 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {exams.map((e) => (
              <tr key={e.key} className="border-b last:border-0">
                <td className="py-2 pr-4 font-medium text-gray-700 align-top">
                  {e.titulo}
                </td>
                <td className="py-2 pr-4 whitespace-pre-line">
                  {e.observacion || <span className="text-gray-400">Sin observaciones</span>}
                </td>
                <td className="py-2 text-right align-top">
                  <button
                    type="button"
                    onClick={() => removeExam(e.key)}
                    title="Quitar examen"
                    aria-label={`Quitar ${e.titulo}`}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
