import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, FileText } from "lucide-react";
import type { PublicAnalysisResult } from "brain/data-contracts";
import brain from "brain";
import { useUser } from "@stackframe/react";
import { stackClientApp } from "app/auth";
import { useNavigate } from "react-router-dom";

export const CoaUploader = () => {
  const user = useUser();
  const navigate = useNavigate();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect unauthenticated users immediately
  useEffect(() => {
    if (user === undefined) return; // still loading
    if (user === null) {
      stackClientApp.redirectToSignIn();
    }
  }, [user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setPdfFile(event.target.files[0]);
      setRawText("");
      setError(null);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawText(e.target.value);
    setPdfFile(null);
    setError(null);
  };

  const handleDecode = async () => {
    if (!user) {
      setError("You must be logged in to decode.");
      return;
    }

    if (!pdfFile && !rawText) {
      setError("Please upload a PDF file or paste COA text first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await brain.analyze_coa({
        coa_pdf: pdfFile ?? undefined,
        coa_text: rawText || undefined,
      });

      if (response.ok) {
        const analysis: PublicAnalysisResult = await response.json();

        if (analysis && analysis.id) {
          // Navigate passing only the result ID, NOT full JSON
          navigate(`/share?resultId=${encodeURIComponent(analysis.id)}`);
        } else {
          setError("Analysis completed, but no result ID was returned.");
        }
      } else {
        const errorData = await response.json();
        setError(
          errorData.detail?.message ||
            errorData.detail ||
            "An unexpected error occurred."
        );
      }
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (user === undefined) {
    // User still loading
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p>Loading user info...</p>
      </div>
    );
  }

  // If user is null, redirect handled in useEffect

  return (
    <>
      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-md border-purple-400/20 shadow-lg shadow-purple-900/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tighter">
            Decode Your COA
          </CardTitle>
          <CardDescription>
            Upload a PDF or paste the text from your lab report to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-purple-900/20">
              <TabsTrigger value="upload">
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload PDF
              </TabsTrigger>
              <TabsTrigger value="paste">
                <FileText className="mr-2 h-4 w-4" />
                Paste Text
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="mt-4">
              <div className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-purple-400/30 rounded-lg">
                <UploadCloud className="w-12 h-12 text-purple-400" />
                <p className="mt-4 text-sm text-gray-400">
                  Drag & drop your PDF here, or click to browse.
                </p>
                <Input
                  type="file"
                  className="opacity-0 w-full h-full absolute top-0 left-0 cursor-pointer"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </div>
              {pdfFile && (
                <p className="mt-4 text-center text-sm text-green-400">
                  Selected: {pdfFile.name}
                </p>
              )}
            </TabsContent>
            <TabsContent value="paste" className="mt-4">
              <Textarea
                placeholder="Paste the raw text from your COA lab report here..."
                className="min-h-[150px] bg-transparent"
                value={rawText}
                onChange={handleTextChange}
              />
            </TabsContent>
          </Tabs>
          <Button
            onClick={handleDecode}
            disabled={isLoading || (!pdfFile && !rawText) || user === undefined}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg transition-all duration-300"
          >
            {user === undefined
              ? "Authenticating..."
              : isLoading
              ? "Decoding..."
              : "Decode Now"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <div className="mt-4 text-red-400 font-semibold p-3 bg-red-500/10 rounded-lg">
          Error: {error}
        </div>
      )}
    </>
  );
};

