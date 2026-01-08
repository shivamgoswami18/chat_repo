"use client";

import { BackArrowIcon, InputFieldMailIcon } from "@/assets/icons/CommonIcons";
import BaseButton from "../base/BaseButton";
import BaseInput from "../base/BaseInput";
import { getTranslationSync } from "@/i18n/i18n";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  emailRegex,
  inputPlaceHolder,
  validationMessages,
} from "@/components/constants/Validation";
import { useRouter } from "next/navigation";
import { routePath } from "../constants/RoutePath";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { verifyForgotEmail } from "@/lib/api/ForgotPasswordApi";
import BaseErrorMessage from "../base/BaseErrorMessage";
import { clearError as clearForgotPasswordError } from "@/lib/store/slices/forgotPasswordSlice";

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

const ForgotPassword = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.forgotPassword);
  const formik = useFormik({
    initialValues: { email: "" },

    validationSchema: Yup.object({
      email: Yup.string()
        .required(validationMessages.required(t("logInLabel.email")))
        .matches(emailRegex, validationMessages.format(t("logInLabel.email"))),
    }),
    onSubmit: (values) => {
      dispatch(
        verifyForgotEmail({
          formData: {
            email: values.email,
          },
        })
      );
    },
  });

  return (
    <div className="bg-cyanGradient rounded-[16px] md:min-h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center h-full px-4 py-[64px] figmascreen:px-[510px] figmascreen:pt-[229px] figmascreen:pb-[245px]">
        <div className="md:w-[460px] xs:w-[450px] w-full mx-auto flex flex-col p-[30px] bg-white rounded-[16px] shadow-sm">
          <div className="text-start mb-[30px]">
            <BaseButton
              className="text-obsidianBlack bg-transparent border-none"
              onClick={() => router.back()}
            >
              <BackArrowIcon size={24} />
            </BaseButton>
          </div>
          <p className="text-textLg md:text-titleXxlPlusPlus text-obsidianBlack font-bold xl:leading-[40px] space-y-[12px] xl:tracking-[-2%] mb-[10px]">
            {t("forgotPasswordPageConstants.forgotYourPassword")}
          </p>
          <p className="text-obsidianBlack text-opacity-50 text-textSm mb-[24px] xl:leading-[20px] space-y-[12px] xl:tracking-[0%]">
            {t("forgotPasswordPageConstants.enterYourRegisteredEmail")}
          </p>
          <form onSubmit={formik.handleSubmit} className="w-full">
            <BaseInput
              label={t("logInLabel.email")}
              name="email"
              type="email"
              placeholder={inputPlaceHolder(t("logInLabel.email"))}
              icon={<InputFieldMailIcon />}
              onChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.email}
              error={formik.errors.email}
              touched={formik.touched.email}
              fullWidth
              labelClassName="text-stoneGray text-textSm mb-[4px] xl:leading-[20px] space-y-[12px] xl:tracking-[0%]"
              className="font-light text-textBase px-[38px] text-obsidianBlack rounded-[8px] py-[12px] border border-lightGrayGamma focus:ring-0 placeholder:text-obsidianBlack placeholder:text-opacity-30 placeholder:text-textSm placeholder:font-light xl:placeholder:[line-height:20px] xl:placeholder:tracking-[0%] xl:leading-[20px] xl:tracking-[0%]"
            />
            <BaseErrorMessage
              error={error}
              clearAction={clearForgotPasswordError}
            />
            <BaseButton
              type="submit"
              disabled={loading}
              loader={loading}
              className="w-full mt-[24px] bg-deepTeal text-white rounded-lg border-0 py-[13px] font-medium text-textBase xl:leading-[24px] xl:tracking-[0px]"
              label={t("verifyOTPPageConstants.sendVerificationCode")}
            />
          </form>
        </div>
        <div className="flex justify-center items-center mt-[24px] gap-[6px]">
          <p className="text-charcoalBlack font-light text-opacity-50 text-textSm xl:leading-[20px] space-y-[12px] xl:tracking-[0%]">
            {t("forgotPasswordPageConstants.doYouRememberYourPassword")}
          </p>
          <BaseButton
            onClick={() => router.push(routePath.logIn)}
            className="text-obsidianBlack text-textSm font-medium bg-transparent border-none focus:ring-0 p-0 text-base xl:leading-[20px] space-y-[12px] xl:tracking-[0%]"
            label={t("logInPageConstants.logIn")}
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
