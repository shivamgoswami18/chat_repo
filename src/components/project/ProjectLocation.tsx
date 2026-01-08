"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import BaseInput from "../base/BaseInput";
import {
  BackArrowIcon,
  NextArrowIcon,
  ProjectStatusIcon,
} from "@/assets/icons/CommonIcons";
import { getTranslationSync } from "@/i18n/i18n";
import { inputPlaceHolder, validationMessages } from "../constants/Validation";
import BaseButton from "../base/BaseButton";
import { useRouter } from "next/navigation";
import { routePath } from "../constants/RoutePath";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setLocationData,
  clearAllProjectFormData,
} from "@/lib/store/slices/projectSlice";
import { getLocation, CreateProject } from "@/lib/api/ProjectApi";
import { errorHandler, commonLabels } from "../constants/Common";
import { ViewProfile } from "@/lib/api/UserApi";
import { selectIsAuthenticated } from "@/lib/store/slices/authSlice";
import BaseLoader from "../base/BaseLoader";

function ProjectLocation() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const serviceSelectionData = useAppSelector(
    (state) => state?.project?.serviceSelectionData
  );
  const projectInformationData = useAppSelector(
    (state) => state?.project?.projectInformationData
  );
  const locationData = useAppSelector((state) => state?.project?.locationData);
  const categoryTemplate = useAppSelector(
    (state) => state?.project?.categoryTemplate
  );
  const customerId = useAppSelector((state) => state?.auth?.id);
  const isLoading = useAppSelector((state) => state?.auth?.loading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loadingLocation = useAppSelector(
    (state) => state?.project?.loadingLocation ?? false
  );
  const userData = useAppSelector((state) => state?.user?.profile);
  const loadingProfile = useAppSelector(
    (state) => state?.user?.loadingProfile ?? false
  );
  const [isAddressSelected, setIsAddressSelected] = useState<boolean>(false);

  const t = (key: string, params?: Record<string, string>) =>
    getTranslationSync(key, params);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(ViewProfile());
    }
  }, [dispatch, isAuthenticated]);

  const postalAddress = userData?.address?.postalAddress ?? null;

  const formik = useFormik({
    initialValues: {
      streetAddress: locationData?.streetAddress ?? "",
      postalCode: locationData?.postalCode ?? "",
      city: locationData?.city ?? "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      streetAddress: Yup.string().required(
        validationMessages.required(
          t(
            "createProjectPageConstants.projectLocationPageConstants.streetAddress"
          )
        )
      ),
      postalCode: Yup.string().required(
        validationMessages.required(
          t(
            "createProjectPageConstants.projectLocationPageConstants.postalCode"
          )
        )
      ),
      city: Yup.string().required(
        validationMessages.required(t("profilePageConstants.city"))
      ),
    }),
    onSubmit: () => {
      router.push(routePath.createProjectContactInformation);
    },
    validateOnMount: true,
  });

  const handlePostalCodeBlur = async (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    formik.handleBlur(e);
    const postalCode = formik.values.postalCode.trim();

    if (postalCode && !isAddressSelected) {
      try {
        const locationData = await dispatch(getLocation(postalCode));
        if (locationData?.municipality) {
          formik.setFieldValue("city", locationData.municipality, true);
        }
      } catch (error) {
        errorHandler(error);
      }
    }
  };

  const handleAddressToggle = () => {
    setIsAddressSelected((prev) => {
      const next = !prev;
      if (next && postalAddress) {
        formik.setValues({
          streetAddress: postalAddress?.addressLine ?? "",
          postalCode: postalAddress?.postalCode ?? "",
          city: postalAddress?.postPlace ?? "",
        });
      } else {
        formik.setValues({
          streetAddress: locationData?.streetAddress ?? "",
          postalCode: locationData?.postalCode ?? "",
          city: locationData?.city ?? "",
        });
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    formik.setTouched({
      streetAddress: true,
      postalCode: true,
      city: true,
    });

    if (!formik.isValid) {
      return;
    }

    dispatch(
      setLocationData({
        streetAddress: formik.values.streetAddress ?? "",
        postalCode: formik.values.postalCode ?? "",
        city: formik.values.city ?? "",
      })
    );

    if (isAuthenticated) {
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
        customer_id: customerId ?? "",
        status: commonLabels.publishedValue ?? "",
        source: commonLabels.customerRole ?? "",
        category: categoryPayload,
        title: projectInformationData?.projectTitle ?? "",
        description: projectInformationData?.projectDescription ?? "",
        address: formik.values.streetAddress ?? "",
        postal_code: formik.values.postalCode ?? "",
        project_image: projectInformationData?.projectImage ?? [],
        project_details: projectDetails ?? [],
      };

      const result = await dispatch(CreateProject({ payload }));
      if (result) {
        dispatch(clearAllProjectFormData());
        router.push(routePath.myProjects);
      }
    } else {
      formik.submitForm();
    }
  };

  const labelClassName =
    "text-stoneGray text-textSm mb-[4px] xl:leading-[20px] space-y-[12px] xl:tracking-[0%]";
  const inputClassName =
    "font-light text-textBase px-[16px] text-obsidianBlack rounded-[8px] py-[12px] border border-lightGrayGamma focus:ring-0 placeholder:text-stoneGray placeholder:text-opacity-50 placeholder:text-textSm placeholder:font-light xl:placeholder:[line-height:20px] xl:placeholder:tracking-[0%] xl:leading-[20px] xl:tracking-[0%]";
  return (
    <>
      <div className="rounded-[16px] bg-white shadow-[0px_8px_16px_0px_#108A0008]">
        <p className="border-solid border-0 border-b border-graySoft border-opacity-50 px-[20px] py-[18px] text-textLg text-obsidianBlack xl:leading-[100%] xl:tracking-[0px]">
          {t("createProjectPageConstants.projectLocation")}
        </p>

        <div className="p-[20px]">
          {isAuthenticated && loadingProfile ? (
            <div className="flex justify-center items-center py-[60px]">
              <BaseLoader size="lg" />
            </div>
          ) : (
            <>
              {isAuthenticated && postalAddress && (
                <div className="border-0 border-solid border-b pb-[24px] border-graySoft border-opacity-50 mb-[20px]">
                  <div className="flex gap-[15px] items-center px-[16px] pt-[12px] pb-[16px] rounded-[8px] bg-offWhite">
                    <BaseButton
                      className="h-[24px] w-[24px] bg-white rounded-[16px] border-solid border border-lightGrayGamma flex items-center justify-center"
                      onClick={handleAddressToggle}
                    >
                      {isAddressSelected && (
                        <ProjectStatusIcon size={14} stroke="#181818" />
                      )}
                    </BaseButton>
                    <div>
                      <p className="text-textBase font-light xl:leading-[20px] xl:tracking-[0%] space-y-[12px] text-obsidianBlack">
                        {postalAddress?.postPlace ?? ""}
                      </p>
                      <p className="text-textSm text-stoneGray xl:leading-[20px] xl:tracking-[0%] space-y-[12px]">
                        {postalAddress?.addressLine ?? ""} -{" "}
                        {postalAddress?.postalCode ?? ""}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <form>
                <p
                  className={`${
                    isAuthenticated && postalAddress ? "pt-[18px]" : ""
                  } pb-[16px] text-textBase font-light xl:leading-[20px] xl:tracking-[0%] space-y-[12px]`}
                >
                  {t(
                    isAuthenticated
                      ? "createProjectPageConstants.projectLocationPageConstants.addNewAddress"
                      : "createProjectPageConstants.projectLocationPageConstants.addAddress"
                  )}
                </p>
                <div className="space-y-[24px]">
                  <BaseInput
                    name="streetAddress"
                    label={t(
                      "createProjectPageConstants.projectLocationPageConstants.streetAddress"
                    )}
                    value={formik.values.streetAddress}
                    onChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    touched={formik.touched.streetAddress}
                    error={formik.errors.streetAddress}
                    placeholder={inputPlaceHolder(
                      t(
                        "createProjectPageConstants.projectLocationPageConstants.streetAddress"
                      )
                    )}
                    labelClassName={labelClassName}
                    className={inputClassName}
                    disabled={isAuthenticated && isAddressSelected}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
                    <BaseInput
                      name="postalCode"
                      label={t(
                        "createProjectPageConstants.projectLocationPageConstants.postalCode"
                      )}
                      value={formik.values.postalCode}
                      onChange={formik.handleChange}
                      handleBlur={handlePostalCodeBlur}
                      touched={formik.touched.postalCode}
                      error={formik.errors.postalCode}
                      placeholder={inputPlaceHolder(
                        t(
                          "createProjectPageConstants.projectLocationPageConstants.postalCode"
                        )
                      )}
                      labelClassName={labelClassName}
                      className={inputClassName}
                      disabled={
                        loadingLocation ||
                        (isAuthenticated && isAddressSelected)
                      }
                    />

                    <BaseInput
                      name="city"
                      label={t("profilePageConstants.city")}
                      value={formik.values.city}
                      disabled={true}
                      touched={formik.touched.city}
                      error={formik.errors.city}
                      placeholder={inputPlaceHolder(
                        t("profilePageConstants.city")
                      )}
                      labelClassName={labelClassName}
                      className={inputClassName}
                    />
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-between mt-[24px] px-[20px] gap-[10px]">
        <BaseButton
          startIcon={<BackArrowIcon />}
          label={t("commonConstants.back")}
          onClick={() => router.back()}
          className="bg-white text-textSm font-medium text-obsidianBlack py-[10px] px-[24px] border-none rounded-[8px] shadow-[0px_8px_16px_0px_#108A0008] xl:leading-[100%] xl:tracking-[0px]"
        />
        <BaseButton
          label={
            isAuthenticated
              ? t("commonConstants.submit")
              : t("commonConstants.next")
          }
          endIcon={<NextArrowIcon />}
          onClick={handleSubmit}
          className="px-[24px] py-[10px] bg-deepTeal text-textSm font-medium rounded-[8px] xl:leading-[100%] xl:tracking-[0px] border-0"
          loader={isAuthenticated ? isLoading : false}
          disabled={isAuthenticated ? isLoading : false}
        />
      </div>
    </>
  );
}

export default ProjectLocation;
