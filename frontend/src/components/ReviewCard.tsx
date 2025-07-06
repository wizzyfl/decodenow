import React from "react";
import type { PublicAnalysisResult } from "brain/data-contracts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  review: PublicAnalysisResult;
}

export const ReviewCard = ({ review }: Props) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{review.data.strain_name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-500 line-clamp-3">
          {review.summary}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Badge variant="secondary">THCa: {review.data.thca}%</Badge>
        <span className="text-xs text-gray-400">Read More...</span>
      </CardFooter>
    </Card>
  );
};
