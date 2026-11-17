import { useQuery } from "@tanstack/react-query";
import { getRevisionParameters } from "../../queries/consultas";

// Catálogo de aspectos del examen físico: cambia muy poco
export const useGetRevisionParameters = () => {
    return useQuery({
        queryKey: ['revisionParameters'],
        queryFn: getRevisionParameters,
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
    });
};
