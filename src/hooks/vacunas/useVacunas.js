import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getVaccinationSchemes,
    getPatientVaccines,
    createVaccineApplication,
    deleteVaccineApplication,
} from "../../queries/vacunas";

export const useGetVaccinationSchemes = () => {
    return useQuery({
        queryKey: ['esquemasVacunacion'],
        queryFn: getVaccinationSchemes,
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
    });
};

export const useGetPatientVaccines = ({ patient_id, esquema }) => {
    return useQuery({
        queryKey: ['vacunas', patient_id, esquema],
        queryFn: () => getPatientVaccines({ patient_id, esquema }),
        enabled: !!patient_id,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
};

// Al marcar/desmarcar se recarga el esquema del paciente (los estados los calcula la API)
export const useCreateVaccineApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ applicationData }) => createVaccineApplication({ applicationData }),
        onSuccess: (_data, { applicationData }) => {
            queryClient.invalidateQueries({ queryKey: ['vacunas', applicationData.id_paciente] });
        },
    });
};

export const useDeleteVaccineApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id_aplicacion }) => deleteVaccineApplication({ id_aplicacion }),
        onSuccess: (_data, { patient_id }) => {
            queryClient.invalidateQueries({ queryKey: ['vacunas', patient_id] });
        },
    });
};
