import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePerinatalHistory } from '../../queries/perinatal';

export const useUpdatePerinatalHistory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ patient_id, perinatalData }) => {
            if(!patient_id) return;
            return updatePerinatalHistory({ patient_id, perinatalData })
        },
        onSuccess: () => {
        // Actualiza la cache de React Query para que los datos estén sincronizados
        queryClient.invalidateQueries(['perinatalHistory']);
        },
    });
};
