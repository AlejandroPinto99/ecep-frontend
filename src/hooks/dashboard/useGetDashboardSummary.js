import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "../../queries/dashboard";

export const useGetDashboardSummary = ({ fecha }) => {
    return useQuery({
        // Empieza con 'consultas' para que se invalide al crear/editar una consulta
        queryKey: ['consultas', 'dashboard', fecha],
        queryFn: () => getDashboardSummary({ fecha }),
        staleTime: 1000 * 60, // 1 minuto: son contadores del día
        refetchOnWindowFocus: true,
    });
};
