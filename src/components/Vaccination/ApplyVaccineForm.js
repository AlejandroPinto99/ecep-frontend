import { useState } from "react";
import { toast } from "react-toastify";
import { useCreateVaccineApplication } from "../../hooks/vacunas/useVacunas";
import { formatAgeRange } from "../../helpers/age";

// Fecha local de hoy en formato YYYY-MM-DD (para el input date)
const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const inputClass =
  "flex items-center border border-gray-400 rounded-lg p-2 w-full bg-white";

// Formulario para marcar una dosis como aplicada.
// - En la clínica: fecha (obligatoria), lote, lugar y observación.
// - En otro lugar: solo una observación opcional (la API guarda fecha/lote/lugar en NULL).
export const ApplyVaccineForm = ({ patient_id, birthDate, dosis, onClose, onSuccess }) => {
  const [externa, setExterna] = useState(false);
  const [fecha, setFecha] = useState(todayISO());
  const [lote, setLote] = useState("");
  const [lugar, setLugar] = useState("");
  const [observacion, setObservacion] = useState("");
  const { mutate, isPending } = useCreateVaccineApplication();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isPending) return;
    mutate(
      {
        applicationData: externa
          ? {
              id_paciente: patient_id,
              id_dosis: dosis.id_dosis,
              aplicada_externamente: true,
              observacion,
            }
          : {
              id_paciente: patient_id,
              id_dosis: dosis.id_dosis,
              aplicada_externamente: false,
              fecha_aplicacion: fecha,
              lote,
              lugar,
              observacion,
            },
      },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
        },
        onError: (error) => {
          toast.error(
            typeof error.response?.data === "string"
              ? error.response.data
              : "No se pudo registrar la vacuna",
          );
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={isPending} className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="font-semibold text-gray-800">
            {dosis.vacuna} {dosis.siglas && <span className="text-gray-500">({dosis.siglas})</span>}
          </p>
          <p className="text-sm text-gray-600">
            {dosis.etiqueta} · Edad recomendada:{" "}
            {formatAgeRange(dosis.edad_desde_meses, dosis.edad_hasta_meses)}
          </p>
          {dosis.nota && <p className="text-sm text-gray-500 mt-2">{dosis.nota}</p>}
        </div>

        <label className="flex items-start space-x-3 border border-gray-300 rounded-lg p-3 cursor-pointer select-none hover:bg-gray-50">
          <input
            type="checkbox"
            checked={externa}
            onChange={(e) => setExterna(e.target.checked)}
            className="h-4 w-4 mt-1 accent-klintoRed"
          />
          <span>
            <span className="block font-semibold text-gray-800">Fue aplicada en otro lugar</span>
            <span className="block text-sm text-gray-500">
              No la aplicó esta clínica (otra unidad de salud, carnet, etc.). Solo se registra una observación.
            </span>
          </span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!externa && (
            <>
              <div>
                <label htmlFor="va_fecha" className="text-sm font-semibold flex space-x-2">
                  <span>Fecha de aplicación</span>
                  <span className="text-red-600">*</span>
                </label>
                <div className={inputClass}>
                  <input
                    id="va_fecha"
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    min={birthDate ? String(birthDate).slice(0, 10) : undefined}
                    max={todayISO()}
                    required
                    className="focus:outline-none w-full bg-transparent"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="va_lote" className="text-sm font-semibold">Lote</label>
                <div className={inputClass}>
                  <input
                    id="va_lote"
                    value={lote}
                    onChange={(e) => setLote(e.target.value)}
                    className="focus:outline-none w-full"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="va_lugar" className="text-sm font-semibold">Lugar de aplicación</label>
                <div className={inputClass}>
                  <input
                    id="va_lugar"
                    value={lugar}
                    onChange={(e) => setLugar(e.target.value)}
                    placeholder="Ej. Consultorio 1"
                    className="focus:outline-none w-full"
                    autoComplete="off"
                  />
                </div>
              </div>
            </>
          )}
          <div className="md:col-span-2">
            <label htmlFor="va_obs" className="text-sm font-semibold">
              Observación <span className="font-normal text-gray-500">(opcional)</span>
            </label>
            <div className="flex border border-gray-400 rounded-lg p-2 w-full bg-white">
              <textarea
                id="va_obs"
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                rows={3}
                placeholder={externa ? "Ej. Aplicada en Unidad de Salud de Santa Tecla, según carnet" : ""}
                className="focus:outline-none w-full resize-y"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="border border-gray-400 text-gray-700 hover:bg-gray-100 rounded-lg py-2 px-4"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="bg-klintoRed hover:bg-opacity-80 text-white rounded-lg py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Guardando..." : "Marcar como aplicada"}
          </button>
        </div>
      </fieldset>
    </form>
  );
};
