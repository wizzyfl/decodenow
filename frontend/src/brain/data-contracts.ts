/** BlogGenerationRequest */
export interface BlogGenerationRequest {
  /** Strain Id */
  strain_id: number;
}

/** BlogPost */
export interface BlogPost {
  /** Id */
  id: number;
  /** Strain Id */
  strain_id: number;
  /** Title */
  title: string;
  /** Content */
  content: string;
  /** Tags */
  tags: string[];
}

/** Body_analyze_pdf_test */
export interface BodyAnalyzePdfTest {
  /**
   * File
   * @format binary
   */
  file: File;
}

/** CoaData */
export interface CoaData {
  /** Strain Name */
  strain_name: string;
  /** Thca */
  thca: number;
  /** Delta 9 Thc */
  delta_9_thc: number;
  /** Cbd */
  cbd: number;
  /** Pesticides Passed */
  pesticides_passed: boolean;
  /** Heavy Metals Passed */
  heavy_metals_passed: boolean;
  /** Residual Solvents Passed */
  residual_solvents_passed: boolean;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** PublicAnalysisResult */
export interface PublicAnalysisResult {
  /**
   * Id
   * @format uuid
   */
  id: string;
  data: CoaData;
  /** Summary */
  summary: string;
  /** Total Thc */
  total_thc: number;
  /** Created At */
  created_at: string;
}

/** StrainAnalysisReview */
export interface StrainAnalysisReview {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /** Strain Name */
  strain_name: string;
  /** Thca Percentage */
  thca_percentage: number;
  /** Status */
  status: string;
  /** Created At */
  created_at: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type CheckHealthData = HealthResponse;

export type GenerateBlogPostData = BlogPost;

export type GenerateBlogPostError = HTTPValidationError;

/** Response List Published Reviews */
export type ListPublishedReviewsData = PublicAnalysisResult[];

export interface GetPublishedReviewParams {
  /**
   * Review Id
   * @format uuid
   */
  reviewId: string;
}

export type GetPublishedReviewData = PublicAnalysisResult;

export type GetPublishedReviewError = HTTPValidationError;

export interface DeleteReviewParams {
  /**
   * Review Id
   * @format uuid
   */
  reviewId: string;
}

export type DeleteReviewData = any;

export type DeleteReviewError = HTTPValidationError;

/** Response List All Reviews */
export type ListAllReviewsData = StrainAnalysisReview[];

export interface ApproveReviewParams {
  /**
   * Review Id
   * @format uuid
   */
  reviewId: string;
}

export type ApproveReviewData = any;

export type ApproveReviewError = HTTPValidationError;

export type AnalyzePdfTestData = any;

export type AnalyzePdfTestError = HTTPValidationError;
