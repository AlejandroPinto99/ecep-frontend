import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePatient } from '../queries/patients';

export const useUpdatePatientById = ({ patient_id }) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ patient_id, patientData }) => {
            if(!patient_id) return;
            return updatePatient({ patient_id, patientData })
        },
        onSuccess: () => {
        // Actualiza la cache de React Query para que los datos estén sincronizados
        queryClient.invalidateQueries(['pacientes', patient_id]);
        },
    });
};
