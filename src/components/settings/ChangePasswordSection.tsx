"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import BaseButton from "@/components/base/BaseButton";
import BaseInput from "@/components/base/BaseInput";
import {
  InputFieldPasswordIcon,
  SaveChangesArrowIcon,
} from "@/assets/icons/CommonIcons";
import { getTranslationSync } from "@/i18n/i18n";
import {
  validationMessages,
  inputPlaceHolder,
  passwordRegex,
} from "@/components/constants/Validation";
import { changePassword } from "@/lib/api/SettingApi";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import BaseErrorMessage from "../base/BaseErrorMessage";

const ChangePasswordSection = () => {
  const t = (key: string, params?: Record<string, string>) => {
    return getTranslationSync(key, params);
  };
  const dispatch = useAppDispatch();
  const { error, loading } = useAppSelector((state) => state.settingState);

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validateOnMount: true,
    validationSchema: Yup.object({
      oldPassword: Yup.string().required(
        validationMessages.required(
          t("settingsPageConstants.changePassword.oldPassword")
        )
      ),
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
        )
        .matches(
          passwordRegex,
          t("settingsPageConstants.changePassword.passwordFormat")
        )
        .notOneOf(
          [Yup.ref("oldPassword")],
          t("settingsPageConstants.changePassword.passwordsCannotBeSame")
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
    onSubmit: (values) => {
      dispatch(
        changePassword({
          formData: {
            currentPassword: values.oldPassword,
            newPassword: values.newPassword,
            confirmPassword: values.confirmNewPassword,
          },
        })
      );
    },
  });

  const hasChanges = formik.dirty;
  const isSubmitDisabled = !hasChanges || !formik.isValid;
  const labelClassName =
    "text-stoneGray text-textSm mb-[4px] xl:leading-[20px] xl:tracking-[0%]";
  const inputClassName =
    "font-light text-textBase text-obsidianBlack rounded-[8px] py-[12px] px-[38px] border border-lightGrayGamma focus:ring-0 placeholder:text-obsidianBlack placeholder:text-opacity-30 placeholder:text-textSm placeholder:font-light xl:placeholder:[line-height:20px] xl:placeholder:tracking-[0%] xl:leading-[20px] xl:tracking-[0%]";

  return (
    <div className="flex flex-col bg-white rounded-[16px] ">
      <h2 className="text-obsidianBlack text-opacity-40 text-textSm font-light mb-[16px] xl:leading-[100%] xl:tracking-[0px] border-0 border-solid border-b px-[24px] py-[16px] border-graySoft border-opacity-50">
        {t("settingsPageConstants.changePassword.title")}
      </h2>
      <form onSubmit={formik.handleSubmit} className="py-[24px] px-[24px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
          <BaseInput
            label={t("settingsPageConstants.changePassword.oldPassword")}
            name="oldPassword"
            type="password"
            autoComplete="old-password"
            placeholder={inputPlaceHolder(
              t("settingsPageConstants.changePassword.oldPassword")
            )}
            icon={<InputFieldPasswordIcon />}
            onChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            value={formik.values.oldPassword}
            error={formik.errors.oldPassword}
            touched={formik.touched.oldPassword}
            fullWidth
            labelClassName={labelClassName}
            className={inputClassName}
          />
          <BaseInput
            label={t("settingsPageConstants.changePassword.newPassword")}
            name="newPassword"
            type="password"
            autoComplete="new-password"
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
            className={inputClassName}
          />
          <BaseInput
            label={t("settingsPageConstants.changePassword.confirmNewPassword")}
            name="confirmNewPassword"
            type="password"
            autoComplete="new-password"
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
            className={inputClassName}
          />
        </div>
        <BaseErrorMessage error={error.changePassword} />
        <div className="flex justify-end pt-[16px]">
          <BaseButton
            type="submit"
            disabled={isSubmitDisabled}
            loader={loading}
            className={`${
              isSubmitDisabled
                ? "text-obsidianBlack text-opacity-25 bg-grayDelta"
                : "text-white bg-deepTeal"
            } gap-[4px] rounded-[8px] font-medium text-textSm border-none px-[15px] py-[10px] xl:leading-[100%] xl:tracking-[0px]`}
            label={t("settingsPageConstants.changePassword.update")}
            endIcon={
              <SaveChangesArrowIcon
                className={`${
                  isSubmitDisabled
                    ? "text-obsidianBlack text-opacity-25"
                    : "text-white"
                }`}
              />
            }
          />
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordSection;