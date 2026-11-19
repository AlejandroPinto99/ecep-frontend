import { useParams, Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useGetPatientById } from "../hooks/useGetPatients";
import { formatDate } from "../helpers/date";
import { mostrarTelefono } from "../helpers/phone";
import { PsychomotorHistory } from "../components/ModalViews/PsychomotorHistory";
import { PerinatalHistory } from "../components/ModalViews/PerinatalHistory";
import { DiseaseHistory } from "../components/ModalViews/DiseaseHistory";
import { DiseaseHistoryList } from "../components/ModalViews/DiseaseHistoryList";
import { SubstanceHistory } from "../components/ModalViews/SubstanceHistory";
import { SubstanceHistoryList } from "../components/ModalViews/SubstanceHistoryList";
import { PatientConsultations } from "../components/PatientConsultations/PatientConsultations";
import { SyringeIcon } from "../components/Icons/SyringeIcon";
import Modal from "../components/Modal/Modal";
import { useState } from "react";
import { useGetPsychomotorHistory } from "../hooks/psycomotor/useGetPsychomotorHistory";
import { useGetPerinatalHistory } from "../hooks/perinatal/useGetPerinatalHistory";
import { ToastContainer, toast } from "react-toastify";

// Antecedentes perinatales y psicomotores comparten una misma fila por paciente,
// así que una vez que uno de los dos existe, el GET del otro ya no da 404 sino
// 200 con sus propios campos en null. Hay que revisar los campos, no solo si hay fila.
const PERINATAL_FIELDS = [
  "termino",
  "semanas_gestacion",
  "tipo_parto",
  "peso_nacer_lb",
  "talla_nacer_cm",
  "tipo_sangre",
  "factor_rh",
  "condicion_al_nacer",
  "condicion_primera_semana",
  "alimentacion",
];
const PSYCHOMOTOR_FIELDS = [
  "edad_se_sento_meses",
  "edad_se_paro_meses",
  "edad_camino_meses",
  "edad_primer_diente_meses",
  "observacion_desarrollo",
];
const hasHistoryData = (history, fields) =>
  !!history && fields.some((field) => history[field] !== null && history[field] !== undefined);

