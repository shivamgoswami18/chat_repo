import {
  BUSINESS_SEARCH,
  CREATE_PASSWORD,
  LIST_OF_COUNTY,
  LIST_OF_SERVICE,
  SIGN_IN,
  SIGN_UP,
} from "./ApiRoutes";
import { nonAuthData } from "./ApiService";
import type { AppDispatch } from "@/lib/store/store";
import {
  setLoading,
  setToken,
  clearToken,
  setRole,
  setId,
  setError,
  clearError,
} from "@/lib/store/slices/authSlice";
import {
  checkStatusCodeSuccess,
  commonLabels,
  errorHandler,
  finalApiMessage,
} from "@/components/constants/Common";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { routePath } from "@/components/constants/RoutePath";
import { getTranslationSync } from "@/i18n/i18n";

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

interface JWTPayload {
  id: string;
  role: string;
}

interface LoginFormData {
  email: string;
  confirmPassword: string;
}

interface LoginParams {
  formData: LoginFormData;
  navigate: (path: string) => void;
}

type CustomerRegisterFormData = {
  role: "customer";
  customerFields: {
    full_name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
};

type BusinessRegisterFormData = {
  role: "business";
  businessFields: {
    business_name: string;
    full_name: string;
    email: string;
    phone_number: string;
    county: string[];
    org_no: string;
    category: string[];
  };
};

type RegisterFormData = CustomerRegisterFormData | BusinessRegisterFormData;

interface RegisterParams {
  formData: RegisterFormData;
  navigate: (path: string) => void;
}

export const login = ({ formData, navigate }: LoginParams) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    try {
      const response = await nonAuthData.post(SIGN_IN, formData);
      const responseData = response.data;
      const message = finalApiMessage(responseData);
      const tokenData = responseData?.data?.token;
      const statusCode = responseData?.statusCode || response.status;

      if (checkStatusCodeSuccess(statusCode)) {
        if (!tokenData) {
          dispatch(clearToken());
          dispatch(setError(message || t("commonConstants.errorOccurred")));
          return;
        }

        try {
          const decoded = jwtDecode<JWTPayload>(tokenData);
          const userRole = decoded?.role;
          const userId = decoded?.id;
          if (
            userRole === commonLabels.customerRole ||
            userRole === commonLabels.businessRole
          ) {
            dispatch(setToken(tokenData));
            dispatch(setRole(userRole));
            dispatch(setId(userId));
            dispatch(clearError());
            toast.success(message || t("logInPageConstants.loginSuccessful"));
            if (userRole === commonLabels.customerRole) {
              navigate(routePath.dashboard);
            } else {
              navigate(routePath.projects);
            }
          } else {
            dispatch(clearToken());
            dispatch(setError(t("logInPageConstants.adminAccessDenied")));
          }
        } catch {
          dispatch(clearToken());
          dispatch(setError(message || t("commonConstants.errorOccurred")));
        }
      } else {
        dispatch(clearToken());
        dispatch(setError(message || t("commonConstants.errorOccurred")));
      }
    } catch (error) {
      dispatch(clearToken());
      errorHandler(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const register = ({ formData, navigate }: RegisterParams) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    try {
      const response = await nonAuthData.post(SIGN_UP, formData);
      const responseData = response.data;
      const message = finalApiMessage(responseData);
      const statusCode = responseData?.statusCode || response.status;

      if (checkStatusCodeSuccess(statusCode)) {
        dispatch(clearError());
        toast.success(
          message || t("registerPageConstants.registrationSuccessful")
        );
        navigate(routePath.logIn);
      } else {
        dispatch(setError(message || t("commonConstants.errorOccurred")));
      }
    } catch (error) {
      navigate(routePath.logIn);
      errorHandler(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const fetchServiceCategories = async () => {
  try {
    const response = await nonAuthData.post(LIST_OF_SERVICE, {});
    const responseData = response.data;
    const message = finalApiMessage(responseData);

    if (checkStatusCodeSuccess(responseData?.statusCode)) {
      return responseData?.data?.items || [];
    }
    toast.error(message || t("commonConstants.errorOccurred"));
    return [];
  } catch (error) {
    errorHandler(error);
    return [];
  }
};

export const fetchCounties = async () => {
  try {
    const response = await nonAuthData.post(LIST_OF_COUNTY, {});
    const responseData = response.data;
    const message = finalApiMessage(responseData);

    if (checkStatusCodeSuccess(responseData?.statusCode)) {
      return responseData?.data?.items || [];
    }
    toast.error(message || t("commonConstants.errorOccurred"));
    return [];
  } catch (error) {
    errorHandler(error);
    return [];
  }
};

export interface BusinessSearchResult {
  name: string;
  organizationNumber: string;
}

export const searchBusiness = async (
  query: string
): Promise<BusinessSearchResult[]> => {
  try {
    const response = await nonAuthData.get(BUSINESS_SEARCH, {
      params: {
        query: query,
      },
    });
    const responseData = response.data;
    const statusCode = responseData?.statusCode || response.status;
    const message = finalApiMessage(responseData);

    if (Array.isArray(responseData)) {
      return responseData;
    }

    if (checkStatusCodeSuccess(statusCode)) {
      return responseData?.data || [];
    }
    toast.error(message || t("commonConstants.errorOccurred"));
    return [];
  } catch (error) {
    errorHandler(error);
    return [];
  }
};

interface CreatePasswordPayload {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export const createPassword = async ({
  email,
  newPassword,
  confirmPassword,
}: CreatePasswordPayload) => {
  try {
    const response = await nonAuthData.post(
      CREATE_PASSWORD,
      {
        newPassword,
        confirmPassword,
      },
      {
        params: {
          email,
        },
      }
    );

    const responseData = response.data;
    const message = finalApiMessage(responseData);
    const statusCode = responseData?.statusCode || response.status;

    if (checkStatusCodeSuccess(statusCode)) {
      toast.success(
        message || t("passwordResetSuccessConstants.passwordResetSuccessful")
      );
      return true;
    }

    toast.error(message || t("commonConstants.errorOccurred"));
    return false;
  } catch (error) {
    errorHandler(error);
    return false;
  }
};
