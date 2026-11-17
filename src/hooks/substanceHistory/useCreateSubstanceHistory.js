import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubstanceHistory } from "../../queries/substanceHistory";

export const useCreateSubstanceHistory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ substanceData }) => createSubstanceHistory({ substanceData }),
        onSuccess: () => {
        queryClient.invalidateQueries(['substanceHistory']);
        },
    });
};