const Patient = () => {
  const { id } = useParams();
  const { data } = useGetPatientById({ patient_id: id });
  const [showPsychomotor, setShowPsychomotor] = useState(false);
  const [showPerinatal, setShowPerinatal] = useState(false);
  const [showDiseaseHistory, setShowDiseaseHistory] = useState(false);
  const [showDiseaseHistoryList, setShowDiseaseHistoryList] = useState(false);
  const [showSubstanceHistory, setShowSubstanceHistory] = useState(false);
  const [showSubstanceHistoryList, setShowSubstanceHistoryList] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const { data: perinatalHistory } = useGetPerinatalHistory({ patient_id: id });
  const { data: psychomotorHistory } = useGetPsychomotorHistory({
    patient_id: id,
  });
  if (!data) {
    return <div className="p-8 w-full">Cargando...</div>;
  }

  const fullName = [
    data.primer_nombre,
    data.segundo_nombre,
    data.tercer_nombre,
    data.primer_apellido,
    data.segundo_apellido,
    data.tercer_apellido,
  ]
    .filter(Boolean)
    .join(" ");
  const gender = data.sexo === "M" ? "Masculino" : "Femenino";

  const fields = [
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-klintoRed"
        >
          <circle cx="12" cy="6.5" r="3.5" />
          <path d="M9.5 14l1-3h3l1 3" />
          <path d="M9.5 14l-1 6h3l.5-3 .5 3h3l-1-6" />
          <path d="M9.5 14.5l-2.5 1.5M14.5 14.5l2.5 1.5" />
        </svg>
      ),
      label: "Nombre Completo",
      value: fullName,
    },
    {
      icon: (
        <svg
          className="w-5 h-5 text-klintoRed"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      label: "Fecha de Nacimiento",
      value: formatDate(data.fecha_nacimiento),
    },
    {
      icon: (
        <svg
          className="w-5 h-5 text-klintoRed"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 4.5V9a4 4 0 01-4 4H8a4 4 0 01-4-4V4.5M12 12v6m0 0l-3-3m3 3l3-3"
          />
        </svg>
      ),
      label: "Sexo",
      value: gender,
    },
    {
      icon: (
        <svg
          className="w-5 h-5 text-klintoRed"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      label: "Número de Contacto",
      value: mostrarTelefono(data.numero_contacto),
    },
    {
      icon: (
        <svg
          className="w-5 h-5 text-klintoRed"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      label: "Dirección",
      value: `${data.direccion}, ${data.distrito?.nombre}, ${data.municipio?.nombre}, ${data.departamento?.nombre},`,
    },
    {
      icon: (
        <svg
          className="w-5 h-5 text-klintoRed"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      label: "Hospital de Nacimiento",
      value: data.hospital_nacimiento?.nombre,
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-klintoRed"
        >
          <circle cx="12" cy="6" r="3" />
          <path d="M9 13c0 0-2 1-2 4h10c0-3-2-4-2-4" />
          <path d="M9 13l1-3h4l1 3" />
          <path
            d="M10.5 19.5c0 0 .8 1.5 1.5 1.5s1.5-1.5 1.5-1.5"
            strokeWidth={1.4}
          />
        </svg>
      ),
      label: "Nombre de la Madre",
      value: data.nombres_madre || "No especificado",
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-klintoRed"
        >
          <circle cx="12" cy="6" r="3" />
          <path d="M9 13l-2 8h3l2-4 2 4h3l-2-8" />
          <path d="M9 13l1-3h4l1 3" />
          <path d="M11.5 10l.5 2 .5-2" strokeWidth={1.4} />
        </svg>
      ),
      label: "Nombre del Padre",
      value: data.nombres_padre || "No especificado",
    },
  ];

  const notifyCreationSuccess = () =>
    toast.success("Historial psicomotor registrado con éxito!");
  const notifyUpdateSuccess = () =>
    toast.success("Historial psicomotor actualizado con éxito!");
  const notifyDiseaseCreationSuccess = () =>
    toast.success("Enfermedad registrada con éxito!");
  const notifySubstanceCreationSuccess = () =>
    toast.success("Sustancia registrada con éxito!");

  return (
    <div className="p-8 w-full">
      <ToastContainer />
      <Modal isOpen={showPsychomotor} onClose={() => setShowPsychomotor(false)}>
        <PsychomotorHistory
          patient_id={data.id_paciente}
          action={isEditing}
          psychomotorHistory={psychomotorHistory}
          setIsOpen={() => setShowPsychomotor(false)}
          onSuccess={
            isEditing !== "create"
              ? () => notifyUpdateSuccess()
              : () => notifyCreationSuccess()
          }
        />
      </Modal>
      <Modal isOpen={showPerinatal} onClose={() => setShowPerinatal(false)}>
        <PerinatalHistory
          patient_id={data.id_paciente}
          action={isEditing}
          perinatalHistory={perinatalHistory}
          setIsOpen={() => setShowPerinatal(false)}
          onSuccess={
            isEditing !== "create"
              ? () => notifyUpdateSuccess()
              : () => notifyCreationSuccess()
          }
        />
      </Modal>
      <Modal
        isOpen={showDiseaseHistory}
        onClose={() => setShowDiseaseHistory(false)}
      >
        <DiseaseHistory
          patient_id={data.id_paciente}
          setIsOpen={() => setShowDiseaseHistory(false)}
          onSuccess={() => notifyDiseaseCreationSuccess()}
        />
      </Modal>
      <Modal
        isOpen={showDiseaseHistoryList}
        onClose={() => setShowDiseaseHistoryList(false)}
        title={`Historial de enfermedades de ${fullName}`}
      >
        <DiseaseHistoryList patient_id={data.id_paciente} />
      </Modal>
      <Modal
        isOpen={showSubstanceHistory}
        onClose={() => setShowSubstanceHistory(false)}
      >
        <SubstanceHistory
          patient_id={data.id_paciente}
          setIsOpen={() => setShowSubstanceHistory(false)}
          onSuccess={() => notifySubstanceCreationSuccess()}
        />
      </Modal>
      <Modal
        isOpen={showSubstanceHistoryList}
        onClose={() => setShowSubstanceHistoryList(false)}
      >
        <SubstanceHistoryList patient_id={data.id_paciente} />
      </Modal>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Información del Paciente</h1>
        <div className="flex items-center gap-2">
          <Link
            to={`/pacientes/${data.id_paciente}/esquemavacunas`}
            title="Esquema de vacunación"
            className="border border-klintoRed text-klintoRed hover:bg-klintoRed hover:bg-opacity-10 rounded-lg py-2 px-4 flex items-center space-x-2"
          >
            <SyringeIcon className="h-5 w-5" />
            <span>Esquema de vacunación</span>
          </Link>
          <Link
            to={`/pacientes/${data.id_paciente}/consultas/nueva`}
            className="bg-klintoRed hover:bg-opacity-80 text-white rounded-lg py-2 px-4 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Iniciar consulta</span>
          </Link>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 border-klintoRed border w-full">
        {fields.map((field, index) => (
          <div key={index} className="flex items-center mb-4">
            <div className="mr-3">{field.icon}</div>
            <div>
              <span className="font-semibold text-gray-700">
                {field.label}:
              </span>{" "}
              {field.value}
            </div>
          </div>
        ))}
      </div>
      <PatientConsultations patient_id={data.id_paciente} />
      <div className="flex gap-6 mt-6">
        <div className="bg-white shadow-md rounded-lg p-6 text-start border border-klintoRed flex items-center justify-between flex-1 transition-transform duration-200 hover:scale-[1.02]">
          <p>Antecedentes perinatales</p>
          {hasHistoryData(perinatalHistory, PERINATAL_FIELDS) ? (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowPerinatal(true);
                  setIsEditing("view");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                  className="w-5 h-5 text-klintoRed flex-shrink-0"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </button>

              <button
                onClick={() => {
                  setShowPerinatal(true);
                  setIsEditing("edit");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                  className="w-5 h-5 text-klintoRed flex-shrink-0"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setShowPerinatal(true);
                setIsEditing("create");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
                className="w-5 h-5 text-klintoRed flex-shrink-0"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-start border border-klintoRed flex items-center justify-between flex-1">
          <p>Antecedentes psicomotores</p>
          {hasHistoryData(psychomotorHistory, PSYCHOMOTOR_FIELDS) ? (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowPsychomotor(true);
                  setIsEditing("view");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                  className="w-5 h-5 text-klintoRed flex-shrink-0"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </button>

              <button
                onClick={() => {
                  setShowPsychomotor(true);
                  setIsEditing("edit");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                  className="w-5 h-5 text-klintoRed flex-shrink-0"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setShowPsychomotor(true);
                setIsEditing("create");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
                className="w-5 h-5 text-klintoRed flex-shrink-0"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-start border border-klintoRed flex items-center justify-between flex-1 transition-transform duration-200 hover:scale-[1.02]">
          <p>Historial de enfermedades</p>
          <div className="flex gap-2">
            <button onClick={() => setShowDiseaseHistoryList(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
                className="w-5 h-5 text-klintoRed flex-shrink-0"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button>
            <button onClick={() => setShowDiseaseHistory(true)}>
              <svg
                className="w-5 h-5 text-klintoRed flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-start border border-klintoRed flex items-center justify-between flex-1 transition-transform duration-200 hover:scale-[1.02]">
          <p>Sustancias ingeridas por la madre</p>
          <div className="flex gap-2">
            <button onClick={() => setShowSubstanceHistoryList(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
                className="w-5 h-5 text-klintoRed flex-shrink-0"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button>
            <button onClick={() => setShowSubstanceHistory(true)}>
              <svg
                className="w-5 h-5 text-klintoRed flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patient;
