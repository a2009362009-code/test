import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { mapBarbersToMasters } from "@/lib/masters";

export function useMasters() {
  const query = useQuery({
    queryKey: ["barbers"],
    queryFn: api.getBarbers,
    retry: 1,
  });

  const masters = useMemo(() => {
    return mapBarbersToMasters(query.data || []);
  }, [query.data]);

  return {
    ...query,
    masters,
    isFallback: false,
  };
}
