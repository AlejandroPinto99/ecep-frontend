import { useQuery } from "@tanstack/react-query";
import { getSubstanceHistoryByPatientId } from "../../queries/substanceHistory";

export const useGetSubstanceHistory = ({ patient_id }) => {
    return useQuery({
        queryKey: ['substanceHistory', patient_id],
        queryFn: () => getSubstanceHistoryByPatientId({ patient_id }),
        enabled: !!patient_id,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    });
};
