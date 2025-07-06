import {
  AnalyzePdfTestData,
  ApproveReviewData,
  BlogGenerationRequest,
  BodyAnalyzePdfTest,
  CheckHealthData,
  DeleteReviewData,
  GenerateBlogPostData,
  GetPublishedReviewData,
  ListAllReviewsData,
  ListPublishedReviewsData,
} from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * No description
   * @tags dbtn/module:blog_generator, dbtn/hasAuth
   * @name generate_blog_post
   * @summary Generate Blog Post
   * @request POST:/routes/blog/generate
   */
  export namespace generate_blog_post {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BlogGenerationRequest;
    export type RequestHeaders = {};
    export type ResponseBody = GenerateBlogPostData;
  }

  /**
   * @description Lists all published strain reviews.
   * @tags Public Reviews, dbtn/module:public_reviews, dbtn/hasAuth
   * @name list_published_reviews
   * @summary List Published Reviews
   * @request GET:/routes/public/reviews/
   */
  export namespace list_published_reviews {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ListPublishedReviewsData;
  }

  /**
   * @description Fetches a single published strain review.
   * @tags Public Reviews, dbtn/module:public_reviews, dbtn/hasAuth
   * @name get_published_review
   * @summary Get Published Review
   * @request GET:/routes/public/reviews/{review_id}
   */
  export namespace get_published_review {
    export type RequestParams = {
      /**
       * Review Id
       * @format uuid
       */
      reviewId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetPublishedReviewData;
  }

  /**
   * @description Deletes a strain review.
   * @tags Public Reviews, dbtn/module:public_reviews, dbtn/hasAuth
   * @name delete_review
   * @summary Delete Review
   * @request DELETE:/routes/public/reviews/{review_id}
   */
  export namespace delete_review {
    export type RequestParams = {
      /**
       * Review Id
       * @format uuid
       */
      reviewId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteReviewData;
  }

  /**
   * @description Lists all strain reviews for admins.
   * @tags Public Reviews, dbtn/module:public_reviews, dbtn/hasAuth
   * @name list_all_reviews
   * @summary List All Reviews
   * @request GET:/routes/public/reviews/all
   */
  export namespace list_all_reviews {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ListAllReviewsData;
  }

  /**
   * @description Approves a strain review.
   * @tags Public Reviews, dbtn/module:public_reviews, dbtn/hasAuth
   * @name approve_review
   * @summary Approve Review
   * @request PATCH:/routes/public/reviews/{review_id}/approve
   */
  export namespace approve_review {
    export type RequestParams = {
      /**
       * Review Id
       * @format uuid
       */
      reviewId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApproveReviewData;
  }

  /**
   * @description A simplified endpoint to test PDF text extraction in isolation.
   * @tags Test, dbtn/module:test_analyzer, dbtn/hasAuth
   * @name analyze_pdf_test
   * @summary Analyze Pdf Test
   * @request POST:/routes/test/analyze_pdf
   */
  export namespace analyze_pdf_test {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BodyAnalyzePdfTest;
    export type RequestHeaders = {};
    export type ResponseBody = AnalyzePdfTestData;
  }
}
