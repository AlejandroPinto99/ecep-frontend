import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConsulta } from "../../queries/consultas";

export const useCreateConsulta = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ consultaData }) => createConsulta({ consultaData }),
        onSuccess: () => {
            // La lista de consultas debe mostrar la nueva
            queryClient.invalidateQueries({ queryKey: ['consultas'] });
        },
    });
};
