"use client";
import { getTranslationSync } from "@/i18n/i18n";
import { useEffect, useState } from "react";
import BaseInput from "../base/BaseInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  emailRegex,
  inputPlaceHolder,
  phoneRegex,
  validationMessages,
} from "../constants/Validation";
import { BackArrowIcon, NextArrowIcon } from "@/assets/icons/CommonIcons";
import BaseButton from "../base/BaseButton";
import { useRouter } from "next/navigation";
import BaseCheckbox from "../base/BaseCheckbox";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setContactData,
  clearAllProjectFormData,
} from "@/lib/store/slices/projectSlice";
import { CreateProject } from "@/lib/api/ProjectApi";
import { routePath } from "../constants/RoutePath";
import { commonLabels } from "../constants/Common";
import { selectIsAuthenticated } from "@/lib/store/slices/authSlice";

function ContactInformation() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const serviceSelectionData = useAppSelector(
    (state) => state?.project?.serviceSelectionData
  );
  const projectInformationData = useAppSelector(
    (state) => state?.project?.projectInformationData
  );
  const locationData = useAppSelector((state) => state?.project?.locationData);
  const contactData = useAppSelector((state) => state?.project?.contactData);
  const categoryTemplate = useAppSelector(
    (state) => state?.project?.categoryTemplate
  );
  const isLoading = useAppSelector((state) => state?.auth?.loading);
  const [isChecked, setIsChecked] = useState(contactData?.agreeTerms ?? false);
  const [showCheckboxError, setShowCheckboxError] = useState(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (contactData?.agreeTerms !== undefined) {
      setIsChecked(contactData.agreeTerms);
    }
  }, [contactData]);

  useEffect(() => {
    if (isChecked) {
      setShowCheckboxError(false);
    }
  }, [isChecked]);

  const t = (key: string, params?: Record<string, string>) => {
    return getTranslationSync(key, params);
  };
  const formik = useFormik({
    initialValues: {
      fullName: contactData?.fullName ?? "",
      email: contactData?.email ?? "",
      phone: contactData?.phone ?? "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      fullName: Yup.string().required(
        validationMessages.required(
          t("createProjectPageConstants.contactDetailsPageConstants.fullName")
        )
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
    }),
    onSubmit: () => {},
  });

  const handleSubmit = async () => {
    formik.setTouched({
      fullName: true,
      email: true,
      phone: true,
    });

    if (!isChecked) {
      setShowCheckboxError(true);
      return;
    }

    if (formik.isValid && isChecked) {
      dispatch(
        setContactData({
          fullName: formik.values.fullName,
          email: formik.values.email,
          phone: formik.values.phone,
          agreeTerms: isChecked,
        })
      );

      const projectDetails =
        categoryTemplate?.field?.map((field) => {
          const fieldValue =
            projectInformationData?.dynamicFields?.[field.lableName] ?? "";
          let stringValue: string;
          if (Array.isArray(fieldValue)) {
            stringValue = fieldValue.join(", ");
          } else if (typeof fieldValue === "number") {
            stringValue = String(fieldValue);
          } else {
            stringValue = fieldValue ?? "";
          }
          return {
            labelName: field.lableName,
            fieldValue: stringValue,
            fieldType: field.fieldType,
            isRequired: field.isRequired,
            readOnly: field.readOnly,
            variableOptions: field.variableOptions ?? "",
          };
        }) ?? [];

      const categoryPayload: {
        categoryId: string;
        typeOfWorkId?: string;
      } = {
        categoryId: serviceSelectionData?.selectedServiceId ?? "",
      };
      if (serviceSelectionData?.selectedTypeOfWorkId) {
        categoryPayload.typeOfWorkId =
          serviceSelectionData.selectedTypeOfWorkId;
      }

      const payload = {
        full_name: formik.values.fullName ?? "",
        email: formik.values.email ?? "",
        phone_number: formik.values.phone ?? "",
        status: commonLabels.publishedValue ?? "",
        source: commonLabels.customerRole ?? "",
        category: categoryPayload,
        title: projectInformationData?.projectTitle ?? "",
        description: projectInformationData?.projectDescription ?? "",
        address: locationData?.streetAddress ?? "",
        postal_code: locationData?.postalCode ?? "",
        project_image: projectInformationData?.projectImage ?? [],
        project_details: projectDetails ?? [],
      };

      const result = await dispatch(CreateProject({ payload }));
      if (result) {
        dispatch(clearAllProjectFormData());
        router.push(routePath.home);
      }
    }
  };

  const labelClassName =
    "text-stoneGray text-textSm mb-[4px] xl:leading-[20px] space-y-[12px] xl:tracking-[0%]";
  const inputClassName =
    "font-light text-textBase px-[16px] text-obsidianBlack rounded-[8px] py-[12px] border border-lightGrayGamma focus:ring-0 placeholder:text-stoneGray placeholder:text-opacity-50 placeholder:text-textSm placeholder:font-light xl:placeholder:[line-height:20px] xl:placeholder:tracking-[0%] xl:leading-[20px] xl:tracking-[0%]";

  return (
    <>
      <div className="rounded-[16px] bg-white shadow-[0px_8px_16px_0px_#108A0008]">
        <p className="border-0 border-solid border-b border-graySoft border-opacity-50 px-[20px] py-[18px] text-textLg text-obsidianBlack xl:leading-[100%] xl:tracking-[0px]">
          {t("createProjectPageConstants.contactDetails")}
        </p>
        <div className="px-[20px]">
          <form>
            <p className="text-textBase font-light text-obsidianBlack xl:leading-[20px] xl:tracking-[0%] pt-[20px] pb-[16px] space-y-[12px]">
              {t(
                isAuthenticated
                  ? "createProjectPageConstants.projectLocationPageConstants.addNew"
                  : "createProjectPageConstants.contactDetailsPageConstants.add"
              )}
            </p>
            <div className="space-y-[24px]">
              <BaseInput
                name="fullName"
                label={t(
                  "createProjectPageConstants.contactDetailsPageConstants.fullName"
                )}
                value={formik.values.fullName}
                onChange={formik.handleChange}
                touched={formik.touched.fullName}
                handleBlur={formik.handleBlur}
                error={formik.errors.fullName}
                placeholder={inputPlaceHolder(
                  t(
                    "createProjectPageConstants.contactDetailsPageConstants.fullName"
                  )
                )}
                labelClassName={labelClassName}
                className={inputClassName}
              />
              <BaseInput
                name="email"
                type="email"
                label={t("logInLabel.email")}
                onChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                value={formik.values.email}
                error={formik.errors.email}
                touched={formik.touched.email}
                placeholder={inputPlaceHolder(t("logInLabel.email"))}
                labelClassName={labelClassName}
                className={inputClassName}
              />
              <BaseInput
                label={t("profilePageConstants.phone")}
                name="phone"
                type="tel"
                placeholder={inputPlaceHolder(t("profilePageConstants.phone"))}
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
            <div className="mt-[20px] mb-[25px]">
              <BaseCheckbox
                name="agreeTerms"
                checked={isChecked}
                onChange={setIsChecked}
                label={t(
                  "createProjectPageConstants.contactDetailsPageConstants.agreeTermsAndCondition"
                )}
                labelClassName="text-obsidianBlack font-light flex items-center xl:leading-[20px] xl:tracking-[0%] text-textSm"
                checkboxClassName="accent-deepTeal border border-lightGrayGamma focus:ring-0"
              />
              {showCheckboxError && (
                <p className="text-redPrimary text-mini font-light mt-[5px]">
                  {validationMessages.required(
                    t(
                      "createProjectPageConstants.contactDetailsPageConstants.agreeTermsAndCondition"
                    )
                  )}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="flex justify-between mt-[24px] px-[20px] flex-wrap gap-[10px]">
        <BaseButton
          className="bg-white text-textSm font-medium text-obsidianBlack py-[10px] px-[24px] border-none rounded-[8px] shadow-[0px_8px_16px_0px_#108A0008] xl:leading-[100%] xl:tracking-[0px]"
          startIcon={<BackArrowIcon />}
          label={t("commonConstants.back")}
          onClick={() => router.back()}
        />
        <BaseButton
          label={t("commonConstants.submit")}
          className="px-[17px] py-[10px] text-textSm bg-deepTeal border-0 font-medium rounded-[8px] xl:leading-[100%] xl:tracking-[0px]"
          endIcon={<NextArrowIcon />}
          onClick={handleSubmit}
          loader={isLoading}
          disabled={isLoading}
        />
      </div>
    </>
  );
}

export default ContactInformation;
