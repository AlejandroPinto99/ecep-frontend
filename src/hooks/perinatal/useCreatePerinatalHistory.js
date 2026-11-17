import { useMutation, useQueryClient } from "@tanstack/react-query";
import  { createPerinatalHistory } from '../../queries/perinatal';

export const useCreatePerinatalHistory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ perinatalData }) => createPerinatalHistory({ perinatalData }),
        onSuccess: () => {
        // Actualiza la cache de React Query para que los datos estén sincronizados
        queryClient.invalidateQueries(['perinatalHistory']);
        },
    });
};
