import { useQuery } from "@tanstack/react-query";
import { getDiseaseHistoryByPatientId } from "../../queries/diseaseHistory";

export const useGetDiseaseHistory = ({ patient_id }) => {
    return useQuery({
        queryKey: ['diseaseHistory', patient_id],
        queryFn: () => getDiseaseHistoryByPatientId({ patient_id }),
        enabled: !!patient_id,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    });
};
