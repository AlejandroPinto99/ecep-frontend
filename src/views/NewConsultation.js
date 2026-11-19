import { useNavigate, useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ConsultationForm } from "../components/ConsultationForm/ConsultationForm";
import { useGetPatientById } from "../hooks/useGetPatients";
import { useCreateConsulta } from "../hooks/consultas/useCreateConsulta";

const NewConsultation = () => {
  const { id: patient_id } = useParams();
  const navigate = useNavigate();

  const { data: patient } = useGetPatientById({ patient_id });
  const { mutate: createConsulta, isPending } = useCreateConsulta();

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

      <ConsultationForm
        fechaNacimiento={patient?.fecha_nacimiento}
        onSubmit={onSubmit} isPending={isPending}
      />
    </div>
  );
};

export default NewConsultation;
