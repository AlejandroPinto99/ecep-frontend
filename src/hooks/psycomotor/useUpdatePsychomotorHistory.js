import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePsychomotorParameters } from '../../queries/pyscomotor';

export const useUpdatePsychomotorHistory = ({ evaluation_id }) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ evaluation_id, psychomotorData }) => {
            if(!evaluation_id) return;
            return updatePsychomotorParameters({ evaluation_id, psychomotorData })
        },
        onSuccess: () => {
        // Actualiza la cache de React Query para que los datos estén sincronizados
        queryClient.invalidateQueries(['antecedentes_psicomotores', evaluation_id]);
        },
    });
};
