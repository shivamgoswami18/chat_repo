"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import BaseInput from "@/components/base/BaseInput";
import BaseButton from "@/components/base/BaseButton";
import BaseFileUpload from "@/components/base/BaseFileUpload";
import BaseDropdown from "@/components/base/BaseDropdown";
import BaseLoader from "@/components/base/BaseLoader";
import {
  InputFieldMailIcon,
  InputFieldUserIcon,
  InputFieldPhoneIcon,
  UploadIcon,
  SaveChangesArrowIcon,
  LocationPinIcon,
  ChevronDownIcon,
} from "@/assets/icons/CommonIcons";
import { getTranslationSync } from "@/i18n/i18n";

import {
  emailRegex,
  phoneRegex,
  validationMessages,
  inputPlaceHolder,
  selectPlaceHolder,
} from "@/components/constants/Validation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { ViewProfile, EditProfile, UploadFile } from "@/lib/api/UserApi";
import { BaseImageURL } from "@/lib/api/ApiService";
import { fetchCounties } from "@/lib/api/AuthApi";
import type { County } from "@/types/profile";
import { handleProfileImageChange } from "@/components/constants/Common";

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

const Profile = () => {
  const dispatch = useAppDispatch();
  const { profile, loadingProfile, uploadingFile } = useAppSelector(
    (state) => state.user
  );
  const [profileImagePath, setProfileImagePath] = useState<string | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [counties, setCounties] = useState<Array<{value: string; label: string}>>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(ViewProfile());
  }, [dispatch]);

  useEffect(() => {
      const loadCounties = async () => {
        const data = await fetchCounties() as County[];
        setCounties(data?.map((county: County) => ({ value: county._id, label: county.name })));
      };
      loadCounties();
    }, []);

  useEffect(() => {
    if (profile) {
      formik.setValues({
        name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone_number || "",
        city: profile.postal_code || "",
      });
      
      const imagePath = profile.profile_image;
      setProfileImagePath(imagePath);
      setProfileImagePreview(BaseImageURL + imagePath);
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
    initialValues: { name: "", email: "", phone: "", city: "" },
    validationSchema: Yup.object({
      name: Yup.string().required(
        validationMessages.required(t("registerLabel.name"))
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
          postal_code?: string;
          profile_image?: string | null;
        } = {
          userId: profile?._id,
        };

        const initialName = profile?.full_name || "";
        const initialEmail = profile?.email || "";
        const initialPhone = profile?.phone_number || "";
        const initialPostalCode = profile?.postal_code || "";
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

        if (values.city !== initialPostalCode) {
          payload.postal_code = values.city;
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

  const hasChanges = formik.dirty || profileImagePath !== profile?.profile_image;
  
  const labelClassName =
    "text-stoneGray text-textSm mb-[4px] xl:leading-[20px] xl:tracking-[0%]";
  const inputClassName =
    "font-light text-textBase px-[38px] text-obsidianBlack rounded-[8px] py-[12px] border border-lightGrayGamma focus:ring-0 placeholder:text-obsidianBlack placeholder:text-opacity-30 placeholder:text-textSm placeholder:font-light xl:placeholder:[line-height:20px] xl:placeholder:tracking-[0%] xl:leading-[20px] xl:tracking-[0%]";

  if (loadingProfile) {
    return (
      <div className="bg-white rounded-[16px] p-[20px] md:p-[40px] lg:p-[76px]">
        <div className="flex items-center justify-center h-[400px]">
          <BaseLoader size="xl" className="text-deepTeal" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-[16px] p-[20px] md:p-[40px] lg:p-[76px]">
        <div className="flex flex-col items-center mb-[40px]">
          <BaseFileUpload
            name="profileImage"
            accept="image/*"
            customUI={true}
            imagePreview={profileImagePreview}
            onImageChange={handleImageChange}
            containerClassName="w-[120px] h-[120px] bg-offWhite rounded-[8px] border-solid border border-lightGrayGamma"
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
            editButtonClassName="absolute bottom-0 left-0 text-white bg-obsidianBlack bg-opacity-75 text-textSm border-none rounded-t-none rounded-b-[7px] font-light w-[120px] xl:leading-[20px] xl:tracking-[0%]"
            showEditButton={true}
          />
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            <div className="space-y-[20px]">
              <BaseInput
                label={t("registerLabel.name")}
                name="name"
                type="text"
                placeholder={inputPlaceHolder(t("registerLabel.name"))}
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

          <div className="flex justify-end mt-[30px]">
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
      </div>
    </div>
  );
};

export default Profile;