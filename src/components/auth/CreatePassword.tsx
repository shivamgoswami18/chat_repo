"use client";

import {
  BackArrowIcon,
  InputFieldPasswordIcon,
} from "@/assets/icons/CommonIcons";
import BaseButton from "../base/BaseButton";
import BaseInput from "../base/BaseInput";
import { getTranslationSync } from "@/i18n/i18n";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import { routePath } from "../constants/RoutePath";
import { inputPlaceHolder, validationMessages } from "../constants/Validation";
import { useState } from "react";
import { createPassword } from "@/lib/api/AuthApi";

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

const CreatePassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);

  const emailFromQuery = searchParams.get("email") || "";

  const formik = useFormik({
    initialValues: { newPassword: "", confirmNewPassword: "" },

    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required(
          validationMessages.required(
            t("settingsPageConstants.changePassword.newPassword")
          )
        )
        .min(
          8,
          validationMessages.passwordLength(
            t("settingsPageConstants.changePassword.newPassword"),
            "8"
          )
        ),
      confirmNewPassword: Yup.string()
        .required(
          validationMessages.required(
            t("settingsPageConstants.changePassword.confirmNewPassword")
          )
        )
        .oneOf(
          [Yup.ref("newPassword")],
          validationMessages.passwordsMatch(
            t("settingsPageConstants.changePassword.newPassword"),
            t("settingsPageConstants.changePassword.confirmNewPassword")
          )
        ),
    }),

    onSubmit: async (values) => {
      if (!emailFromQuery) {
        return;
      }

      setSubmitting(true);
      const isSuccess = await createPassword({
        email: decodeURIComponent(emailFromQuery),
        newPassword: values.newPassword,
        confirmPassword: values.confirmNewPassword,
      });
      setSubmitting(false);

      if (isSuccess) {
        router.push(routePath.logIn);
      }
    },
  });

  const labelClassName =
    "text-stoneGray text-textSm mb-[4px] xl:leading-[20px] space-y-[12px] xl:tracking-[0%]";
  const className =
    "font-light text-textBase px-[38px] text-obsidianBlack rounded-[8px] py-[12px] border border-lightGrayGamma focus:ring-0 placeholder:text-obsidianBlack placeholder:text-opacity-30 placeholder:text-textSm placeholder:font-light xl:placeholder:[line-height:20px] xl:placeholder:tracking-[0%] xl:leading-[20px] xl:tracking-[0%]";
  return (
    <div className="bg-cyanGradient rounded-[16px] md:min-h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center h-full px-4 py-[64px] figmascreen:px-[510px] figmascreen:pt-[216px] figmascreen:pb-[232px]">
        <div className="md:w-[460px] xs:w-[450px] w-full mx-auto flex flex-col p-[30px] bg-white rounded-[16px] shadow-sm">
          <div className="text-start mb-[30px]">
            <BaseButton
              className="bg-transparent border-none p-0"
              onClick={() => router.back()}
            >
              <BackArrowIcon />
            </BaseButton>
          </div>
          <p className="text-textLg md:text-titleXxlPlusPlus text-obsidianBlack font-bold xl:leading-[40px] space-y-[12px] xl:tracking-[-2%] mb-[10px]">
            {t("registerLabel.createYourPassword")}
          </p>
          <p className="text-obsidianBlack text-opacity-50 text-textSm mb-[24px] xl:leading-[20px] space-y-[12px] xl:tracking-[0%]">
            {t("resetPasswordPageConstants.newPasswordValidation")}
          </p>
          <form onSubmit={formik.handleSubmit} className="w-full">
            <div className="space-y-[20px]">
              <BaseInput
                label={t("settingsPageConstants.changePassword.newPassword")}
                name="newPassword"
                type="password"
                placeholder={inputPlaceHolder(
                  t("settingsPageConstants.changePassword.newPassword")
                )}
                icon={<InputFieldPasswordIcon />}
                onChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                value={formik.values.newPassword}
                error={formik.errors.newPassword}
                touched={formik.touched.newPassword}
                fullWidth
                labelClassName={labelClassName}
                className={className}
              />
              <BaseInput
                label={t(
                  "settingsPageConstants.changePassword.confirmNewPassword"
                )}
                name="confirmNewPassword"
                type="password"
                placeholder={inputPlaceHolder(
                  t("settingsPageConstants.changePassword.confirmNewPassword")
                )}
                icon={<InputFieldPasswordIcon />}
                onChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                value={formik.values.confirmNewPassword}
                error={formik.errors.confirmNewPassword}
                touched={formik.touched.confirmNewPassword}
                fullWidth
                labelClassName={labelClassName}
                className={className}
              />
            </div>
            <BaseButton
              type="submit"
              disabled={submitting}
              loader={submitting}
              className="w-full mt-[30px] bg-deepTeal text-white rounded-lg border-0 py-[13px] font-medium text-textBase xl:leading-[24px] xl:tracking-[0px]"
              label={t("registerLabel.createPassword")}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePassword;
