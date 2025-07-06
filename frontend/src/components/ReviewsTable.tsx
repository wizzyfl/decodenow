import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { StrainAnalysisReview } from "brain/data-contracts";
import { Button } from "@/components/ui/button";

interface Props {
  reviews: StrainAnalysisReview[];
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ReviewsTable = ({ reviews, onApprove, onDelete }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Strain Name</TableHead>
          <TableHead>THCa %</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.map((review) => (
          <TableRow key={review.id}>
            <TableCell>{review.strain_name}</TableCell>
            <TableCell>{review.thca_percentage}</TableCell>
            <TableCell>
              <Badge
                variant={review.status === "draft" ? "secondary" : "default"}
              >
                {review.status}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(review.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell className="space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onApprove(review.id)}
                disabled={review.status === 'published'}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(review.id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

