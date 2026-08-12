import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import ReviewsHeader from "../components/reviews/ReviewsHeader";
import ReviewsSummary from "../components/reviews/ReviewsSummary";
import ReviewFilters from "../components/reviews/ReviewFilters";
import ReviewsTable from "../components/reviews/ReviewsTable";
import ReviewsAssistant from "../components/reviews/ReviewsAssistant";
import ReviewsAnalytics from "../components/reviews/ReviewsAnalytics";
import ReplyDrawer from "../components/reviews/ReplyDrawer";
import GoogleBusinessPosts from "../components/reviews/GoogleBusinessPosts";
import reviewService from "../services/reviewService";
import useLiveMonitoring from '../hooks/useLiveMonitoring'
import "../components/reviews/reviews.css";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    business: "All Locations",
    rating: "",
    source: "",
    status: "",
  });

  const [selectedReview, setSelectedReview] = useState(null);
  const [activeTab, setActiveTab] = useState('reviews');

  const loadReviews = async () => {
    try {
      setLoading(true);

      const data = await reviewService.getReviews();

      setReviews(data);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  useLiveMonitoring({
    ReviewUpdated: (event) => {
      if (event.deleted) {
        setReviews((current) => current.filter((review) => String(review.id) !== String(event.id)))
        return
      }
      setReviews((current) => {
        const exists = current.some((review) => String(review.id) === String(event.id))
        return exists ? current.map((review) => String(review.id) === String(event.id) ? { ...review, ...event } : review) : [event, ...current]
      })
    },
  })

  const handleRefresh = () => {
    loadReviews();
  };

  const handleExport = () => {};

  return (
    <DashboardLayout>
      <div className="dt-reviews">

        <ReviewsHeader activeTab={activeTab} onRefresh={handleRefresh} onTabChange={setActiveTab} />

        {activeTab === 'reviews' ? <>
        <ReviewsSummary reviews={reviews} />

        <ReviewFilters
          filters={filters}
          setFilters={setFilters}
          onRefresh={handleRefresh}
          onExport={handleExport}
        />

        <section className="dt-reviews-workspace-grid">

          <ReviewsTable
            reviews={reviews}
            loading={loading}
            filters={filters}
            onAssign={setSelectedReview}
            onDelete={loadReviews}
            onReply={setSelectedReview}
            onResolve={loadReviews}
            onView={setSelectedReview}
          />

          <ReviewsAssistant reviews={reviews} />

        </section>

        <ReviewsAnalytics reviews={reviews} />
        </> : <GoogleBusinessPosts />}

      </div>

      <ReplyDrawer
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
        onRefresh={loadReviews}
      />

    </DashboardLayout>
  );
}
