import { useNavigate, useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ConsultationForm } from "../components/ConsultationForm/ConsultationForm";
import { useGetConsultaById } from "../hooks/consultas/useGetConsultas";
import { useUpdateConsulta } from "../hooks/consultas/useUpdateConsulta";
import { formatDate } from "../helpers/date";

// /consultas/:id/editar
const EditConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: consulta, isError } = useGetConsultaById({ consulta_id: id });
  const { mutate: updateConsulta, isPending } = useUpdateConsulta();

  if (isError) {
    return <div className="p-8 w-full">No se encontró la consulta.</div>;
  }
  if (!consulta) {
    return <div className="p-8 w-full">Cargando...</div>;
  }

  const onSubmit = (consultaData) => {
    updateConsulta(
      { consulta_id: id, consultaData },
      {
        onSuccess: () => {
          navigate(`/consultas/${id}`, { state: { updated: true } });
        },
        onError: (error) => {
          toast.error(
            typeof error.response?.data === "string"
              ? error.response.data
              : "No se pudo actualizar la consulta",
          );
        },
      },
    );
  };

  return (
    <div className="p-8 w-full">
      <ToastContainer />
      <div className="mb-6">
        <Link to={`/consultas/${id}`} className="text-sm text-klintoRed hover:underline">
          ← Volver a la consulta
        </Link>
        <h1 className="text-2xl font-bold mt-2">Editar consulta</h1>
        <p className="text-gray-600 mt-1">
          Paciente: {consulta.nombre_paciente} · Consulta del{" "}
          {formatDate(consulta.datos_consulta.fecha_consulta)}
        </p>
      </div>

      {/* key: si cambia la consulta, el formulario se vuelve a montar con sus datos */}
      <ConsultationForm
        key={consulta.id_consulta}
        initialData={consulta}
        // La edad se calcula a la fecha de la consulta (la que tenía o la nueva)
        fechaNacimiento={consulta.fecha_nacimiento_paciente}
        onSubmit={onSubmit}
        isPending={isPending}
        submitLabel="Guardar cambios"
      />
    </div>
  );
};

export default EditConsultation;
