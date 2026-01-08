"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import BannerImage from "@/assets/images/project_details_portfolio_banner_image.jpg";
import { getTranslationSync } from "@/i18n/i18n";
import BaseFileUpload from "../base/BaseFileUpload";

import {
  ChevronDownIcon,
  InputFieldMailIcon,
  InputFieldPhoneIcon,
  InputFieldUserIcon,
  LocationPinIcon,
  SaveChangesArrowIcon,
  UploadIcon,
} from "@/assets/icons/CommonIcons";
import BaseDropdown from "../base/BaseDropdown";
import BaseInput from "../base/BaseInput";
import BaseButton from "../base/BaseButton";
import BaseLoader from "../base/BaseLoader";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  emailRegex,
  phoneRegex,
  validationMessages,
  selectPlaceHolder,
  inputPlaceHolder,
} from "../constants/Validation";
import ServiceModal from "./ServiceModal";
import AreaModal from "./AreaModal";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { ViewProfile, EditProfile, UploadFile } from "@/lib/api/UserApi";
import { fetchCounties } from "@/lib/api/AuthApi";
import { BaseImageURL } from "@/lib/api/ApiService";
import { handleProfileImageChange } from "@/components/constants/Common";
import type { County } from "@/types/profile";

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

function BusinessProfile() {
  const dispatch = useAppDispatch();
  const { profile, loadingProfile, uploadingFile } = useAppSelector(
    (state) => state.user
  );
  const [profileImagePath, setProfileImagePath] = useState<string | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [services, setServices] = React.useState<string[]>([]);
  const [area, setArea] = useState<string[]>([]);
  const [initialServices, setInitialServices] = React.useState<string[]>([]);
  const [initialArea, setInitialArea] = useState<string[]>([]);
  const [counties, setCounties] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingServices, setIsSavingServices] = useState(false);
  const [isSavingAreas, setIsSavingAreas] = useState(false);

  useEffect(() => {
    dispatch(ViewProfile());
  }, [dispatch]);

  useEffect(() => {
    const loadCounties = async () => {
      const data = (await fetchCounties()) as County[];
      setCounties(
        data?.map((county: County) => ({
          value: county._id,
          label: county.name,
        }))
      );
    };
    loadCounties();
  }, []);

  useEffect(() => {
    if (profile) {
      formik.setValues({
        name: profile.business_name || "",
        email: profile.email || "",
        phone: profile.phone_number || "",
        city: profile.county?.[0]?.county_id || "",
      });

      const imagePath = profile.profile_image;
      setProfileImagePath(imagePath);
      setProfileImagePreview(BaseImageURL + imagePath);

      const categoryIds = profile.category?.map((cat) => cat._id) || [];
      setServices(categoryIds);
      setInitialServices(categoryIds);

      const countyIds = profile.county?.map((c) => c.county_id) || [];
      setArea(countyIds);
      setInitialArea(countyIds);
    }
  }, [profile]);

  const handleImageChange = async (imageUrl: string | null, file: File | null) => {
    await handleProfileImageChange({
      imageUrl,
      file,
      setProfileImagePath,
      setProfileImagePreview,
      upload: (uploadFile: File) => dispatch(UploadFile(uploadFile)),
      baseImageURL: BaseImageURL,
    });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(
        validationMessages.required(t("profilePageConstants.companyName"))
      ),
      email: Yup.string()
        .required(validationMessages.required(t("logInLabel.email")))
        .matches(emailRegex, validationMessages.format(t("logInLabel.email"))),
      phone: Yup.string()
        .required(validationMessages.required(t("profilePageConstants.phone")))
        .matches(
          phoneRegex,
          validationMessages.format(t("profilePageConstants.phone"))
        ),
      city: Yup.string().required(
        validationMessages.required(t("profilePageConstants.city"))
      ),
    }),
    onSubmit: async (values) => {
      setIsSaving(true);
      try {
        const payload: {
          userId?: string;
          full_name?: string;
          email?: string;
          phone_number?: string;
          county?: string[];
          profile_image?: string | null;
        } = {
          userId: profile?._id,
        };

        const initialName = profile?.business_name || "";
        const initialEmail = profile?.email || "";
        const initialPhone = profile?.phone_number || "";
        const initialCityId = profile?.county?.[0]?.county_id || "";
        const initialImage = profile?.profile_image ?? null;

        if (values.name !== initialName) {
          payload.full_name = values.name;
        }

        if (values.email !== initialEmail) {
          payload.email = values.email;
        }

        if (values.phone !== initialPhone) {
          payload.phone_number = values.phone;
        }

        if (values.city !== initialCityId) {
          payload.county = [values.city];
        }

        if (profileImagePath !== initialImage) {
          payload.profile_image = profileImagePath;
        }

        await dispatch(EditProfile({ payload }));
      } finally {
        setIsSaving(false);
      }
    },
  });

  const handleServiceSave = async () => {
    if (!hasServiceChanges) return;

    setIsSavingServices(true);
    try {
      const payload = {
        userId: profile?._id,
        category: services,
      };

      const success = await dispatch(EditProfile({ payload }));
      if (success) {
        setInitialServices([...services]);
      }
    } finally {
      setIsSavingServices(false);
    }
  };

  const handleAreaSave = async () => {
    if (!hasAreaChanges) return;

    setIsSavingAreas(true);
    try {
      const payload = {
        userId: profile?._id,
        county: area,
      };

      const success = await dispatch(EditProfile({ payload }));
      if (success) {
        setInitialArea([...area]);
      }
    } finally {
      setIsSavingAreas(false);
    }
  };
  const initialName = profile?.business_name || "";
  const initialEmail = profile?.email || "";
  const initialPhone = profile?.phone_number || "";
  const initialCityId = profile?.county?.[0]?.county_id || "";
  const initialImage = profile?.profile_image ?? null;

  const hasChanges =
    formik.values.name !== initialName ||
    formik.values.email !== initialEmail ||
    formik.values.phone !== initialPhone ||
    formik.values.city !== initialCityId ||
    profileImagePath !== initialImage;
  const hasServiceChanges =
    JSON.stringify([...services].sort()) !==
    JSON.stringify([...initialServices].sort());
  const hasAreaChanges =
    JSON.stringify([...area].sort()) !==
    JSON.stringify([...initialArea].sort());

  const labelClassName =
    "text-stoneGray text-textSm mb-[4px] xl:leading-[20px] xl:tracking-[0%]";
  const inputClassName =
    "font-light text-textBase px-[38px] text-obsidianBlack rounded-[8px] py-[12px] border border-lightGrayGamma focus:ring-0 placeholder:text-obsidianBlack placeholder:text-opacity-30 placeholder:text-textSm placeholder:font-light xl:placeholder:[line-height:20px] xl:placeholder:tracking-[0%] xl:leading-[20px] xl:tracking-[0%]";

  if (loadingProfile) {
    return (
      <div className="rounded-[16px] bg-white shadow-[0px_8px_16px_0px_#108A0008] p-[20px] md:p-[40px] lg:p-[76px]">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <BaseLoader size="xl" className="mx-auto text-deepTeal" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[16px] bg-white shadow-[0px_8px_16px_0px_#108A0008] overflow-hidden">
      <div className="relative w-full">
        <div className="relative w-full h-[200px] rounded-t-[16px] overflow-hidden">
          <Image
            src={BannerImage}
            alt={t("projectDetailProfessionalProfileConstants.bannerImageAlt")}
            fill
            className="object-cover"
          />
          <div className="absolute top-[14px] right-[14px] bg-opacity-95 inline-flex px-[12px] py-[4px] bg-white text-deepTeal font-medium text-textBase xl:leading-[100%] xl:tracking-[0px] rounded-[8px]">
            {t("profilePageConstants.shareProfile")}
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 top-[200px] rounded-[60px] overflow-hidden -translate-y-1/2 z-10 border-solid border-white">
          <BaseFileUpload
            name="profileImage"
            accept="image/*"
            customUI={true}
            imagePreview={profileImagePreview}
            onImageChange={handleImageChange}
            containerClassName="relative w-[100px] h-[100px] lg:w-[114px] lg:h-[114px] bg-offWhite border-solid border border-lightGrayGamma overflow-visible"
            uploadPlaceholder={
              <div className="w-full h-full flex flex-col items-center justify-center">
                {uploadingFile ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deepTeal"></div>
                ) : (
                  <>
                    <UploadIcon className="text-stoneGray mb-[14px]" />
                    <span className="text-stoneGray text-textSm font-light xl:leading-[20px] xl:tracking-[0%]">
                      {t("profilePageConstants.upload")}
                    </span>
                  </>
                )}
              </div>
            }
            editButtonLabel={t("profilePageConstants.edit")}
            editButtonClassName="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-0 text-white bg-obsidianBlack bg-opacity-75 text-textSm border-none rounded-t-[0px] rounded-b-[8px] font-light xl:leading-[20px] xl:tracking-[0%] w-[100px] h-[28px] px-2 py-1 cursor-pointer hover:bg-opacity-90 transition-all"
            showEditButton={true}
          />
        </div>
      </div>
      <div className="p-[20px] md:p-[40px] lg:p-[76px] mt-[33px]">
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
            <div className="space-y-[20px]">
              <BaseInput
                label={t("profilePageConstants.companyName")}
                name="name"
                type="text"
                placeholder={inputPlaceHolder(
                  t("profilePageConstants.companyName")
                )}
                icon={<InputFieldUserIcon />}
                onChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                value={formik.values.name}
                error={formik.errors.name}
                touched={formik.touched.name}
                fullWidth
                labelClassName={labelClassName}
                className={inputClassName}
              />
              <BaseInput
                label={t("profilePageConstants.phone")}
                name="phone"
                type="tel"
                placeholder={inputPlaceHolder(t("profilePageConstants.phone"))}
                icon={<InputFieldPhoneIcon />}
                onChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                value={formik.values.phone}
                error={formik.errors.phone}
                touched={formik.touched.phone}
                fullWidth
                labelClassName={labelClassName}
                className={inputClassName}
              />
            </div>

            <div className="space-y-[20px]">
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
                labelClassName={labelClassName}
                className={inputClassName}
              />
              <BaseDropdown
                label={t("profilePageConstants.city")}
                name="city"
                placeholder={selectPlaceHolder(t("profilePageConstants.city"))}
                icon={<LocationPinIcon className="opacity-30" />}
                endIcon={
                  <ChevronDownIcon className="text-obsidianBlack opacity-30 w-[20px] h-[20px]" />
                }
                onChange={(value) => formik.setFieldValue("city", value)}
                handleBlur={formik.handleBlur}
                value={formik.values.city}
                error={formik.errors.city}
                touched={formik.touched.city}
                options={counties}
                fullWidth
                labelClassName={labelClassName}
                className="font-light text-textBase text-obsidianBlack rounded-[8px] border border-lightGrayGamma focus:ring-0"
              />
            </div>
          </div>
                
          <div className="flex justify-end mt-[30px] pb-[46px] border-0 border-solid border-b border-graySoft">
            <BaseButton
              type="submit"
              disabled={!hasChanges || uploadingFile || isSaving}
              loader={isSaving}
              className={`${
                hasChanges && !uploadingFile && !isSaving
                  ? "text-white bg-deepTeal"
                  : "text-obsidianBlack text-opacity-25 bg-grayDelta"
              } gap-[4px] rounded-[8px] font-medium text-textSm border-none px-[15px] py-[10px] xl:leading-[100%] xl:tracking-[0px]`}
              label={t("profilePageConstants.saveChanges")}
              endIcon={
                !isSaving && (
                  <SaveChangesArrowIcon
                    className={`${
                      hasChanges && !uploadingFile
                        ? "text-white"
                        : "text-obsidianBlack text-opacity-25"
                    }`}
                  />
                )
              }
            />
          </div>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 justify-between py-[24px] gap-[10px]">
          <div>
            <p className="text-obsidianBlack text-opacity-40 text-textSm xl:leading-[100%] xl:tracking-[0px] font-light">
              {t("projectDetailProfessionalProfileConstants.servicesOffered")}
            </p>
            <ServiceModal value={services} onChange={setServices} />
            <BaseButton
              type="button"
              onClick={handleServiceSave}
              disabled={!hasServiceChanges || isSavingServices}
              loader={isSavingServices}
              className={`${
                hasServiceChanges && !isSavingServices
                  ? "text-white bg-deepTeal"
                  : "text-obsidianBlack text-opacity-25 bg-grayDelta"
              } gap-[4px] rounded-[8px] font-medium text-textSm border-none px-[15px] py-[10px] xl:leading-[100%] xl:tracking-[0px] mt-[30px]`}
              label={t("profilePageConstants.saveChanges")}
              endIcon={
                !isSavingServices && (
                  <SaveChangesArrowIcon
                    className={`${
                      hasServiceChanges
                        ? "text-white"
                        : "text-obsidianBlack text-opacity-25"
                    }`}
                  />
                )
              }
            />
          </div>
          <div>
            <p className="text-obsidianBlack text-opacity-40 text-textSm xl:leading-[100%] xl:tracking-[0px] font-light">
              {t("projectDetailProfessionalProfileConstants.workAreas")}
            </p>
            <AreaModal value={area} onChange={setArea} />
            <BaseButton
              type="button"
              onClick={handleAreaSave}
              disabled={!hasAreaChanges || isSavingAreas}
              loader={isSavingAreas}
              className={`${
                hasAreaChanges && !isSavingAreas
                  ? "text-white bg-deepTeal"
                  : "text-obsidianBlack text-opacity-25 bg-grayDelta"
              } gap-[4px] rounded-[8px] font-medium text-textSm border-none px-[15px] py-[10px] xl:leading-[100%] xl:tracking-[0px] mt-[30px]`}
              label={t("profilePageConstants.saveChanges")}
              endIcon={
                !isSavingAreas && (
                  <SaveChangesArrowIcon
                    className={`${
                      hasAreaChanges
                        ? "text-white"
                        : "text-obsidianBlack text-opacity-25"
                    }`}
                  />
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessProfile;
