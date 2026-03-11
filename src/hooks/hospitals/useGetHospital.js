import { useQuery } from "@tanstack/react-query";
import { getHospitals } from "../../queries/hospitals";

export const useGetHospitals = () => {
    return useQuery({
        queryKey: ['hospital'],
        queryFn: () => getHospitals(),
        staleTime: 1000 * 60 * 5, // Los datos son válidos por 5 minutos
        refetchOnWindowFocus: false, // Evita recargar datos al enfocar la ventana
    });
};

// export const useGetLoanById = ({ loan_id }) => {
//     return useQuery({
//         queryKey: ['loan', loan_id],
//         queryFn: () => getLoanById({ loan_id }),
//         staleTime: 1000 * 60 * 5, // Los datos son válidos por 5 minutos
//         refetchOnWindowFocus: false, // Evita recargar datos al enfocar la ventana
//     });
// };