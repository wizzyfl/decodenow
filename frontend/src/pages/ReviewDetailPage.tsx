import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import brain from "brain";
import type { PublicAnalysisResult } from "brain/data-contracts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MainLayout } from "components/MainLayout";

const ReviewDetailPage = () => {
  const { reviewId } = useParams<{ reviewId: string }>();
  const [review, setReview] = useState<PublicAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReview = async () => {
      if (!reviewId) return;
      try {
        const response = await brain.get_published_review({ reviewId });
        if (response.ok) {
          const data = await response.json();
          setReview(data);
        } else {
          setError("Failed to fetch review.");
        }
      } catch (err) {
        setError("An error occurred while fetching the review.");
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [reviewId]);

  if (loading) {
    return <MainLayout><div>Loading...</div></MainLayout>;
  }

  if (error || !review) {
    return <MainLayout><div>Error: {error || "Review not found."}</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{review.data.strain_name}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: review.summary }} />
            <div className="flex gap-2 mt-4">
              <Badge variant="secondary">THCa: {review.data.thca}%</Badge>
              <Badge variant="secondary">CBD: {review.data.cbd}%</Badge>
              <Badge variant="secondary">��9-THC: {review.data.delta_9_thc}%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ReviewDetailPage;

