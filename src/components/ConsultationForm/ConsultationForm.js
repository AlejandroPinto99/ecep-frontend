import { useState } from "react";
import { useForm } from "react-hook-form";

import { Input } from "../Form/Input";
import { Textarea } from "../Form/Textarea";
import { LabExamsSection } from "../LabExams/LabExamsSection";
import { edadEnMeses, formatEdad } from "../../helpers/age";
import { fechaLocalISO } from "../../helpers/date";
import { useGetRevisionParameters } from "../../hooks/consultas/useGetRevisionParameters";

// Formulario de consulta compartido por "Nueva consulta" y "Editar consulta".
//
// Props:
//  - initialData: la consulta tal como la devuelve GET /consultas/:id (modo edición)
//                 o null (consulta nueva).
//  - fechaNacimiento: del paciente, para mostrar la edad a la fecha de la
//                 consulta (solo informativa; la API la calcula y guarda).
//  - onSubmit(consultaData): recibe el payload listo para la API.
//  - isPending:   mientras se guarda, todo el formulario queda bloqueado.

// Campos del examen físico que siempre se muestran (vacío = no se tomó)
export const VITALS = [
  { name: "peso_lb", label: "Peso (lb)", step: "0.01" },
  { name: "talla_cm", label: "Talla (cm)", step: "0.1" },
  { name: "circunferencia_cefalica_cm", label: "Circunferencia cefálica (cm)", step: "0.1" },
  { name: "temperatura_c", label: "Temperatura (°C)", step: "0.1" },
  { name: "frecuencia_cardiaca", label: "Frecuencia cardiaca (latidos/minuto)", step: "1" },
  { name: "frecuencia_respiratoria", label: "Frecuencia respiratoria (respiraciones/minuto)", step: "1" },
];

// Las revisiones se registran como "revision_<id>" para que react-hook-form
// no las convierta en un arreglo disperso (lo que pasa con claves numéricas).
const revisionField = (id) => `revision_${id}`;

const NORMAL = "Normal";

const Section = ({ title, children }) => (
  <section className="bg-white shadow-md rounded-lg p-6 border-klintoRed border w-full mb-6">
    <h2 className="text-lg font-bold text-klintoRed mb-4">{title}</h2>
    {children}
  </section>
);

// Valores iniciales de react-hook-form a partir de una consulta existente
// La fecha de la consulta arranca en hoy; al editar, en la que ya tenía.
const toDefaultValues = (consulta) => {
  if (!consulta) return { fecha_consulta: fechaLocalISO() };
  const { datos_consulta, examen_fisico, resultados } = consulta;
  const values = {
    fecha_consulta: fechaLocalISO(datos_consulta.fecha_consulta),
    motivo_consulta: datos_consulta.motivo_consulta ?? "",
    signos_sintomas: datos_consulta.signos_sintomas ?? "",
    diagnostico: resultados.diagnostico ?? "",
    tratamiento: resultados.tratamiento ?? "",
  };
  VITALS.forEach((v) => {
    values[v.name] = examen_fisico[v.name] ?? "";
  });
  examen_fisico.revisiones.forEach((r) => {
    values[revisionField(r.id_revision_fisica)] = r.observacion ?? "";
  });
  return values;
};

