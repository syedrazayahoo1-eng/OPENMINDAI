import api from "./api";

export const getBusinesses = async () => {
  const { data } = await api.get("/businesses");

  return data;
};

export const getBusiness = async (id) => {
  const { data } = await api.get(`/businesses/${id}`);

  return data;
};

export const createBusiness = async (payload) => {
  const { data } = await api.post("/businesses", payload);

  return data;
};

export const updateBusiness = async (id, payload) => {
  const { data } = await api.put(`/businesses/${id}`, payload);

  return data;
};

export const deleteBusiness = async (id) => {
  const { data } = await api.delete(`/businesses/${id}`);

  return data;
};

export const syncGoogleBusiness = async (id) => {
  const { data } = await api.post(`/businesses/${id}/sync`);

  return data;
};