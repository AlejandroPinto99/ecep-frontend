import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPatient } from "../queries/patients";

export const useCreatePatient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ patientData }) => createPatient({ patientData }),
        onSuccess: () => {
        // Actualiza la cache de React Query para que los datos estén sincronizados
        queryClient.invalidateQueries(['pacientes']);
        },
    });
};
