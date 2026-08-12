import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../services/dashboardService";

export default function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardStats,
  });
}