import { useQuery } from "@tanstack/react-query";
import { getBusinesses } from "../services/businessService";

export default function useBusinesses() {
  return useQuery({
    queryKey: ["businesses"],
    queryFn: getBusinesses,
  });
}