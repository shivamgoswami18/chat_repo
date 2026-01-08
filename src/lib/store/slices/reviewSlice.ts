import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface ReviewDetails {
  id: string;
  rating: number;
  review: string;
}
export interface ReviewsResponse {
  items: ReviewDetails[];
}

export interface ReviewItem {
  _id: string;
  rating: number;
  review_text: string;
  business_reply: string | null;
  createdAt: string;
  project_title: string;
  customer_name: string;
}

export type Rating = 1 | 2 | 3 | 4 | 5;
export type RatingCounts = Record<Rating, number>;
export interface ReviewsData {
  averageRating: number;
  ratingCounts: RatingCounts;
  items: ReviewItem[];
  totalCount: number;
  itemsCount: number;
  currentPage: number;
  totalPage: number;
  pageSize: number;
}

interface ReviewsState {
  reviews: ReviewsResponse | null;
  loading: boolean;
  error: string | null;
  reviewsData: ReviewsData | null;
}
const initialState: ReviewsState = {
  reviews: null,
  loading: false,
  error: null,
  reviewsData: null,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    setAddReview(state, action: PayloadAction<ReviewsResponse>) {
      state.reviews = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setReviewsData(state, action: PayloadAction<ReviewsData | null>) {
      state.reviewsData = action.payload;
    },
  },
});
export const { setAddReview, setLoading, setError , setReviewsData} = reviewSlice.actions;
export default reviewSlice.reducer;
