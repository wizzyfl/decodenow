import React, { useEffect, useState } from "react";
import { useUser } from "@stackframe/react";
import { useNavigate } from "react-router-dom";
import brain from "brain";
import { ReviewsTable } from "components/ReviewsTable";
import type { StrainAnalysisReview } from "brain/data-contracts";
import { MainLayout } from "components/MainLayout";

export const AdminDashboard = () => {
  const user = useUser();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<StrainAnalysisReview[]>([]);

  const [checkingUser, setCheckingUser] = useState(true);

  useEffect(() => {
    if (user !== undefined) {
      setCheckingUser(false);
      if (user === null || user?.publicMetadata?.role !== "admin") {
        navigate("/");
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await brain.list_all_reviews();
      if (response.ok) {
        setReviews(await response.json());
      }
    };
    fetchReviews();
  }, []);

  const handleApprove = async (id: string) => {
    await brain.approve_review({ review_id: id });
    setReviews(reviews.map(r => (r.id === id ? { ...r, status: "published" } : r)));
  };

  const handleDelete = async (id: string) => {
    await brain.delete_review({ review_id: id });
    setReviews(reviews.filter(r => r.id !== id));
  };

  if (checkingUser) {
    // Optionally show a spinner or loading UI here
    return null;
  }

  // User is authenticated and admin at this point
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        <ReviewsTable reviews={reviews} onApprove={handleApprove} onDelete={handleDelete} />
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;