import { useQuery } from "@tanstack/react-query";
import { getPsychomotorByPatientId, getPsychomotorHistoryParameters } from "../../queries/pyscomotor";

export const useGetPsychomotorHistory = ({ patient_id }) => {
    return useQuery({
        queryKey: ['psychomotorHistory', patient_id],
        queryFn: () => getPsychomotorByPatientId({ patient_id }),
        staleTime: 0, // Los datos son válidos por 5 minutos
        refetchOnWindowFocus: false, // Evita recargar datos al enfocar la ventana
        refetchOnMount: true,
    });
};

export const useGetPsychomotorHistoryParameters = ({ evaluacion_id }) => {
    return useQuery({
        queryKey: ['psychomotorHistory', evaluacion_id],
        queryFn: () => getPsychomotorHistoryParameters({ evaluacion_id }),
        enabled: !!evaluacion_id,
        staleTime: 1000 * 60 * 5, // Los datos son válidos por 5 minutos
        refetchOnWindowFocus: false, // Evita recargar datos al enfocar la ventana
    });
};