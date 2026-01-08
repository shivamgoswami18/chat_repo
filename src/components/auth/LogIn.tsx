"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import BaseInput from "@/components/base/BaseInput";
import BaseButton from "@/components/base/BaseButton";
import { login } from "@/lib/api/AuthApi";
import {
  emailRegex,
  inputPlaceHolder,
  validationMessages,
} from "@/components/constants/Validation";
import { routePath } from "@/components/constants/RoutePath";
import {
  InputFieldMailIcon,
  InputFieldPasswordIcon,
} from "@/assets/icons/CommonIcons";
import AuthBannerImage from "@/assets/images/auth_banner_image.png";
import Image from "next/image";
import { getTranslationSync } from "@/i18n/i18n";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectIsBusiness } from "@/lib/store/slices/authSlice";
import BaseErrorMessage from "@/components/base/BaseErrorMessage";
import { normalizeString } from "@/components/constants/Common";

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

const LogIn = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const isBusiness = useAppSelector(selectIsBusiness);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .required(validationMessages.required(t("logInLabel.email")))
        .matches(emailRegex, validationMessages.format(t("logInLabel.email"))),
      password: Yup.string()
        .required(validationMessages.required(t("logInLabel.password")))
    }),
    onSubmit: (values) => {
      dispatch(
        login({
          formData: {
            email: normalizeString(values.email),
            confirmPassword: values.password,
          },
          navigate: (path: string) => router.push(path),
        })
      );
    },
  });

  const labelClassName =
    "text-stoneGray text-textSm mb-[4px] xl:leading-[20px] space-y-[12px] xl:tracking-[0%]";
  const className =
    "font-light text-textBase px-[38px] text-obsidianBlack rounded-[8px] py-[12px] border border-lightGrayGamma focus:ring-0 placeholder:text-stoneGray placeholder:text-opacity-50 placeholder:text-textSm placeholder:font-light xl:placeholder:[line-height:20px] xl:placeholder:tracking-[0%] xl:leading-[20px] xl:tracking-[0%]";

  return (
    <div className="bg-cyanGradient rounded-2xl md:min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-container mx-auto flex items-center justify-center px-2 lg-px-[20px] py-10 lg:justify-between figmascreen:gap-[150px] widescreen:gap-[240px] gap-[40px]">
        <div className="hidden lg:flex items-center justify-center xl:px-[70px] desktop:px-[100px] desktop:py-[30px] figmascreen::pl-[171px] figmascreen:pt-[166px] figmascreen:pb-[122px]">
          <Image
            src={AuthBannerImage}
            alt={t("logInPageConstants.authPageImageAlt")}
            className=""
          />
        </div>
        <div className="flex flex-col items-center justify-center xl:px-[50px] desktop:py-[35px] desktop:px-[70px] figmascreen:py-[192px] figmascreen:pr-[101px]">
          <div className="bg-white px-[30px] py-[30px] rounded-[16px] xl:min-w-[400px] desktop:min-w-[460px]">
            <div className="mb-[30px]">
              <p className="text-textMd md:text-titleMid text-obsidianBlack font-bold mb-[24px] xl:leading-[100%] xl:tracking-[-1px]">
                {t("logInPageConstants.logo")}
              </p>
              <p className="text-textLg md:text-titleXxlPlusPlus text-obsidianBlack font-bold mb-[3px] xl:leading-[40px] space-y-3 xl:tracking-[-2%]">
                {isBusiness
                  ? t("logInPageConstants.loginAsProfessional")
                  : t("logInPageConstants.logIntoYourAccount")}
              </p>
              <p className="text-textSm text-obsidianBlack text-opacity-50 xl:leading-[20px] space-y-3 xl:tracking-[0%]">
                {isBusiness
                  ? t("logInPageConstants.loginToBrowseProjectsAndManageOffers")
                  : t("logInPageConstants.enterYourEmailAndPasswordToLogIn")}
              </p>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="space-y-[14px] mb-[25px]">
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
                  disabled={loading}
                  fullWidth
                  labelClassName={labelClassName}
                  className={className}
                />

                <BaseInput
                  label={t("logInLabel.password")}
                  name="password"
                  type="password"
                  placeholder={inputPlaceHolder(t("logInLabel.password"))}
                  icon={<InputFieldPasswordIcon />}
                  onChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  value={formik.values.password}
                  error={formik.errors.password}
                  touched={formik.touched.password}
                  disabled={loading}
                  fullWidth
                  labelClassName={labelClassName}
                  className={className}
                />
                <div className="flex items-center justify-end">
                  <BaseButton
                    onClick={() => router.push(routePath.forgotPassword)}
                    className="text-textSm text-charcoalBlack bg-transparent border-none p-0 font-light xl:leading-[100%] space-y-[12px] xl:tracking-[0%]"
                    label={t("logInPageConstants.forgotPassword")}
                  />
                </div>
              </div>
              <BaseErrorMessage error={error} />
              <BaseButton
                type="submit"
                disabled={loading}
                loader={loading}
                className="w-full bg-deepTeal text-white rounded-lg border-0 py-[13px] font-medium text-textBase xl:leading-[24px] xl:tracking-[0px]"
                label={t("logInPageConstants.logIn")}
              />
            </form>
          </div>
          <div className="flex justify-center items-center mt-[24px] gap-[6px]">
            <p className="text-charcoalBlack font-light text-opacity-50 text-textSm xl:leading-[20px] space-y-[12px] xl:tracking-[0%]">
              {t("logInPageConstants.doNotHaveAnAccount")}
            </p>
            <BaseButton
              onClick={() => router.push(routePath.register)}
              className="text-obsidianBlack text-textSm font-medium bg-transparent border-none focus:ring-0 p-0 text-base xl:leading-[20px] space-y-[12px] xl:tracking-[0%]"
              label={
                isBusiness
                  ? t("logInPageConstants.registerAsProfessional")
                  : t("logInPageConstants.registerNow")
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
