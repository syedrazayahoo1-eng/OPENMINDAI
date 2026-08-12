import api from "./api";

export const generateReply = async (payload) => {
  const { data } = await api.post("/ai/generate-reply", payload);

  return data;
};

export const improveReply = async (payload) => {
  const { data } = await api.post("/ai/improve-reply", payload);

  return data;
};

export const translateReply = async (payload) => {
  const { data } = await api.post("/ai/translate", payload);

  return data;
};

export const summarizeReviews = async (payload) => {
  const { data } = await api.post("/ai/summarize", payload);

  return data;
};

export const analyzeSentiment = async (payload) => {
  const { data } = await api.post("/ai/sentiment", payload);

  return data;
};

export const generateInsights = async () => {
  const { data } = await api.get("/ai/insights");

  return data;
};