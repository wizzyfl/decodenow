import {
  AnalyzePdfTestData,
  AnalyzePdfTestError,
  ApproveReviewData,
  ApproveReviewError,
  ApproveReviewParams,
  BlogGenerationRequest,
  BodyAnalyzePdfTest,
  CheckHealthData,
  DeleteReviewData,
  DeleteReviewError,
  DeleteReviewParams,
  GenerateBlogPostData,
  GenerateBlogPostError,
  GetPublishedReviewData,
  GetPublishedReviewError,
  GetPublishedReviewParams,
  ListAllReviewsData,
  ListPublishedReviewsData,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:blog_generator, dbtn/hasAuth
   * @name generate_blog_post
   * @summary Generate Blog Post
   * @request POST:/routes/blog/generate
   */
  generate_blog_post = (data: BlogGenerationRequest, params: RequestParams = {}) =>
    this.request<GenerateBlogPostData, GenerateBlogPostError>({
      path: `/routes/blog/generate`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Lists all published strain reviews.
   *
   * @tags Public Reviews, dbtn/module:public_reviews, dbtn/hasAuth
   * @name list_published_reviews
   * @summary List Published Reviews
   * @request GET:/routes/public/reviews/
   */
  list_published_reviews = (params: RequestParams = {}) =>
    this.request<ListPublishedReviewsData, any>({
      path: `/routes/public/reviews/`,
      method: "GET",
      ...params,
    });

  /**
   * @description Fetches a single published strain review.
   *
   * @tags Public Reviews, dbtn/module:public_reviews, dbtn/hasAuth
   * @name get_published_review
   * @summary Get Published Review
   * @request GET:/routes/public/reviews/{review_id}
   */
  get_published_review = ({ reviewId, ...query }: GetPublishedReviewParams, params: RequestParams = {}) =>
    this.request<GetPublishedReviewData, GetPublishedReviewError>({
      path: `/routes/public/reviews/${reviewId}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Deletes a strain review.
   *
   * @tags Public Reviews, dbtn/module:public_reviews, dbtn/hasAuth
   * @name delete_review
   * @summary Delete Review
   * @request DELETE:/routes/public/reviews/{review_id}
   */
  delete_review = ({ reviewId, ...query }: DeleteReviewParams, params: RequestParams = {}) =>
    this.request<DeleteReviewData, DeleteReviewError>({
      path: `/routes/public/reviews/${reviewId}`,
      method: "DELETE",
      ...params,
    });

  /**
   * @description Lists all strain reviews for admins.
   *
   * @tags Public Reviews, dbtn/module:public_reviews, dbtn/hasAuth
   * @name list_all_reviews
   * @summary List All Reviews
   * @request GET:/routes/public/reviews/all
   */
  list_all_reviews = (params: RequestParams = {}) =>
    this.request<ListAllReviewsData, any>({
      path: `/routes/public/reviews/all`,
      method: "GET",
      ...params,
    });

  /**
   * @description Approves a strain review.
   *
   * @tags Public Reviews, dbtn/module:public_reviews, dbtn/hasAuth
   * @name approve_review
   * @summary Approve Review
   * @request PATCH:/routes/public/reviews/{review_id}/approve
   */
  approve_review = ({ reviewId, ...query }: ApproveReviewParams, params: RequestParams = {}) =>
    this.request<ApproveReviewData, ApproveReviewError>({
      path: `/routes/public/reviews/${reviewId}/approve`,
      method: "PATCH",
      ...params,
    });

  /**
   * @description A simplified endpoint to test PDF text extraction in isolation.
   *
   * @tags Test, dbtn/module:test_analyzer, dbtn/hasAuth
   * @name analyze_pdf_test
   * @summary Analyze Pdf Test
   * @request POST:/routes/test/analyze_pdf
   */
  analyze_pdf_test = (data: BodyAnalyzePdfTest, params: RequestParams = {}) =>
    this.request<AnalyzePdfTestData, AnalyzePdfTestError>({
      path: `/routes/test/analyze_pdf`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      ...params,
    });
}
