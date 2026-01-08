import type { AppDispatch } from "@/lib/store/store";
import { authData } from "./ApiService";
import {
  CLIP_HISTORY,
  LIST_OF_SUBSCRIPTION,
  SEND_PLAN_REQUEST,
} from "./ApiRoutes";
import {
  checkStatusCodeSuccess,
  extractErrorMessage,
} from "@/components/constants/Common";
import {
  setHistory,
  setPlan,
  setSubscriptions,
  setSuccess,
  setError,
  setLoading
} from "../store/slices/subscriptionSlice";
import { getTranslationSync } from "@/i18n/i18n";
interface ListOfSubscriptionData {
  status: string;
}
interface ListOfSubscriptionParams {
  payload: ListOfSubscriptionData;
}
const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

export const listOfSubscriptions = ({ payload }: ListOfSubscriptionParams) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await authData.post(LIST_OF_SUBSCRIPTION, payload);
      const responseData = response.data;
      const message = responseData.message;
      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        dispatch(setSubscriptions(responseData.data));
      } else {
        dispatch(setError(message));
      }
    } catch (error) {
      dispatch(setError(extractErrorMessage(error)));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const clipHistory = ({ payload }: ListOfSubscriptionParams) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await authData.post(CLIP_HISTORY, payload);
      const responseData = response.data;
      const message = responseData.message;
      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        dispatch(setHistory(responseData.data));
      } else {
        dispatch(setError(message));
      }
    } catch (error) {
      dispatch(setError(extractErrorMessage(error)));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const sendPlanRequest = (subscriptionId: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await authData.post(SEND_PLAN_REQUEST(subscriptionId));
      const responseData = response.data;
      const messageKey = responseData.messageKey;
      const message = t(`messageKey.${messageKey}`);
      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        dispatch(setPlan(responseData.data));
        dispatch(setSuccess(message))
      } else {
        dispatch(setError(message));
      }
    } catch (error) {
      dispatch(setError(extractErrorMessage(error)));
    } finally {
      dispatch(setLoading(false));
    }
  };
};
