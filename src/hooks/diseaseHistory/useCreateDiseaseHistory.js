import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDiseaseHistory } from "../../queries/diseaseHistory";

export const useCreateDiseaseHistory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ diseaseData }) => createDiseaseHistory({ diseaseData }),
        onSuccess: () => {
        // Actualiza la cache de React Query para que los datos estén sincronizados
        queryClient.invalidateQueries(['diseaseHistory']);
        },
    });
};
