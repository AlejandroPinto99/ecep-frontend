import { useGetSubstanceHistory } from "../../hooks/substanceHistory/useGetSubstanceHistory";

export const SubstanceHistoryList = ({ patient_id }) => {
  const { data: substanceHistory, isLoading } = useGetSubstanceHistory({
    patient_id,
  });

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (!substanceHistory || substanceHistory.length === 0) {
    return <p>Este paciente no tiene sustancias registradas.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-klintoRed">
            <th className="py-2 pr-2">Sustancia</th>
            <th className="py-2 pr-2">Trimestre</th>
            <th className="py-2 pr-2">Notas</th>
          </tr>
        </thead>
        <tbody>
          {substanceHistory.map((item, index) => (
            <tr
              key={`${item.sustancia}-${index}`}
              className={`${index % 2 ? "bg-klintoRed bg-opacity-20" : "bg-white"}`}
            >
              <td className="py-2 pr-2">{item.sustancia}</td>
              <td className="py-2 pr-2">
                {item.trimestre ? `${item.trimestre}` : "No especificado"}
              </td>
              <td className="py-2 pr-2">{item.notas || "No especificado"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
