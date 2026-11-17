import { useQuery } from "@tanstack/react-query";
import { getLabExamParameters } from "../../queries/consultas";

// Catálogo de tipos de examen de laboratorio: cambia muy poco
export const useGetLabExamParameters = () => {
    return useQuery({
        queryKey: ['labExamParameters'],
        queryFn: getLabExamParameters,
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
    });
};
