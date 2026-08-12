import { useQuery } from "@tanstack/react-query";
import { getReviews } from "../services/reviewService";

export default function useReviews(filters = {}) {
  return useQuery({
    queryKey: ["reviews", filters],
    queryFn: () => getReviews(filters),
  });
}