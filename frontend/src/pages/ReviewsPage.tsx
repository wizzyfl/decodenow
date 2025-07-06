import React, { useEffect, useState } from "react";
import brain from "brain";
import { Link } from "react-router-dom";
import { ReviewCard } from "components/ReviewCard";
import type { PublicAnalysisResult } from "brain/data-contracts";
import { MainLayout } from "components/MainLayout";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<PublicAnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await brain.list_published_reviews();
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        } else {
          setError("Failed to fetch reviews.");
        }
      } catch (err) {
        setError("An error occurred while fetching reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <MainLayout><div>Loading...</div></MainLayout>;
  }

  if (error) {
    return <MainLayout><div>Error: {error}</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Strain Reviews</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Link to={`/reviews/${review.id}`} key={review.id}>
              <ReviewCard review={review} />
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default ReviewsPage;

