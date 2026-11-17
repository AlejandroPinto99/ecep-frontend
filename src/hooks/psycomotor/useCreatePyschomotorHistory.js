import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPsychomotorHistory } from "../../queries/pyscomotor";

export const useCreatePsychomotorHistory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ psychomotorData }) => createPsychomotorHistory({ psychomotorData }),
        onSuccess: () => {
        // Actualiza la cache de React Query para que los datos estén sincronizados
        queryClient.invalidateQueries(['psychomotorHistory']);
        },
    });
};
