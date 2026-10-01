
import { useGetPatients } from "../hooks/useGetPatients";
import { useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid";

import BasicTable from "../components/Table/BasicTable";
import Modal from "../components/Modal/Modal";

import { AddPatient } from "../components/ModalViews/AddPatients";
import { RowMenu } from "../components/RowMenu/RowMenu";

import { Pagination } from "../components/Pagination/Pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDate } from "../helpers/date";

export const Appointments = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [rowSelected, setRowSelected] = useState(null);
  const debouncedValue = useDebounce(search, 500);
  const [isOpenModal, setOpenModal] = useState(false);
  const { data } = useGetPatients({
    page: page,
    search: debouncedValue,
  });
 const navigate = useNavigate();

  const columns = [
    {
      accessorKey: "id_paciente",
      header: "id",
    },
    {
      accessorKey: "primer_nombre",
      header: "Nombres",
      cell: ({ cell }) => {
        return (
          <div className="px-4 text-center">
            {cell.row.original.primer_nombre +
              " " +
              cell.row.original.segundo_nombre +
              " " +
              cell.row.original.tercer_nombre}
          </div>
        );
      },
    },
    {
      accessorKey: "primer_apellido",
      header: "Apellidos",
      cell: ({ cell }) => {
        return (
          <div className="px-4 text-center">
            {cell.row.original.primer_apellido +
              " " +
              cell.row.original.segundo_apellido +
              " " +
              cell.row.original.tercer_apellido}
          </div>
        );
      },
    },
    {
      accessorKey: "fecha_nacimiento",
      header: "Fecha de nacimiento",
      cell: ({ cell }) => {
        return (
          <div className="px-4 text-center">
            {formatDate(cell.row.original.fecha_nacimiento)}
          </div>
        );
      },
    },
    {
      header: "   ",
      cell: ({ cell }) => {
        return (
          <RowMenu
            options={[
              {
                name: "Detalle",
                action: () => navigate(`/pacientes/${cell.row.original.id_paciente}`),
              },
              {
                name: "Editar",
                action: () => {
                  setIsEditing(cell.row.original.id_paciente);
                  setOpenModal(true);
                },
              }
            ]}
            isOpen={rowSelected === cell.row.original.id_paciente}
            onSelect={() => {
              if (rowSelected === cell.row.original.id_paciente) {
                setRowSelected(null);
              } else {
                setRowSelected(cell.row.original.id_paciente);
              }
            }}
          />
        );
      },
    },
  ];

  const notifyCreationSuccess = () =>
    toast.success("Paciente registrado con éxito!");
  const notifyUpdateSuccess = () =>
    toast.success("Paciente actualizado con éxito!");

  return (
    <div className="p-8 w-full">
      <ToastContainer />
      <Modal
        isOpen={isOpenModal}
        onClose={() => setOpenModal(false)}
        title={
          isEditing !== null ? "Editar pacientes" : "Paciente de primera vez"
        }
      >
        <AddPatient
          isEditing={isEditing}
          setIsOpen={() => setOpenModal(false)}
          onSuccess={
            isEditing
              ? () => notifyUpdateSuccess()
              : () => notifyCreationSuccess()
          }
        />
      </Modal>
      <h3 className="font-bold text-2xl mb-12">Pacientes</h3>
      <div className="flex items-center justify-between mb-4">
        <div className="w-1/2 relative">
          <MagnifyingGlassIcon className="absolute h-4 w-4 top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          <input
            name="search"
            className="pl-12 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar paciente..."
            autoComplete="off"
            onChange={(e) => setSearch(e.target.value)}
          ></input>
        </div>
        <button
          className="bg-klintoRed hover:bg-opacity-80 text-white rounded-lg py-2 px-4 flex items-center space-x-2"
          type="button"
          onClick={() => {
            setIsEditing(null);
            setOpenModal(true);
          }}
        >
          <PlusIcon className="h-6 w-6 font-bold" />
          <p>Nuevo paciente</p>
        </button>
      </div>
      <div className="flex justify-center w-full">
        {data?.data?.length > 0 && (
          <div className="flex flex-col items-center w-full space-y-2">
            <BasicTable tableColumns={columns} tableData={data.data} />
            <Pagination
              currentPage={page}
              totalPages={data?.pagination?.totalPages}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};
