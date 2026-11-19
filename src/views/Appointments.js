import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

import { useGetConsultas } from "../hooks/consultas/useGetConsultas";
import useDebounce from "../hooks/useDebounce";
import BasicTable from "../components/Table/BasicTable";
import { RowMenu } from "../components/RowMenu/RowMenu";
import { Pagination } from "../components/Pagination/Pagination";
import { formatDate } from "../helpers/date";

export const Appointments = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [rowSelected, setRowSelected] = useState(null);
  const debouncedValue = useDebounce(search, 500);
  const navigate = useNavigate();

  const { data, isLoading } = useGetConsultas({
    page: page,
    search: debouncedValue,
  });

  const columns = [
    {
      accessorKey: "id_consulta",
      header: "id",
      cell: ({ cell }) => (
        <div className="px-4 text-left">{cell.row.original.id_consulta}</div>
      ),
    },
    {
      accessorKey: "nombre_paciente",
      header: "Nombre del paciente",
      cell: ({ cell }) => (
        <div className="px-4 text-left">
          {cell.row.original.nombre_paciente}
        </div>
      ),
    },
    {
      accessorKey: "fecha_consulta",
      header: "Fecha",
      cell: ({ cell }) => (
        <div className="px-4 text-left">
          {formatDate(cell.row.original.fecha_consulta)}
        </div>
      ),
    },
    {
      accessorKey: "motivo_consulta",
      header: "Motivo de consulta",
      cell: ({ cell }) => (
        <div className="px-4 text-left truncate max-w-md">
          {cell.row.original.motivo_consulta}
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

  return (
    <div className="p-8 w-full">
      <h3 className="font-bold text-2xl mb-12">Consultas</h3>
      <div className="flex items-center justify-between mb-4">
        <div className="w-1/2 relative">
          <MagnifyingGlassIcon className="absolute h-4 w-4 top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          <input
            name="search"
            className="pl-12 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar por paciente o motivo..."
            autoComplete="off"
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          ></input>
        </div>
      </div>
      <div className="flex justify-center w-full">
        {data?.data?.length > 0 ? (
          <div className="flex flex-col items-center w-full space-y-2">
            <BasicTable tableColumns={columns} tableData={data.data} />
            <Pagination
              currentPage={page}
              totalPages={data?.pagination?.totalPages}
              setPage={setPage}
            />
          </div>
        ) : (
          !isLoading && (
            <p className="text-gray-500 mt-8">No hay consultas registradas.</p>
          )
        )}
      </div>
    </div>
  );
};
