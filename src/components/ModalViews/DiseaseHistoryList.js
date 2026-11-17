import { formatDate } from "../../helpers/date";
import { useGetDiseaseHistory } from "../../hooks/diseaseHistory/useGetDiseaseHistory";

export const DiseaseHistoryList = ({ patient_id }) => {
  const { data: diseaseHistory, isLoading } = useGetDiseaseHistory({
    patient_id,
  });

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (!diseaseHistory || diseaseHistory.length === 0) {
    return <p>Este paciente no tiene enfermedades registradas.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-klintoRed">
            <th className="py-2 pr-2">Enfermedad</th>
            <th className="py-2 pr-2">Fecha</th>
            <th className="py-2 pr-2">Observación</th>
          </tr>
        </thead>
        <tbody>
          {diseaseHistory.map((item, index) => (
            <tr
              key={item.id_historial}
              className={`${index % 2 ? "bg-klintoRed bg-opacity-20" : "bg-white"}`}
            >
              <td className="py-2 pr-2">{item.enfermedad}</td>
              <td className="py-2 pr-2">
                {item.fecha_diagnostico
                  ? formatDate(item.fecha_diagnostico)
                  : "No especificado"}
              </td>
              <td className="py-2 pr-2">
                {item.observacion || "No especificado"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
