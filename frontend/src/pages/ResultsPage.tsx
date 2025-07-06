import React from "react";
import { useLocation } from "react-router-dom";
import { ResultsCard } from "components/ResultsCard";
import type { PublicAnalysisResult } from "brain/data-contracts";
import { MainLayout } from "components/MainLayout";
import { useUser } from "@stackframe/react";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ResultsPage = () => {
  const user = useUser();
  const query = useQuery();
  const resultString = query.get("result");
  let result: PublicAnalysisResult | null = null;

  if (resultString) {
    try {
      result = JSON.parse(resultString);
    } catch (error) {
      console.error("Failed to parse result from query param", error);
    }
  }

  if (user === undefined) {
    // Show a loading placeholder while user loads
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  // If you want to restrict page only to logged-in users, uncomment below:
  // if (!user) {
  //   // Redirect or show login prompt here
  //   return null;
  // }

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        {result ? (
          <ResultsCard result={result} />
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold">No results found.</h1>
            <p className="text-gray-500">
              Please go back and try analyzing a COA again.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ResultsPage;