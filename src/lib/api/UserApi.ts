import type { AppDispatch } from "@/lib/store/store";
import { setError, setLoading } from "../store/slices/authSlice";
import { authData, multipartDataWithToken } from "./ApiService";
import { VIEW_PROFILE, EDIT_PROFILE, FILE_UPLOAD } from "./ApiRoutes";
import {
  checkStatusCodeSuccess,
  errorHandler,
  finalApiMessage,
} from "@/components/constants/Common";
import {
  setProfile,
  setLoadingProfile,
  setUploadingFile,
  setUploadedFilePath,
} from "../store/slices/userSlice";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { BackendResp } from "@/types/backendResponse";

export const ViewProfile = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoadingProfile(true));
    try {
      const response = await authData.get(VIEW_PROFILE);
      const responseData = response?.data;
      const message = finalApiMessage(responseData);

      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        dispatch(setProfile(responseData?.data));
      } else {
        dispatch(setError(message));
        toast.error(message);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      dispatch(setLoadingProfile(false));
    }
  };
};

export interface EditProfilePayload {
  userId?: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  profile_image?: string | null;
  business_name?: string;
  description?: string;
  county?: string[];
  category?: string[];
  address?: {
    postalAddress?: {
      addressLine?: string;
      postPlace?: string;
      postalCode?: string;
    };
  };
  postal_code?: string;
  coordinates?: Array<{
    XCoordinate: number;
    YCoordinate: number;
  }>;
  org_no?: string;
  terms_condition?: string;
  user_notifications?: {
    offer?: boolean;
    message?: boolean;
    completed_project?: boolean;
  };
}

interface EditProfileParams {
  payload: EditProfilePayload;
}

export const EditProfile = ({ payload }: EditProfileParams) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await authData.put(EDIT_PROFILE, payload);
      const responseData = response?.data;
      const message = finalApiMessage(responseData);

      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        dispatch(setProfile(responseData?.data));
        toast.success(message);
        dispatch(ViewProfile());
        return true;
      } else {
        dispatch(setError(message));
        toast.error(message);
        return false;
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const UploadFile = (file: File) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setUploadingFile(true));
    try {
      const formData = new FormData();
      formData.append("files", file);

      const response = await multipartDataWithToken.post(FILE_UPLOAD, formData);
      const responseData = response?.data;
      const message = finalApiMessage(responseData);

      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        const imagePath = responseData?.data?.imagePath?.[0];
        if (imagePath) {
          dispatch(setUploadedFilePath(imagePath));
          toast.success(message);
          return imagePath;
        }
      } else {
        dispatch(setError(message));
        toast.error(message);
      }
      return null;
    } catch (error) {
      const axiosError = error as AxiosError<{
        message: string | string[];
        statusCode?: number;
      }>;
      type FileUploadData = { imagePath?: string[] };
      const responseData = axiosError.response?.data as
        | BackendResp<FileUploadData>
        | undefined;
      const statusCode =
        responseData?.statusCode || axiosError.response?.status;

      if (statusCode && checkStatusCodeSuccess(statusCode)) {
        const message = finalApiMessage(responseData);
        const imagePath = responseData?.data?.imagePath?.[0];

        if (imagePath) {
          dispatch(setUploadedFilePath(imagePath));
          toast.success(message);
          return imagePath;
        }
      } else {
        errorHandler(axiosError);
      }
      return null;
    } finally {
      dispatch(setUploadingFile(false));
    }
  };
};
