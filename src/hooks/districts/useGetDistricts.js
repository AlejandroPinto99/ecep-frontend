import { useQuery } from "@tanstack/react-query";
import { getDistricts } from "../../queries/districts";

export const useGetDistricts = ({ id_municipio } = {}) => {
    return useQuery({
        queryKey: ['districts', id_municipio ?? 'all'],
        queryFn: () => getDistricts(id_municipio),
        staleTime: 1000 * 60 * 5, // Los datos son válidos por 5 minutos
        refetchOnWindowFocus: false, // Evita recargar datos al enfocar la ventana
    });
};