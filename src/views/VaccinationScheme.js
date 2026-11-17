import { useParams, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useGetPatientById } from "../hooks/useGetPatients";
import { VaccinationSchedule } from "../components/Vaccination/VaccinationSchedule";

// Pantalla del esquema de vacunación de un paciente: /pacientes/:id/esquemavacunas
const VaccinationScheme = () => {
  const { id } = useParams();
  const { data: patient, isError } = useGetPatientById({ patient_id: id });

  if (isError) {
    return <div className="p-8 w-full">No se encontró el paciente.</div>;
  }
  if (!patient) {
    return <div className="p-8 w-full">Cargando...</div>;
  }

  const patientName = [
    patient.primer_nombre,
    patient.segundo_nombre,
    patient.tercer_nombre,
    patient.primer_apellido,
    patient.segundo_apellido,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="p-8 w-full">
      <ToastContainer />
      <div className="mb-6">
        <Link
          to={`/pacientes/${patient.id_paciente}`}
          className="text-sm text-klintoRed hover:underline"
        >
          ← Volver al paciente
        </Link>
        <h1 className="text-2xl font-bold mt-2">Esquema de vacunación</h1>
        <p className="text-gray-600 mt-1">Paciente: {patientName}</p>
      </div>

      <VaccinationSchedule
        patient_id={patient.id_paciente}
        birthDate={patient.fecha_nacimiento}
      />
    </div>
  );
};

export default VaccinationScheme;
