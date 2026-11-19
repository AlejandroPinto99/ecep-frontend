import {
  ClipboardDocumentListIcon,
  UserGroupIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";

import { useGetDashboardSummary } from "../hooks/dashboard/useGetDashboardSummary";

// Fecha local del navegador como YYYY-MM-DD
const fechaLocal = (d) => {
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
};

const capitalizar = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

const StatCard = ({ title, subtitle, value, Icon, isLoading, isError }) => (
  <div className="bg-white border rounded-lg shadow-sm p-6 flex items-start justify-between">
    <div>
      <p className="text-gray-500 font-medium">{title}</p>
      <p className="text-4xl font-bold mt-2">
        {isError ? "—" : isLoading ? "…" : value}
      </p>
      <p className="text-sm text-gray-500 mt-2">
        {isError ? "No se pudo cargar el dato" : subtitle}
      </p>
    </div>
    <div className="bg-klintoRed bg-opacity-20 text-klintoRed rounded-full p-3">
      <Icon className="h-6 w-6" />
    </div>
  </div>
);

export const Dashboard = () => {
  const hoy = new Date();
  const fecha = fechaLocal(hoy);
  const { data, isLoading, isError } = useGetDashboardSummary({ fecha });

  const mesActual = capitalizar(
    hoy.toLocaleDateString("es", { month: "long", year: "numeric" }),
  );
  const diaActual = hoy.toLocaleDateString("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="p-8 w-full">
      <h3 className="font-bold text-2xl mb-12">Dashboard</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl">
        <StatCard
          title="Pacientes nuevos vistos este mes"
          subtitle={mesActual}
          value={data?.pacientes_nuevos_mes}
          Icon={UserPlusIcon}
          isLoading={isLoading}
          isError={isError}
        />
        <StatCard
          title="Consultas realizadas este mes"
          subtitle={mesActual}
          value={data?.consultas_mes}
          Icon={ClipboardDocumentListIcon}
          isLoading={isLoading}
          isError={isError}
        />
        <StatCard
          title="Pacientes vistos hoy"
          subtitle={capitalizar(diaActual)}
          value={data?.pacientes_hoy}
          Icon={UserGroupIcon}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </div>
  );
};
