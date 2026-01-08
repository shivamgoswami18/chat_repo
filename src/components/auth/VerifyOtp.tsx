"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BaseButton from "@/components/base/BaseButton";
import { BackArrowIcon } from "@/assets/icons/CommonIcons";
import { getTranslationSync } from "@/i18n/i18n";
import { routePath } from "../constants/RoutePath";
import BaseOTPInput from "../base/BaseVerifyInput";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useFormik } from "formik";
import * as Yup from "yup";
import { validationMessages } from "../constants/Validation";
import BaseErrorMessage from "../base/BaseErrorMessage";
import { verifyForgotOtp } from "@/lib/api/ForgotPasswordApi";
import { clearError as clearForgotPasswordError } from "@/lib/store/slices/forgotPasswordSlice";

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

export default function VerifyOTP() {
  const router = useRouter();
  const [otpValue, setOtpValue] = useState<string[]>(new Array(6).fill(""));
  const [resendSecondsLeft, setResendSecondsLeft] = useState<number>(300);
  const dispatch = useAppDispatch();
  const { loading, email, error } = useAppSelector(
    (state) => state.forgotPassword
  );

  const formik = useFormik({
    initialValues: {
      email: email ?? "",
      otp: "",
    },
    validationSchema: Yup.object({
      otp: Yup.string().required(
        validationMessages.required(t("verifyOTPPageConstants.code"))
      ),
    }),
    onSubmit: (values) => {
      dispatch(
        verifyForgotOtp({
          formData: {
            email: values.email,
            otp: Number(values.otp),
          },
        })
      );
    },
  });

  useEffect(() => {
    formik.setFieldValue("otp", otpValue.join(""));
  }, [otpValue]);

  useEffect(() => {
    if (resendSecondsLeft <= 0) return;

    const timer = setInterval(() => {
      setResendSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendSecondsLeft]);

  const handleResendClick = () => {
    if (resendSecondsLeft > 0) return;
    setResendSecondsLeft(30);
    router.push(routePath.logIn);
  };

  const formatResendTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="bg-cyanGradient rounded-[16px] md:min-h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center h-full px-[20px] py-[64px] figmascreen:px-[510px] figmascreen:pt-[229px] figmascreen:pb-[245px]">
        <div className="md:w-[460px] xs:w-[450px] w-full mx-auto flex flex-col p-[30px] bg-white rounded-[16px] shadow-sm">
          <div className="text-start mb-[30px]">
            <BaseButton
              className="bg-transparent border-none p-0 focus:ring-0"
              onClick={() => router.back()}
            >
              <BackArrowIcon size={24} />
            </BaseButton>
          </div>
          <p className="text-textLg md:text-titleXxlPlusPlus text-obsidianBlack font-bold xl:leading-[40px] space-y-[12px] xl:tracking-[-2%] mb-[10px]">
            {t("verifyOTPPageConstants.enterCode")}
          </p>
          <p className="text-obsidianBlack text-opacity-50 text-textSm mb-[24px] xl:leading-[20px] space-y-[12px] xl:tracking-[0%]">
            {t(
              "verifyOTPPageConstants.enterTheVerificationCodeSentToYourEmail"
            )}
          </p>
          <p className="text-textSm font-light text-stoneGray mb-[4px] xl:leading-[20px] space-y-[12px] xl:tracking-[0%]">
            {t("verifyOTPPageConstants.code")}
          </p>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex justify-start gap-[10px] mb-[24px]">
              <BaseOTPInput
                className="md:w-[60px] md:h-[44px] w-[30px] h-[40px] xxs:w-[50px] xxs:h-[40px] border border-lightGrayGamma rounded-[8px] text-center text-titleMid font-semibold focus:ring-0 placeholder:text-stoneGray text-obsidianBlack placeholder:opacity-50"
                otp={otpValue}
                setOtp={setOtpValue}
                length={6}
                error={formik.errors.otp}
                touched={formik.touched.otp}
              />
            </div>
            <BaseErrorMessage
              error={error}
              clearAction={clearForgotPasswordError}
            />
            <BaseButton
              type="submit"
              disabled={loading}
              loader={loading}
              className="w-full bg-deepTeal text-white rounded-lg border-0 py-[13px] font-medium text-textBase xl:leading-[24px] xl:tracking-[0px]"
              label={t("verifyOTPPageConstants.sendVerificationCode")}
            />
          </form>
        </div>
        <div className="flex justify-center items-center mt-[24px] gap-[6px]">
          <p className="text-charcoalBlack font-light text-opacity-50 text-textSm xl:leading-[20px] space-y-[12px] xl:tracking-[0%]">
            {t("verifyOTPPageConstants.didNotReceiveTheCode")}
          </p>
          <BaseButton
            onClick={handleResendClick}
            className="text-obsidianBlack text-textSm font-medium bg-transparent border-none focus:ring-0 p-0 text-base xl:leading-[20px] space-y-[12px] xl:tracking-[0%]"
            label={t("verifyOTPPageConstants.resendCode")}
            disabled={resendSecondsLeft > 0}
          />
          {resendSecondsLeft > 0 && (
            <span className="text-charcoalBlack text-opacity-70 text-textSm xl:leading-[20px] xl:tracking-[0%]">
              {formatResendTime(resendSecondsLeft)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
