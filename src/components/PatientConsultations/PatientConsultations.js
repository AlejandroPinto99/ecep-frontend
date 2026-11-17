import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BasicTable from "../Table/BasicTable";
import { RowMenu } from "../RowMenu/RowMenu";
import { Pagination } from "../Pagination/Pagination";
import { useGetConsultasByPatientId } from "../../hooks/consultas/useGetConsultas";
import { formatDate } from "../../helpers/date";

const PAGE_SIZE = 5;

// Tabla con las consultas de un paciente, la más reciente primero
export const PatientConsultations = ({ patient_id }) => {
  const [page, setPage] = useState(1);
  const [rowSelected, setRowSelected] = useState(null);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetConsultasByPatientId({
    patient_id,
    page,
    limit: PAGE_SIZE,
  });

  const columns = [
    {
      accessorKey: "fecha_consulta",
      header: "Fecha",
      cell: ({ cell }) => (
        <div className="px-4 text-center">
          {formatDate(cell.row.original.fecha_consulta)}
        </div>
      ),
    },
    {
      accessorKey: "motivo_consulta",
      header: "Motivo de consulta",
      cell: ({ cell }) => (
        <div className="px-4 text-center truncate max-w-md mx-auto">
          {cell.row.original.motivo_consulta}
        </div>
      ),
    },
    {
      accessorKey: "diagnostico",
      header: "Diagnóstico",
      cell: ({ cell }) => (
        <div className="px-4 text-center truncate max-w-md mx-auto">
          {cell.row.original.diagnostico || (
            <span className="text-gray-400">Sin diagnóstico</span>
          )}
        </div>
      ),
    },
    {
      header: "   ",
      cell: ({ cell }) => {
        const id = cell.row.original.id_consulta;
        return (
          <RowMenu
            options={[
              {
                name: "Ver detalle",
                action: () => navigate(`/consultas/${id}`),
              },
              {
                name: "Editar",
                action: () => navigate(`/consultas/${id}/editar`),
              },
            ]}
            isOpen={rowSelected === id}
            onSelect={() => setRowSelected(rowSelected === id ? null : id)}
            onClose={() => setRowSelected(null)}
          />
        );
      },
    },
  ];

  let content;
  if (isLoading) {
    content = <p className="text-gray-500">Cargando consultas...</p>;
  } else if (isError) {
    content = <p className="text-red-600">No se pudieron cargar las consultas.</p>;
  } else if (!data?.data?.length) {
    content = (
      <p className="text-gray-500">Este paciente aún no tiene consultas registradas.</p>
    );
  } else {
    content = (
      <div className="flex flex-col items-center w-full space-y-2">
        <BasicTable tableColumns={columns} tableData={data.data} />
        {data.pagination.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.pagination.totalPages}
            setPage={setPage}
          />
        )}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border-klintoRed border w-full mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Consultas del paciente</h2>
        {data?.pagination?.total > 0 && (
          <span className="text-sm text-gray-500">
            {data.pagination.total}{" "}
            {data.pagination.total === 1 ? "consulta" : "consultas"}
          </span>
        )}
      </div>
      {content}
    </div>
  );
};
