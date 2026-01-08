"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import BaseInput from "@/components/base/BaseInput";
import BaseSearchOptions, { SuggestionItem } from "@/components/base/BaseSearchOptions";
import BaseButton from "@/components/base/BaseButton";
import {
  fetchCounties,
  fetchServiceCategories,
  register,
  searchBusiness,
} from "@/lib/api/AuthApi";
import {
  emailRegex,
  inputPlaceHolder,
  phoneRegex,
  validationMessages,
} from "@/components/constants/Validation";
import { routePath } from "@/components/constants/RoutePath";
import {
  InputFieldMailIcon,
  InputFieldUserIcon,
  InputFieldBusinessIcon,
  InputFieldPhoneIcon,
  HowItWorksArrowRightIcon,
  InputFieldPasswordIcon,
} from "@/assets/icons/CommonIcons";
import AuthBannerImage from "@/assets/images/auth_banner_image.png";
import Image from "next/image";
import { getTranslationSync } from "@/i18n/i18n";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectIsBusiness, setRole } from "@/lib/store/slices/authSlice";
import { commonLabels } from "@/components/constants/Common";
import BaseErrorMessage from "@/components/base/BaseErrorMessage";
import { useEffect, useState } from "react";
import BaseModal from "@/components/base/BaseModal";

export interface ServiceCategory {
  _id: string;
  name: string;
}
export interface Area {
  _id: string;
  name: string;
}

