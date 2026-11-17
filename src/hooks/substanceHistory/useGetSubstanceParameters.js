import { useQuery } from "@tanstack/react-query";
import { getSubstanceParameters } from "../../queries/substanceHistory";

export const useGetSubstanceParameters = () => {
    return useQuery({
        queryKey: ['substanceParameters'],
        queryFn: () => getSubstanceParameters(),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
};
