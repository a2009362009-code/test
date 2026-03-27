import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { mapApiSalonsToSalons } from "@/lib/salons";

export function useSalons() {
  const query = useQuery({
    queryKey: ["salons"],
    queryFn: api.getSalons,
    retry: 1,
  });

  const salons = useMemo(() => {
    return mapApiSalonsToSalons(query.data || []);
  }, [query.data]);

  return {
    ...query,
    salons,
    isFallback: false,
  };
}
