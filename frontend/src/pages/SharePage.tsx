import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import brain from "brain";
import type { PublicAnalysisResult } from "brain/data-contracts";
import { ResultsCard } from "components/ResultsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { MainLayout } from "components/MainLayout";
import { useUser } from "@stackframe/react";  // import useUser

export default function SharePage() {
  const [searchParams] = useSearchParams();
  const resultId = searchParams.get("resultId");
  const [result, setResult] = useState<PublicAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const user = useUser(); // get user state

  useEffect(() => {
    if (!resultId) {
      setLoading(false);
      setError("No analysis ID provided in the URL.");
      return;
    }

    const fetchResult = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await brain.get_published_review2({
          reviewId: resultId,
        });

        if (response.ok) {
          const data: PublicAnalysisResult = await response.json();
          setResult(data);
        } else {
          const errorData = await response.json();
          setError(
            errorData.detail?.message ||
              errorData.detail ||
              "Analysis result not found."
          );
        }
      } catch (e) {
        console.error("Failed to fetch analysis result:", e);
        setError("An error occurred while fetching the analysis result.");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user is loaded (not undefined)
    if (user !== undefined) {
      fetchResult();
    }
  }, [resultId, user]);

  // Wait for user to load before rendering anything
  if (user === undefined) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Skeleton className="h-12 w-1/2 mb-4" />
          <Skeleton className="h-8 w-3/4 mb-8" />
          <Skeleton className="h-10 w-full" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center text-center">
        {loading && (
          <div className="w-full max-w-2xl">
            <Skeleton className="h-12 w-1/2 mx-auto mb-4" />
            <Skeleton className="h-8 w-3/4 mx-auto mb-8" />
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        )}
        {error && <p className="text-red-500 font-bold text-lg">{error}</p>}
        {result && <ResultsCard result={result} />}
      </div>
    </MainLayout>
  );
}