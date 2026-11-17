import { useQuery } from "@tanstack/react-query";
import { getConsultas, getConsultaById, getConsultasByPatientId } from "../../queries/consultas";

export const useGetConsultas = ({ page, search }) => {
    return useQuery({
        queryKey: ['consultas', page, search],
        queryFn: () => getConsultas({ page, search }),
        staleTime: 1000 * 60 * 5, // Los datos son válidos por 5 minutos
        refetchOnWindowFocus: false,
    });
};

export const useGetConsultasByPatientId = ({ patient_id, page, limit }) => {
    return useQuery({
        // Empieza con 'consultas' para que se invalide al crear una consulta
        queryKey: ['consultas', 'paciente', patient_id, page, limit],
        queryFn: () => getConsultasByPatientId({ patient_id, page, limit }),
        enabled: !!patient_id,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
};

export const useGetConsultaById =({ consulta_id }) => {
    return useQuery({
        queryKey: ['consulta', consulta_id],
        queryFn: () => getConsultaById({ consulta_id }),
        enabled: !!consulta_id,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
};
