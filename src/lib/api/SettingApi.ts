import {
  checkStatusCodeSuccess,
  extractErrorMessage,
  finalApiMessage,
} from "@/components/constants/Common";

import { setError, setLoading } from "../store/slices/settingSlice";
import { AppDispatch } from "../store/store";
import { CHANGE_PASSWORD, UPDATE_PROFILE } from "./ApiRoutes";
import { authData } from "./ApiService";

import { updateUserNotifications } from "../store/slices/userSlice";
import { toast } from "react-toastify";

interface SettingFormData {
  newPassword: string;
  confirmPassword: string;
  currentPassword: string;
}

interface SettingParams {
  formData: SettingFormData;
}

export const changePassword = ({ formData }: SettingParams) => {

  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await authData.put(CHANGE_PASSWORD, formData);
      const responseData = response.data;
      const message = finalApiMessage(responseData);
      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        toast.success(message);
      } else {
        dispatch(setError({ source: "changePassword", message }));
      }
    } catch (error) {
      dispatch(
        setError({ source: "changePassword", message: extractErrorMessage(error) })
      );

    } finally {
      dispatch(setLoading(false));
    }
  };
};

interface UserNotifications {
  offer: boolean;
  message: boolean;
  completed_project: boolean;
}

export interface UpdateNotificationPayload {
  userId: string;
  user_notifications: UserNotifications;
}

export const updateNotifications = (payload: UpdateNotificationPayload) => {
  return async (dispatch: AppDispatch) => {
    dispatch(updateUserNotifications(payload.user_notifications));
    dispatch(setLoading(true));
    try {
      const response = await authData.put(UPDATE_PROFILE, payload);
      const responseData = response.data;
      const message = finalApiMessage(responseData);
      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        toast.success(message);
        dispatch(updateUserNotifications(payload.user_notifications));
      } else {
        dispatch(setError({ source: "notifications", message }));
      }
    } catch (error) {
      dispatch(
        setError({ source: "notifications", message: extractErrorMessage(error) })
      );

    } finally {
      dispatch(setLoading(false));
    }
  };
};