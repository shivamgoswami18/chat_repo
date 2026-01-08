import {
  checkStatusCodeSuccess,
  extractErrorMessage,
  finalApiMessage,
} from "@/components/constants/Common";
import {
  setError,
  setLoading,
  setAddReview,
  setReviewsData,
} from "../store/slices/reviewSlice";
import { ADD_REVIEW, LIST_OF_REVIEWS } from "./ApiRoutes";
import { authData, nonAuthData } from "./ApiService";
import { AppDispatch } from "../store/store";
import { toast } from "react-toastify";

interface AddReviewPayload {
  project_id: string | undefined;
  business_id: string | undefined;
  rating: number;
  review_text: string;
}
interface AddReviewParams {
  payload: AddReviewPayload;
}

export const addReview =
  ({ payload }: AddReviewParams) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await authData.post(ADD_REVIEW, payload);
      const responseData = response?.data;
      const message = finalApiMessage(responseData);
      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        dispatch(setAddReview(responseData?.data));
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      dispatch(setError(extractErrorMessage(error)));
    } finally {
      dispatch(setLoading(false));
    }
  };
export interface ListOfReviewPayload {
  sortKey: string;
  sortValue: string;
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

interface ListOfReviewParams {
  payload: ListOfReviewPayload;
}
export const reviewList =
  (id: string, { payload }: ListOfReviewParams) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await nonAuthData.post(LIST_OF_REVIEWS(id), payload);
      const responseData = response?.data;
      const message = finalApiMessage(responseData);
      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        dispatch(setReviewsData(responseData?.data));
      } else {
        toast.error(message);
      }
    } catch (error) {
      dispatch(setError(extractErrorMessage(error)));
    } finally {
      dispatch(setLoading(false));
    }
  };
