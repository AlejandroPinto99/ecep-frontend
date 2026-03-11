import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "../../queries/departments";

export const useGetDepartments = () => {
    return useQuery({
        queryKey: ['departments'],
        queryFn: () => getDepartments(),
        staleTime: 1000 * 60 * 5, // Los datos son válidos por 5 minutos
        refetchOnWindowFocus: false, // Evita recargar datos al enfocar la ventana
    });
};