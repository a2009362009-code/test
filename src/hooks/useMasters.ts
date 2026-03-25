import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { mapBarbersToMasters } from "@/lib/masters";
import { masters as fallbackMasters } from "@/data/masters";
import { USE_MOCK_API } from "@/lib/config";

export function useMasters() {
  const query = useQuery({
    queryKey: ["barbers"],
    queryFn: api.getBarbers,
    retry: 1,
  });

  const masters = useMemo(() => {
    if (!query.data?.length && USE_MOCK_API) {
      return fallbackMasters;
    }
    return mapBarbersToMasters(query.data || []);
  }, [query.data]);

  return {
    ...query,
    masters,
  };
}
