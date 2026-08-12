import api from "./api";

export const getDashboardStats = async () => {
  const { data } = await api.get("/dashboard/stats");

  return data;
};

export const getRevenueAnalytics = async () => {
  const { data } = await api.get("/dashboard/revenue");

  return data;
};

export const getReviewAnalytics = async () => {
  const { data } = await api.get("/dashboard/reviews");

  return data;
};

export const getBusinesses = async () => {
  const { data } = await api.get("/businesses");

  return data;
};

export const getRecentActivity = async () => {
  const { data } = await api.get("/dashboard/activity");

  return data;
};