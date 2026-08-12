import api from "./api";

/*
|--------------------------------------------------------------------------
| Reviews API Service
|--------------------------------------------------------------------------
| DIGITECH V2
| Backend:
| GET    /api/reviews
| GET    /api/reviews/{id}
| PUT    /api/reviews/{id}
| DELETE /api/reviews/{id}
|
| NOTE: AI reply generation no longer goes through this service.
| POST /reviews/{id}/reply has been removed — it returned 401 and is no
| longer used. AI replies are now generated via the streaming chat gateway
| (see src/services/chatService.js + src/hooks/useChatStream.js), consumed
| directly from src/components/reviews/ReplyDrawer.jsx.
|--------------------------------------------------------------------------
*/

const mapReview = (review) => ({
  id: review.id,
  customerName: review.customerName ?? review.name ?? "",
  company: review.company ?? "",
  email: review.email ?? "",
  phone: review.phone ?? "",
  source: review.source ?? "Google",
  rating: review.rating ?? 5,
  review: review.review ?? review.reviewText ?? "",
  date: review.date ?? review.createdAt ?? "",
  sentiment: review.sentiment ?? "neutral",
  status: review.status ?? "New",
  agent: review.agent ?? null,
  aiReply: review.aiReply ?? "",
});

export async function getReviews() {
  const { data } = await api.get("/reviews");

  if (!Array.isArray(data)) return [];

  return data.map(mapReview);
}

export async function getReview(id) {
  const { data } = await api.get(`/reviews/${id}`);

  return mapReview(data);
}

export async function publishReply(reviewId, reply) {
  const { data } = await api.put(`/reviews/${reviewId}`, {
    aiReply: reply,
  });

  return data;
}

export const generateReviewReply = async (reviewId, payload) => (await api.post(`/reviews/${reviewId}/generate`, payload)).data
export const saveReviewReplyDraft = async (reviewId, payload) => (await api.post(`/reviews/${reviewId}/draft`, payload)).data
export const publishReviewReply = async (reviewId) => (await api.post(`/reviews/${reviewId}/publish`)).data
export const getReviewReply = async (reviewId) => (await api.get(`/reviews/${reviewId}/reply`)).data

export async function updateReview(reviewId, payload) {
  const { data } = await api.put(`/reviews/${reviewId}`, payload);

  return data;
}

export async function deleteReview(reviewId) {
  await api.delete(`/reviews/${reviewId}`);

  return true;
}

const reviewService = {
  getReviews,
  getReview,
  publishReply,
  updateReview,
  deleteReview,
  generateReviewReply,
  saveReviewReplyDraft,
  publishReviewReply,
  getReviewReply,
};

export default reviewService;