const Register = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const isBusiness = useAppSelector(selectIsBusiness);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showNextModal, setShowNextModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(
    []
  );
  const [counties, setCounties] = useState<Area[]>([]);
  const [businessSuggestions, setBusinessSuggestions] = useState<
    { value: string; label: string; organizationNumber: string }[]
  >([]);
  const [businessSearchLoading, setBusinessSearchLoading] = useState(false);

  const t = (key: string, params?: Record<string, string>) => {
    return getTranslationSync(key, params);
  };

  useEffect(() => {
    dispatch(setRole(commonLabels.businessRole));
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, countiesData] = await Promise.all([
          fetchServiceCategories(),
          fetchCounties(),
        ]);
        setServiceCategories(servicesData);
        setCounties(countiesData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      businessName: "",
      email: "",
      fullName: "",
      phoneNumber: "",
      orgNo: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      name: Yup.string(),

      businessName: isBusiness
        ? Yup.string().required(
            validationMessages.required(t("registerLabel.businessName"))
          )
        : Yup.string(),

      email: Yup.string()
        .required(validationMessages.required(t("logInLabel.email")))
        .matches(emailRegex, validationMessages.format(t("logInLabel.email"))),

      fullName: isBusiness
        ? Yup.string().required(
            validationMessages.required(
              t("createProjectPageConstants.contactDetailsPageConstants.fullName")
            )
          )
        : Yup.string().required(
            validationMessages.required(
              t("createProjectPageConstants.contactDetailsPageConstants.fullName")
            )
          ),
      phoneNumber: isBusiness
        ? Yup.string()
            .required(validationMessages.required(t("registerLabel.phoneNumber")))
            .matches(
              phoneRegex,
              validationMessages.phoneNumber(t("registerLabel.phoneNumber"))
            )
        : Yup.string(),
      password: isBusiness
        ? Yup.string()
        : Yup.string()
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
      confirmPassword: isBusiness
        ? Yup.string()
        : Yup.string()
            .required(
              validationMessages.required(
                t("settingsPageConstants.changePassword.confirmNewPassword")
              )
            )
            .oneOf(
              [Yup.ref("password")],
              validationMessages.passwordsMatch(
                t("settingsPageConstants.changePassword.newPassword"),
                t("settingsPageConstants.changePassword.confirmNewPassword")
              )
            ),
    }),

    onSubmit: () => {
      if (isBusiness) {
        setShowServiceModal(true);
      } else {
        handleCustomerRegistration();
      }
    },
  });

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleAreaSelect = (countyId: string) => {
    setSelectedCounties((prev) => {
      if (prev.includes(countyId)) {
        return prev.filter((id) => id !== countyId);
      } else {
        return [...prev, countyId];
      }
    });
  };

  const handleNext = () => {
    if (selectedServices.length > 0) {
      setShowServiceModal(false);
      setShowNextModal(true);
    }
  };

  const handleBackToService = () => {
    setShowNextModal(false);
    setShowServiceModal(true);
  };

  const handleServiceModalCancel = () => {
    setShowServiceModal(false);
    setShowCancelModal(true);
  };

  const handleServiceModalClose = () => {
    setShowServiceModal(false);
    setShowCancelModal(true);
  };

  const handleCountyModalClose = () => {
    setShowNextModal(false);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    setSelectedServices([]);
    setSelectedCounties([]);
  };

  const handleDontCancel = () => {
    setShowCancelModal(false);
    setShowServiceModal(true);
  };

  const handleCustomerRegistration = () => {
    const payload = {
      role: "customer" as const,
      customerFields: {
        full_name: formik.values.fullName,
        email: formik.values.email,
        password: formik.values.password,
        confirmPassword: formik.values.confirmPassword,
      },
    };

    dispatch(
      register({
        formData: payload,
        navigate: (path: string = routePath.dashboard) => router.push(path),
      })
    );
  };

  const handleFinalSubmit = () => {
    const payload = {
      role: "business" as const,
      businessFields: {
        business_name: formik.values.businessName,
        full_name: formik.values.fullName,
        email: formik.values.email,
        phone_number: formik.values.phoneNumber,
        county: selectedCounties,
        org_no: formik.values.orgNo,
        category: selectedServices,
      },
    };

    dispatch(
      register({
        formData: payload,
        navigate: (path: string = routePath.projects) => router.push(path),
      })
    );

    setShowNextModal(false);
    setSelectedServices([]);
    setSelectedCounties([]);
  };

  const handleBusinessSearch = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setBusinessSuggestions([]);
      return;
    }

    setBusinessSearchLoading(true);
    try {
      const results = await searchBusiness(query);
      const formattedSuggestions = results.map((business) => ({
        value: business.name,
        label: business.name,
        organizationNumber: business.organizationNumber,
      }));
      setBusinessSuggestions(formattedSuggestions);
    } catch (error) {
      console.error("Error searching business:", error);
      setBusinessSuggestions([]);
    } finally {
      setBusinessSearchLoading(false);
    }
  };

  const handleBusinessSelect = (selectedBusiness: SuggestionItem) => {
    if (selectedBusiness && typeof selectedBusiness === 'object') {
      if (selectedBusiness.organizationNumber) {
        formik.setFieldValue("orgNo", selectedBusiness.organizationNumber as string);
      }
    }
  };

  const labelClassName =
    "text-stoneGray text-textSm mb-[4px] xl:leading-[20px] space-y-[12px] xl:tracking-[0%]";
  const className =
    "font-light text-textBase px-[38px] text-obsidianBlack rounded-[8px] py-[12px] border border-lightGrayGamma focus:ring-0 placeholder:text-stoneGray placeholder:text-opacity-50 placeholder:text-textSm placeholder:font-light xl:placeholder:[line-height:20px] xl:placeholder:tracking-[0%] xl:leading-[20px] xl:tracking-[0%]";

  return (
    <div className="bg-cyanGradient rounded-[16px] md:min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-container mx-auto flex items-center justify-center px-2 lg-px-[20px] py-10 lg:justify-between figmascreen:gap-[150px] widescreen:gap-[240px] gap-[40px]">
        <div className="hidden lg:flex items-center justify-center xl:px-[70px] desktop:px-[100px] desktop:py-[30px] figmascreen::pl-[171px] figmascreen:pt-[166px] figmascreen:pb-[122px]">
          <Image
            src={AuthBannerImage}
            alt={t("logInPageConstants.authPageImageAlt")}
            className=""
          />
        </div>
        <div className="flex flex-col items-center justify-center xl:px-[50px] desktop:py-[35px] desktop:px-[70px] figmascreen:py-[110px] figmascreen:pr-[101px]">
          <div className="bg-white px-[30px] py-[30px] rounded-[16px] xl:min-w-[400px] desktop:min-w-[460px]">
            <div className="mb-[30px]">
              <p className="text-textMd md:text-titleMid text-obsidianBlack font-bold mb-[24px] xl:leading-[100%] xl:tracking-[-1px]">
                {t("logInPageConstants.logo")}
              </p>
              <p className="text-textLg md:text-titleXxlPlusPlus text-obsidianBlack font-bold mb-[3px] xl:leading-[40px] space-y-[12px] xl:tracking-[-2%]">
                {isBusiness
                  ? t("logInPageConstants.registerAsProfessional")
                  : t("registerPageConstants.createYourAccount")}
              </p>
              <p className="text-textSm text-obsidianBlack text-opacity-50 xl:leading-[20px] space-y-3 xl:tracking-[0%]">
                {t("registerPageConstants.enterYourDetailsToCreateAnAccount")}
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-[24px]">
              {isBusiness ? (
                <div className="relative">
                  {businessSearchLoading && (
                    <div className="absolute inset-0 z-10 bg-white bg-opacity-60" />
                  )}
                  <div className={businessSearchLoading ? "opacity-50" : "opacity-100"}>
                    <BaseSearchOptions
                      label={t("registerLabel.businessName")}
                      name="businessName"
                      placeholder={inputPlaceHolder(
                        t("registerLabel.businessName")
                      )}
                      icon={<InputFieldBusinessIcon />}
                      onChange={(value) => {
                        formik.setFieldValue("businessName", value);
                      }}
                      onSelect={handleBusinessSelect}
                      handleBlur={formik.handleBlur}
                      value={formik.values.businessName}
                      error={formik.errors.businessName}
                      touched={formik.touched.businessName}
                      disabled={loading}
                      fullWidth
                      labelClassName={labelClassName}
                      className={className}
                      suggestions={businessSuggestions}
                      onSearch={handleBusinessSearch}
                      loading={businessSearchLoading}
                      debounceDelay={500}
                      minSearchLength={2}
                      itemTemplate={(item) => (
                        <div className="flex flex-col">
                          <span className="text-obsidianBlack text-textBase font-light xl:leading-[20px] xl:tracking-[0%]">
                            {item.label}
                          </span>
                          <span className="text-obsidianBlack text-opacity-60 text-textSm font-light xl:leading-[18px] xl:tracking-[0%]">
                            {t("registerLabel.orgNo")}: {item.organizationNumber}
                          </span>
                        </div>
                      )}
                    />
                  </div>
                </div>
              ) : (
                <BaseInput
                  label={t(
                    "createProjectPageConstants.contactDetailsPageConstants.fullName"
                  )}
                  name="fullName"
                  type="text"
                  placeholder={inputPlaceHolder(
                    t(
                      "createProjectPageConstants.contactDetailsPageConstants.fullName"
                    )
                  )}
                  icon={<InputFieldUserIcon />}
                  onChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  value={formik.values.fullName}
                  error={formik.errors.fullName}
                  touched={formik.touched.fullName}
                  disabled={loading}
                  fullWidth
                  labelClassName={labelClassName}
                  className={className}
                />
              )}
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
              {isBusiness ? (
                <>
                  <BaseInput
                    label={t(
                      "createProjectPageConstants.contactDetailsPageConstants.fullName"
                    )}
                    name="fullName"
                    type="text"
                    placeholder={inputPlaceHolder(
                      t(
                        "createProjectPageConstants.contactDetailsPageConstants.fullName"
                      )
                    )}
                    icon={<InputFieldUserIcon />}
                    onChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    value={formik.values.fullName}
                    error={formik.errors.fullName}
                    touched={formik.touched.fullName}
                    disabled={loading}
                    fullWidth
                    labelClassName={labelClassName}
                    className={className}
                  />
                  <BaseInput
                    label={t("registerLabel.phoneNumber")}
                    name="phoneNumber"
                    type="text"
                    numbersOnly
                    placeholder={inputPlaceHolder(
                      t("registerLabel.phoneNumber")
                    )}
                    icon={<InputFieldPhoneIcon />}
                    onChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    value={formik.values.phoneNumber}
                    error={formik.errors.phoneNumber}
                    touched={formik.touched.phoneNumber}
                    disabled={loading}
                    fullWidth
                    labelClassName={labelClassName}
                    className={className}
                    />
                  <BaseInput
                    label={t("registerLabel.orgNo")}
                    name="orgNo"
                    type="text"
                    placeholder={inputPlaceHolder(t("registerLabel.orgNo"))}
                    icon={<InputFieldBusinessIcon />}
                    onChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    value={formik.values.orgNo}
                    disabled={loading}
                    readOnly
                    fullWidth
                    labelClassName={labelClassName}
                    className={`${className} bg-gray-50`}
                  />
                </>
              ) : (
                <>
                  <BaseInput
                    label={t(
                      "settingsPageConstants.changePassword.newPassword"
                    )}
                    name="password"
                    type="password"
                    placeholder={inputPlaceHolder(
                      t("settingsPageConstants.changePassword.newPassword")
                    )}
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
                  <BaseInput
                    label={t(
                      "settingsPageConstants.changePassword.confirmNewPassword"
                    )}
                    name="confirmPassword"
                    type="password"
                    placeholder={inputPlaceHolder(
                      t(
                        "settingsPageConstants.changePassword.confirmNewPassword"
                      )
                    )}
                    icon={<InputFieldPasswordIcon />}
                    onChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                    error={formik.errors.confirmPassword}
                    touched={formik.touched.confirmPassword}
                    disabled={loading}
                    fullWidth
                    labelClassName={labelClassName}
                    className={className}
                  />
                </>
              )}
              <BaseErrorMessage error={error} />
              <BaseButton
                type="submit"
                disabled={loading}
                loader={loading}
                className="w-full mt-[25px] bg-deepTeal text-white rounded-lg border-0 py-[13px] font-medium text-textBase xl:leading-[24px] xl:tracking-[0px]"
                label={t("logInPageConstants.registerNow")}
              />
            </form>
          </div>
          <div className="flex justify-center items-center mt-[24px] gap-[6px]">
            <p className="text-charcoalBlack font-light text-opacity-50 text-textSm xl:leading-[20px] space-y-[12px] xl:tracking-[0%]">
              {t("registerPageConstants.alreadyHaveAnAccount")}
            </p>
            <BaseButton
              onClick={() => router.push(routePath.logIn)}
              className="text-obsidianBlack text-textSm font-medium bg-transparent border-none focus:ring-0 p-0 text-base xl:leading-[20px] space-y-[12px] xl:tracking-[0%]"
              label={t("logInPageConstants.logIn")}
            />
          </div>
        </div>
      </div>

      <BaseModal
        visible={showServiceModal}
        onHide={handleServiceModalClose}
        header={t("registerLabel.selectServiceCategories")}
        maxWidth="600px"
        contentClassName="py-4 px-6"
        footerClassName="py-4 px-6"
        headerClassName="py-4 px-6 text-lg font-semibold"
        footer={
          <div className="flex gap-[12px] justify-between">
            <BaseButton
              label={t("commonConstants.cancel")}
              onClick={handleServiceModalCancel}
              className="bg-transparent text-obsidianBlack border border-lightGrayGamma rounded-lg px-6 py-2"
            />
            <BaseButton
              label={t("commonConstants.next")}
              onClick={handleNext}
              endIcon={<HowItWorksArrowRightIcon />}
              disabled={selectedServices.length === 0}
              className="bg-deepTeal text-white rounded-lg border-0 px-6 py-2 font-medium disabled:opacity-50"
            />
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {serviceCategories?.map((service) => (
            <BaseButton
              key={service._id}
              onClick={() => handleServiceSelect(service._id)}
              className={`px-10 py-4 rounded-lg border-2 text-center font-medium transition-all ${
                selectedServices.includes(service._id)
                  ? "border-deepTeal bg-deepTeal bg-opacity-5 text-deepTeal"
                  : "border-lightGrayGamma bg-white text-obsidianBlack hover:border-deepTeal hover:border-opacity-50"
              }`}
            >
              {service.name}
            </BaseButton>
          ))}
        </div>
      </BaseModal>

      <BaseModal
        visible={showNextModal}
        onHide={handleCountyModalClose}
        header={t("registerLabel.selectServiceAreas")}
        maxWidth="600px"
        contentClassName="py-4 px-6"
        footerClassName="py-4 px-6"
        headerClassName="py-4 px-6 text-lg font-semibold"
        footer={
          <div className="flex gap-[12px] justify-between">
            <BaseButton
              label={t("commonConstants.back")}
              onClick={handleBackToService}
              className="bg-transparent text-obsidianBlack border border-lightGrayGamma rounded-lg px-6 py-2"
            />
            <BaseButton
              label={t("commonConstants.submit")}
              onClick={handleFinalSubmit}
              disabled={selectedCounties.length === 0 || loading}
              loader={loading}
              className="bg-deepTeal text-white rounded-lg border-0 px-6 py-2 font-medium disabled:opacity-50"
            />
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {counties?.map((area) => (
            <BaseButton
              key={area._id}
              onClick={() => handleAreaSelect(area._id)}
              className={`px-10 py-4 rounded-lg border-2 text-center font-medium transition-all ${
                selectedCounties.includes(area._id)
                  ? "border-deepTeal bg-deepTeal bg-opacity-5 text-deepTeal"
                  : "border-lightGrayGamma bg-white text-obsidianBlack hover:border-deepTeal hover:border-opacity-50"
              }`}
            >
              {area.name}
            </BaseButton>
          ))}
        </div>
      </BaseModal>

      <BaseModal
        visible={showCancelModal}
        onHide={handleConfirmCancel}
        header={t("registerLabel.cancelRegistration")}
        maxWidth="500px"
        contentClassName="py-4 px-6"
        footerClassName="py-4 px-6"
        headerClassName="py-4 px-6 text-lg font-semibold"
        footer={
          <div className="flex gap-[12px] justify-between">
            <BaseButton
              label={t("registerLabel.noContinue")}
              onClick={handleDontCancel}
              className="bg-deepTeal text-white rounded-lg border-0 px-6 py-2 font-medium"
            />
            <BaseButton
              label={t("registerLabel.login")}
              onClick={() => {
                router.push(routePath.logIn);
              }}
              className="bg-whitePrimary text-bluePrimary rounded-lg border-0 px-6 py-2 font-medium"
            />
            <BaseButton
              label={t("registerLabel.yesCancel")}
              onClick={handleConfirmCancel}
              className="bg-transparent text-redPrimary border border-redPrimary rounded-lg px-6 py-2 font-medium hover:bg-red-50"
            />
          </div>
        }
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-obsidianBlack">
            {t("registerLabel.doYouWantToCancel")}
          </h3>
          <p className="text-textSm text-obsidianBlack text-opacity-70">
            {t("registerLabel.areYouSure")}
          </p>
        </div>
      </BaseModal>
    </div>
  );
};

export default Register;