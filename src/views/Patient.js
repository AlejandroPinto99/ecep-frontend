import { useParams } from "react-router-dom";
import { useGetPatientById } from "../hooks/useGetPatients";
import { formatDate } from "../helpers/date";
import { PsychomotorHistory } from "../components/ModalViews/PsychomotorHistory";
import Modal from "../components/Modal/Modal";
import { useState } from "react";

const Patient = () => {
  const { id } = useParams();
  const { data } = useGetPatientById({ patient_id: id });
  const [showPsychomotor, setShowPsychomotor] = useState(false);

  if (!data) {
    return <div className="p-8 w-full">Cargando...</div>;
  }

  const fullName =
    `${data.primer_nombre} ${data.segundo_nombre || ""} ${data.tercer_nombre || ""} ${data.primer_apellido} ${data.segundo_apellido || ""} ${data.tercer_apellido || ""}`.trim();
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
      value: data.numero_contacto,
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

  return (
    <div className="p-8 w-fit">
        <Modal isOpen={showPsychomotor} onClose={() => setShowPsychomotor(false)}>
        <PsychomotorHistory />
      </Modal>
      <h1 className="text-2xl font-bold mb-6">Información del Paciente</h1>
      <div className="bg-white shadow-md rounded-lg p-6 border-klintoRed border">
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
        <div className="mx-2 h-0.5 my-2 bg-klintoRed"></div>
        <div className="flex flex-col gap-6 mt-4">
          <button className="bg-white shadow-sm rounded-lg p-6 text-start border border-klintoRed flex items-center justify-between w-full transition-transform duration-200 hover:scale-[1.02]">
            <p>Antecedentes perinatales</p>
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <button
          className="bg-white shadow-sm rounded-lg p-6 text-start border border-klintoRed flex items-center justify-between w-full transition-transform duration-200 hover:scale-[1.02]"
          onClick={() => setShowPsychomotor(true)}
          >
            <p>Antecedentes psicomotores</p>
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <button className="bg-white shadow-sm rounded-lg p-6 text-start border border-klintoRed flex items-center justify-between w-full transition-transform duration-200 hover:scale-[1.02]">
            <p>Historial de enfermedades</p>
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Patient;
