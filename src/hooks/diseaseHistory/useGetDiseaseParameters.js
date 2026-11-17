import { useQuery } from "@tanstack/react-query";
import { getDiseaseParameters } from "../../queries/diseaseHistory";

export const useGetDiseaseParameters = () => {
    return useQuery({
        queryKey: ['diseaseParameters'],
        queryFn: () => getDiseaseParameters(),
        staleTime: 1000 * 60 * 5, // Los datos son válidos por 5 minutos
        refetchOnWindowFocus: false, // Evita recargar datos al enfocar la ventana
    });
};
