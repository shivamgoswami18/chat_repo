import { VERIFY_EMAIL, FORGOT_PASSWORD, VERIFY_OTP } from "./ApiRoutes";
import { nonAuthData } from "./ApiService";
import type { AppDispatch } from "@/lib/store/store";
import {
  setEmail,
  setLoading,
  setError,
  resetForgotPasswordState,
  setStep,
  setOtp,
} from "@/lib/store/slices/forgotPasswordSlice";
import {
  checkStatusCodeSuccess,
  extractErrorMessage,
  finalApiMessage,
} from "@/components/constants/Common";
import { ForgotPasswordStep } from "@/types/forgotPassword";

interface VerifyEmailFormData {
  email: string;
}
interface VerifyEmailParams {
  formData: VerifyEmailFormData;
}
interface VerifyOtpFormData {
  email: string;
  otp: number;
}
interface VerifyOtpParams {
  formData: VerifyOtpFormData;
}

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

interface ResetPasswordParams {
  formData: ResetPasswordFormData;
  email : string | null,
  otp :  number | null
}

export const verifyForgotEmail = ({
  formData,
}: VerifyEmailParams) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await nonAuthData.post(VERIFY_EMAIL, formData);
      const responseData = response.data;
      const message = finalApiMessage(responseData);

      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        dispatch(setEmail(formData.email));
        dispatch(setStep(ForgotPasswordStep.verify_otp));
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
export const verifyForgotOtp = ({
  formData,
}: VerifyOtpParams) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await nonAuthData.post(VERIFY_OTP, formData);
      const responseData = response.data;
      const message = finalApiMessage(responseData);

      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        dispatch(setOtp(formData.otp));
        dispatch(setStep(ForgotPasswordStep.reset_password));
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

export const resetPassword = ({ formData , email , otp}: ResetPasswordParams) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const payload = {
        email,
        otp: Number(otp),
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      };

      const response = await nonAuthData.put(FORGOT_PASSWORD, payload);
      const responseData = response.data;
      const message = finalApiMessage(responseData);

      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        dispatch(resetForgotPasswordState());
        dispatch(setStep(ForgotPasswordStep.success));
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
