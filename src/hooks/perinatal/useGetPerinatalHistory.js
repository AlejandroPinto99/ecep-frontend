import { useQuery } from "@tanstack/react-query";
import { getPerinatalHistoryByPatientId } from "../../queries/perinatal";

export const useGetPerinatalHistory = ({ patient_id }) => {
    return useQuery({
        queryKey: ['perinatalHistory', patient_id],
        queryFn: () => getPerinatalHistoryByPatientId({ patient_id }),
        staleTime: 0, // Los datos son válidos por 5 minutos
        refetchOnWindowFocus: false, // Evita recargar datos al enfocar la ventana
        refetchOnMount: true,
    });
};
