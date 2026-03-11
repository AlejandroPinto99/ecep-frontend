import { useQuery } from "@tanstack/react-query";
import { getPsychomotorParameters } from "../../queries/pyscomotor";

export const useGetPsychomotorParameters = () => {
    return useQuery({
        queryKey: ['psychomotorParameters'],
        queryFn: () => getPsychomotorParameters(),
        staleTime: 1000 * 60 * 5, // Los datos son válidos por 5 minutos
        refetchOnWindowFocus: false, // Evita recargar datos al enfocar la ventana
    });
};