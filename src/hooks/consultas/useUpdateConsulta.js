import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateConsulta } from "../../queries/consultas";

export const useUpdateConsulta = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ consulta_id, consultaData }) => updateConsulta({ consulta_id, consultaData }),
        onSuccess: () => {
            // Todo lo que muestra datos de consultas: listas, detalle y curvas de crecimiento
            queryClient.invalidateQueries({ queryKey: ['consultas'] });
            queryClient.invalidateQueries({ queryKey: ['consulta'] });
            queryClient.invalidateQueries({ queryKey: ['curvaCrecimiento'] });
        },
    });
};
