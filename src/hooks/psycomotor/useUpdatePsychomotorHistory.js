import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePsychomotorHistory } from '../../queries/pyscomotor';

export const useUpdatePsychomotorHistory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ patient_id, psychomotorData }) => {
            if(!patient_id) return;
            return updatePsychomotorHistory({ patient_id, psychomotorData })
        },
        onSuccess: () => {
        // Actualiza la cache de React Query para que los datos estén sincronizados
        queryClient.invalidateQueries(['psychomotorHistory']);
        },
    });
};