export const ConsultationForm = ({ initialData = null, fechaNacimiento, onSubmit, isPending, submitLabel = "Guardar" }) => {
  const methods = useForm({ defaultValues: toDefaultValues(initialData) });

  // La edad sigue a la fecha elegida: si se registra una consulta pasada, se ve
  // la edad que tenía el paciente ese día.
  const edadMeses = edadEnMeses(fechaNacimiento, methods.watch("fecha_consulta"));

  // Revisiones marcadas como "Normal". Es solo estado de la pantalla: no se
  // envía; lo único que se guarda es la observación. Al editar se marcan las
  // que ya tenían exactamente "Normal".
  const [normalIds, setNormalIds] = useState(
    () =>
      new Set(
        (initialData?.examen_fisico.revisiones || [])
          .filter((r) => r.observacion === NORMAL)
          .map((r) => r.id_revision_fisica),
      ),
  );

  const toggleNormal = (id, checked) => {
    setNormalIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
    // Al desmarcar se limpia para que el médico escriba su propia observación
    methods.setValue(revisionField(id), checked ? NORMAL : "");
  };

  // Marca todas las revisiones como "Normal" (sobrescribe lo que se hubiera escrito)
  const marcarTodoNormal = () => {
    setNormalIds(new Set(revisiones.map((r) => r.id)));
    revisiones.forEach((r) => methods.setValue(revisionField(r.id), NORMAL));
  };

  // Exámenes de laboratorio (se envían junto con la consulta al guardar).
  // `key` es solo para React.
  const [labExams, setLabExams] = useState(() =>
    (initialData?.examenes_laboratorio || []).map((e) => ({
      key: `guardado-${e.id_examen_consulta}`,
      id_examen_laboratorio: e.id_examen_laboratorio,
      titulo: e.titulo,
      observacion: e.observacion ?? "",
    })),
  );

  const { data: catalogo, isLoading: isLoadingRevisiones } = useGetRevisionParameters();

  // Al editar, una revisión guardada que ya no esté activa en el catálogo se
  // sigue mostrando: si no, se perdería al guardar (el PUT reemplaza todo).
  const revisiones = (() => {
    if (!catalogo) return [];
    const ids = new Set(catalogo.map((r) => r.id));
    const extra = (initialData?.examen_fisico.revisiones || [])
      .filter((r) => !ids.has(r.id_revision_fisica))
      .map((r) => ({ id: r.id_revision_fisica, titulo: r.titulo }));
    return [...catalogo, ...extra];
  })();

  const handleValid = (form) => {
    if (isPending) return;
    onSubmit({
      datos_consulta: {
        fecha_consulta: form.fecha_consulta,
        motivo_consulta: form.motivo_consulta,
        signos_sintomas: form.signos_sintomas,
      },
      examen_fisico: {
        ...Object.fromEntries(VITALS.map((v) => [v.name, form[v.name]])),
        // Solo viajan las revisiones con observación
        revisiones: revisiones
          .map((r) => ({
            id_revision_fisica: r.id,
            observacion: (form[revisionField(r.id)] || "").trim(),
          }))
          .filter((r) => r.observacion !== ""),
      },
      examenes_laboratorio: labExams.map((e) => ({
        id_examen_laboratorio: e.id_examen_laboratorio,
        observacion: e.observacion,
      })),
      resultados: {
        diagnostico: form.diagnostico,
        tratamiento: form.tratamiento,
      },
    });
  };

  return (
    <form onSubmit={methods.handleSubmit(handleValid)}>
      <fieldset disabled={isPending}>
        {/* 1. Datos de la consulta */}
        <Section title="Datos de la consulta">
          <div className="space-y-4">
            <div className="md:w-1/2 md:pr-2">
              <Input
                name="fecha_consulta"
                label="Fecha de la consulta"
                methods={methods}
                type="date"
                max={fechaLocalISO()}
                required
              />
            </div>
            <Input
              name="motivo_consulta"
              label="Motivo de la consulta"
              methods={methods}
              required
            />
            <Textarea
              name="signos_sintomas"
              label="Signos y síntomas"
              methods={methods}
              rows={4}
            />
          </div>
        </Section>

        {/* 2. Examen físico */}
        <Section title="Examen físico">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VITALS.map((v) => (
              <Input
                key={v.name}
                name={v.name}
                label={v.label}
                methods={methods}
                type="number"
                step={v.step}
                min="0"
              />
            ))}
            {/* Edad: calculada con la fecha de nacimiento, no editable y no
                registrada en el formulario (no se envía a la API) */}
            <div>
              <label htmlFor="edad_meses" className="text-sm font-semibold flex space-x-2">
                <span>Edad</span>
              </label>
              <div className="flex items-center border border-gray-300 bg-gray-100 rounded-lg p-2 w-full">
                <input
                  id="edad_meses"
                  value={formatEdad(edadMeses) ?? ""}
                  placeholder="Calculando..."
                  className="focus:outline-none w-full bg-transparent text-gray-600 cursor-not-allowed"
                  disabled
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-2 mt-8 mb-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Revisiones</h3>
              <p className="text-sm text-gray-500">
                Solo se guardan las revisiones que tengan observación.
              </p>
            </div>
            <button
              type="button"
              onClick={marcarTodoNormal}
              disabled={isLoadingRevisiones || revisiones.length === 0}
              className="border border-klintoRed text-klintoRed hover:bg-klintoRed hover:text-white rounded-lg py-1.5 px-4 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Marcar todo normal
            </button>
          </div>
          {isLoadingRevisiones ? (
            <p className="text-gray-500">Cargando revisiones...</p>
          ) : (
            <div className="space-y-3">
              {revisiones.map((r) => {
                const isNormal = normalIds.has(r.id);
                return (
                  <div
                    key={r.id}
                    className="grid grid-cols-1 md:grid-cols-[220px_auto_1fr] items-center gap-2 md:gap-4"
                  >
                    <label htmlFor={revisionField(r.id)} className="text-sm font-semibold text-gray-700">
                      {r.titulo}
                    </label>
                    <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isNormal}
                        onChange={(e) => toggleNormal(r.id, e.target.checked)}
                        className="h-4 w-4 accent-klintoRed cursor-pointer"
                      />
                      <span>Normal</span>
                    </label>
                    <div
                      className={`flex items-center border rounded-lg p-2 w-full ${
                        isNormal ? "border-gray-300 bg-gray-100" : "border-gray-400"
                      }`}
                    >
                      {/* readOnly y no disabled: react-hook-form descarta los
                          campos disabled al enviar y "Normal" no se guardaría */}
                      <input
                        id={revisionField(r.id)}
                        {...methods.register(revisionField(r.id))}
                        className={`focus:outline-none focus:ring-0 w-full ${
                          isNormal ? "bg-transparent text-gray-600 cursor-not-allowed" : ""
                        }`}
                        placeholder="Observación"
                        autoComplete="off"
                        readOnly={isNormal}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Section>

        {/* Exámenes de laboratorio */}
        <Section title="Exámenes de laboratorio">
          <LabExamsSection exams={labExams} onChange={setLabExams} />
        </Section>

        {/* 3. Resultados */}
        <Section title="Resultados">
          <div className="space-y-4">
            <Textarea name="diagnostico" label="Diagnóstico" methods={methods} rows={6} />
            <Textarea name="tratamiento" label="Tratamiento" methods={methods} rows={6} />
          </div>
        </Section>
      </fieldset>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="bg-klintoRed hover:bg-opacity-80 text-white rounded-lg py-2 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  );
};
