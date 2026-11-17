import { useQuery } from "@tanstack/react-query";
import { getGrowthCurves } from "../../queries/consultas";

export const useGetGrowthCurves = ({ consulta_id }) => {
    return useQuery({
        queryKey: ['curvaCrecimiento', consulta_id],
        queryFn: () => getGrowthCurves({ consulta_id }),
        enabled: !!consulta_id,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
};
