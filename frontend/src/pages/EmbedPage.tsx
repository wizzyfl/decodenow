import React from "react";
import { useUser } from "@stackframe/react";
import { useNavigate } from "react-router-dom";
import { CoaUploader } from "components/CoaUploader";
import { MainLayout } from "components/MainLayout";

export default function EmbedPage() {
  const user = useUser();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user === undefined) {
      // still loading, do nothing
      return;
    }
    if (user === null) {
      // user not logged in, redirect to login or home
      navigate("/login");
    }
  }, [user, navigate]);

  if (user === undefined) {
    // loading state
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  if (user === null) {
    // Redirecting, render nothing
    return null;
  }

  // User logged in, render uploader
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-transparent text-gray-200 p-4">
        <CoaUploader />
      </div>
    </MainLayout>
  );
}