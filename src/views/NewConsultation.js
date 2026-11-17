import { useNavigate, useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ConsultationForm } from "../components/ConsultationForm/ConsultationForm";
import { useGetPatientById } from "../hooks/useGetPatients";
import { useCreateConsulta } from "../hooks/consultas/useCreateConsulta";

// Meses cumplidos a hoy (mismo criterio que TIMESTAMPDIFF(MONTH) en la API).
// Se leen año/mes/día del texto "YYYY-MM-DD" para que la zona horaria no
// corra la fecha al día anterior.
const ageInMonths = (birthDate) => {
  const [year, month, day] = String(birthDate).slice(0, 10).split("-").map(Number);
  const now = new Date();
  let months = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
  if (now.getDate() < day) months -= 1;
  return Math.max(months, 0);
};

const NewConsultation = () => {
  const { id: patient_id } = useParams();
  const navigate = useNavigate();

  const { data: patient } = useGetPatientById({ patient_id });
  const { mutate: createConsulta, isPending } = useCreateConsulta();

  // Solo informativa: la API calcula y guarda la edad por su cuenta
  const edadMeses = patient?.fecha_nacimiento ? ageInMonths(patient.fecha_nacimiento) : null;

  const onSubmit = (consultaData) => {
    createConsulta(
      { consultaData: { id_paciente: Number(patient_id), ...consultaData } },
      {
        onSuccess: (consulta) => {
          navigate(`/consultas/${consulta.id_consulta}`, {
            state: { created: true },
          });
        },
        onError: (error) => {
          toast.error(
            typeof error.response?.data === "string"
              ? error.response.data
              : "No se pudo guardar la consulta",
          );
        },
      },
    );
  };

  const patientName = patient
    ? [
        patient.primer_nombre,
        patient.segundo_nombre,
        patient.tercer_nombre,
        patient.primer_apellido,
        patient.segundo_apellido,
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  return (
    <div className="p-8 w-full">
      <ToastContainer />
      <div className="mb-6">
        <Link to={`/pacientes/${patient_id}`} className="text-sm text-klintoRed hover:underline">
          ← Volver al paciente
        </Link>
        <h1 className="text-2xl font-bold mt-2">Nueva consulta</h1>
        {patientName && <p className="text-gray-600 mt-1">Paciente: {patientName}</p>}
      </div>

      <ConsultationForm edadMeses={edadMeses} onSubmit={onSubmit} isPending={isPending} />
    </div>
  );
};

export default NewConsultation;
