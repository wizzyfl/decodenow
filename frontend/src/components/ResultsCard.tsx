import React from "react";
import type { AnalysisResult } from "brain/data-contracts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertTriangle, Share2, Copy } from "lucide-react";
import { useState } from "react";
import { APP_BASE_PATH } from "app";

type Props = {
  result: AnalysisResult;
};

const ResultItem = ({
  label,
  value,
  isPass,
}: {
  label: string;
  value: string;
  isPass?: boolean | null;
}) => (
  <div className="flex justify-between items-center py-2 border-b border-purple-400/10">
    <span className="text-gray-400">{label}</span>
    <div className="flex items-center">
      {isPass === true && <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />}
      {isPass === false && <XCircle className="w-5 h-5 text-red-500 mr-2" />}
      <span className="font-bold text-white">{value}</span>
    </div>
  </div>
);

export const ResultsCard = ({ result }: Props) => {
  const { data, summary, is_legal, id } = result;
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const safeJoinPaths = (a: string, b: string) => {
    const aTrim = a.endsWith('/') ? a.slice(0, -1) : a;
    const bTrim = b.startsWith('/') ? b.slice(1) : b;
    return `${aTrim}/${bTrim}`;
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${safeJoinPaths(APP_BASE_PATH, `share-page?resultId=${id}`)}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full max-w-2xl mt-8 bg-white/5 backdrop-blur-lg border-purple-400/30 shadow-2xl shadow-purple-900/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Analysis Complete
        </CardTitle>
        <CardDescription>
          Here's the breakdown of your COA lab report.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ResultItem
            label="THCa"
            value={`${data.thca?.toFixed(2) ?? "N/A"}%`}
          />
          <ResultItem
            label="Delta-9 THC"
            value={`${data.delta_9_thc?.toFixed(2) ?? "N/A"}%`}
          />
          <ResultItem
            label="Total THC"
            value={`${data.total_thc?.toFixed(2) ?? "N/A"}%`}
          />
          <ResultItem
            label="Pesticides"
            value={data.pesticides_passed ? "Pass" : "Fail"}
            isPass={data.pesticides_passed}
          />
          <ResultItem
            label="Heavy Metals"
            value={data.heavy_metals_passed ? "Pass" : "Fail"}
            isPass={data.heavy_metals_passed}
          />
          <ResultItem
            label="Residual Solvents"
            value={data.residual_solvents_passed ? "Pass" : "Fail"}
            isPass={data.residual_solvents_passed}
          />
        </div>

        <div className="mt-6 p-4 bg-purple-900/20 rounded-lg">
          <h4 className="font-bold text-lg mb-2">Summary</h4>
          <p className="text-gray-300">{summary}</p>
        </div>

        <div
          className={`mt-4 p-3 flex items-center rounded-lg ${
            is_legal ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
          }`}
        >
          {is_legal ? (
            <CheckCircle2 className="w-5 h-5 mr-3" />
          ) : (
            <AlertTriangle className="w-5 h-5 mr-3" />
          )}
          <span className="font-semibold">
            {is_legal
              ? "This product appears to be federally legal."
              : "This product may not be federally legal."}
          </span>
        </div>

        <div className="flex gap-2 mt-6">
          <Button
            onClick={handleCopySummary}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg"
          >
            <Copy className="mr-2 h-5 w-5" />
            {copied ? "Copied!" : "Copy Summary"}
          </Button>
          {id && (
            <Button
              onClick={handleShare}
              variant="outline"
              className="w-full border-purple-400/50 hover:bg-purple-900/30"
            >
              <Share2 className="mr-2 h-5 w-5" />
              {copied ? "Link Copied!" : "Share Result"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};





