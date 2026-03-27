import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { mapApiProductsToProducts } from "@/lib/products";

export function useProducts() {
  const query = useQuery({
    queryKey: ["products"],
    queryFn: api.getProducts,
    retry: 1,
  });

  const products = useMemo(() => {
    return mapApiProductsToProducts(query.data || []);
  }, [query.data]);

  return {
    ...query,
    products,
    isFallback: false,
  };
}
