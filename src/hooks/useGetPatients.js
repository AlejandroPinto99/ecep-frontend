import { getPatients, getPatientById } from "../queries/patients";
import { useQuery } from "@tanstack/react-query";

export const useGetPatients = ({ page, search }) => {
    return useQuery({
        queryKey: ['patients', page, search],
        queryFn: () => getPatients({ page, search }),
        staleTime: 1000 * 60 * 5, // Los datos son válidos por 5 minutos
        refetchOnWindowFocus: false, // Evita recargar datos al enfocar la ventana
    });
};

export const useGetPatientById = ({ patient_id }) => {
    return useQuery({
        queryKey: ['patient', patient_id],
        queryFn: () => getPatientById({ patient_id }),
        staleTime: 1000 * 60 * 5, // Los datos son válidos por 5 minutos
        refetchOnWindowFocus: false, // Evita recargar datos al enfocar la ventana
    });
};