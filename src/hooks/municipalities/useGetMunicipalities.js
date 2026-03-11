import { useQuery } from "@tanstack/react-query";
import { getMunicipalities } from "../../queries/municipalities";

export const useGetMunicipalities = ({ departamento_id }) => {
  return useQuery({
    queryKey: ["municipalities", departamento_id],
    queryFn: () => getMunicipalities(departamento_id),
    enabled: !!departamento_id,
    staleTime: 1000 * 60 * 5, // Los datos son válidos por 5 minutos
    refetchOnWindowFocus: false, // Evita recargar datos al enfocar la ventana
  });
};
