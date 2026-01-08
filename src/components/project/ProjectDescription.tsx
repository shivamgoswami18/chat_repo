"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import BaseInput from "@/components/base/BaseInput";
import BaseButton from "@/components/base/BaseButton";
import { BackArrowIcon, NextArrowIcon } from "@/assets/icons/CommonIcons";
import MultipleImageUpload from "@/components/common/MultipleImageUpload";
import { getTranslationSync } from "@/i18n/i18n";
import {
  validationMessages,
  emailRegex,
} from "@/components/constants/Validation";
import { routePath } from "@/components/constants/RoutePath";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  ViewCategoryTemplate,
  uploadProjectImages,
} from "@/lib/api/ProjectApi";
import DynamicForm from "@/components/common/DynamicForm/DynamicForm";
import type { TemplateField } from "@/lib/store/slices/projectSlice";
import { setProjectInformationData } from "@/lib/store/slices/projectSlice";
import BaseLoader from "@/components/base/BaseLoader";
import { errorHandler } from "@/components/constants/Common";

function ProjectDescription() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const selectedCategory = useAppSelector(
    (state) => state.project.selectedCategory
  );
  const categoryTemplate = useAppSelector(
    (state) => state.project.categoryTemplate
  );
  const loadingTemplate = useAppSelector(
    (state) => state.project.loadingTemplate
  );
  const projectInformationData = useAppSelector(
    (state) => state.project.projectInformationData
  );
  const [projectImage, setProjectImage] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const t = useCallback(
    (key: string, params?: Record<string, string>) =>
      getTranslationSync(key, params),
    []
  );

  const generateFieldId = useCallback((field: TemplateField): string => {
    return `template_${field._id}`;
  }, []);

  const getDynamicInitialValues = useCallback(
    (fields: TemplateField[]): Record<string, string | string[]> => {
      const initialValues: Record<string, string | string[]> = {};
      fields?.forEach((field) => {
        if (!field) return;
        const fieldId = generateFieldId(field);
        if (field?.fieldType === "checkbox") {
          initialValues[fieldId] = [];
        } else {
          initialValues[fieldId] = field?.fieldValue ?? "";
        }
      });
      return initialValues;
    },
    [generateFieldId]
  );

  const createCheckboxValidation = useCallback(
    (field: TemplateField): Yup.AnySchema => {
      const labelName = field?.lableName ?? "";
      if (field?.isRequired === "yes") {
        return Yup.array()
          .of(Yup.string())
          .min(1, validationMessages.required(labelName));
      }
      return Yup.array().of(Yup.string());
    },
    []
  );

  const createEmailValidation = useCallback(
    (field: TemplateField): Yup.AnySchema => {
      const labelName = field?.lableName ?? "";
      if (field?.isRequired === "yes") {
        return Yup.string()
          .required(validationMessages.required(labelName))
          .matches(emailRegex, validationMessages.format(labelName));
      }
      return Yup.string().test(
        "",
        validationMessages.format(labelName),
        (value) => !value || emailRegex.test(value)
      );
    },
    []
  );

  const createPasswordValidation = useCallback(
    (field: TemplateField): Yup.AnySchema => {
      const labelName = field?.lableName ?? "";
      if (field?.isRequired === "yes") {
        return Yup.string()
          .required(validationMessages.required(labelName))
          .min(8, validationMessages.passwordLength(labelName, "8"));
      }
      return Yup.string().test(
        "",
        validationMessages.passwordLength(labelName, "8"),
        (value) => !value || value.length >= 8
      );
    },
    []
  );

  const createDefaultValidation = useCallback(
    (field: TemplateField): Yup.AnySchema => {
      const labelName = field?.lableName ?? "";
      if (field?.isRequired === "yes") {
        return Yup.string().required(validationMessages.required(labelName));
      }
      return Yup.string();
    },
    []
  );

  const createDynamicValidationSchema = useCallback(
    (fields: TemplateField[]) => {
      const validation: Record<string, Yup.AnySchema> = {};
      fields?.forEach((field) => {
        if (!field) return;
        const fieldId = generateFieldId(field);

        switch (field?.fieldType) {
          case "checkbox":
            validation[fieldId] = createCheckboxValidation(field);
            break;
          case "email":
            validation[fieldId] = createEmailValidation(field);
            break;
          case "password":
            validation[fieldId] = createPasswordValidation(field);
            break;
          default:
            validation[fieldId] = createDefaultValidation(field);
            break;
        }
      });
      return validation;
    },
    [
      generateFieldId,
      createCheckboxValidation,
      createEmailValidation,
      createPasswordValidation,
      createDefaultValidation,
    ]
  );

  useEffect(() => {
    if (selectedCategory?.category_template_id) {
      dispatch(
        ViewCategoryTemplate({
          templateId: selectedCategory.category_template_id,
        })
      );
    }
  }, [selectedCategory, dispatch]);

  useEffect(() => {
    if (projectInformationData?.projectImage) {
      setProjectImage(projectInformationData.projectImage);
    }
  }, [projectInformationData]);

  const initialValues = useMemo(() => {
    const baseValues = {
      projectTitle: projectInformationData?.projectTitle ?? "",
      projectDescription: projectInformationData?.projectDescription ?? "",
      projectImage: projectInformationData?.projectImage ?? [],
    };

    if (categoryTemplate?.field) {
      const dynamicValues = getDynamicInitialValues(
        categoryTemplate?.field ?? []
      );
      if (projectInformationData?.dynamicFields) {
        categoryTemplate?.field?.forEach((field) => {
          const fieldId = generateFieldId(field);
          const labelName = field.lableName;
          if (
            projectInformationData?.dynamicFields?.[labelName] !== undefined
          ) {
            dynamicValues[fieldId] =
              projectInformationData.dynamicFields[labelName];
          }
        });
      }
      return { ...baseValues, ...dynamicValues };
    }

    return baseValues;
  }, [
    categoryTemplate,
    getDynamicInitialValues,
    projectInformationData,
    generateFieldId,
  ]);

  const validationSchema = useMemo(() => {
    const baseSchema = {
      projectTitle: Yup.string().required(
        validationMessages.required(
          t(
            "createProjectPageConstants.projectDescriptionPageConstants.projectTitle"
          )
        )
      ),
      projectDescription: Yup.string().required(
        validationMessages.required(
          t(
            "createProjectPageConstants.projectDescriptionPageConstants.projectDescription"
          )
        )
      ),
      projectImage: Yup.array()
        .of(Yup.string())
        .min(
          1,
          validationMessages.required(
            t(
              "createProjectPageConstants.projectDescriptionPageConstants.projectImageUpload"
            )
          )
        )
        .required(
          validationMessages.required(
            t(
              "createProjectPageConstants.projectDescriptionPageConstants.projectImageUpload"
            )
          )
        ),
    };

    if (categoryTemplate?.field) {
      const dynamicSchema = createDynamicValidationSchema(
        categoryTemplate?.field ?? []
      );
      return Yup.object({ ...baseSchema, ...dynamicSchema });
    }

    return Yup.object(baseSchema);
  }, [categoryTemplate, t, createDynamicValidationSchema]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: () => {
      router.push(routePath.createProjectProjectLocation);
    },
    validateOnMount: true,
  });

  const handleImagesChange = (updatedImages: string[]) => {
    setProjectImage(updatedImages);
    formik.setFieldValue("projectImage", updatedImages, true);
  };

  const handleImagesUpload = async (files: File[]): Promise<string[]> => {
    setUploadingImage(true);
    try {
      const imagePaths = await uploadProjectImages(files);
      return imagePaths;
    } catch (error) {
      errorHandler(error);
      return [];
    } finally {
      setUploadingImage(false);
    }
  };

  const handleNextClick = () => {
    const touchedFields: Record<string, boolean> = {
      projectTitle: true,
      projectDescription: true,
      projectImage: true,
    };

    if (categoryTemplate?.field) {
      categoryTemplate.field.forEach((field) => {
        const fieldId = generateFieldId(field);
        touchedFields[fieldId] = true;
      });
    }

    formik.setTouched(touchedFields);

    const dynamicFields: Record<string, string | string[]> = {};
    if (categoryTemplate?.field) {
      categoryTemplate.field.forEach((field) => {
        const fieldId = generateFieldId(field);
        const fieldValue = (formik.values as Record<string, string | string[]>)[
          fieldId
        ];
        if (fieldValue !== undefined) {
          dynamicFields[field.lableName] = fieldValue;
        }
      });
    }

    dispatch(
      setProjectInformationData({
        projectTitle: formik.values.projectTitle ?? "",
        projectDescription: formik.values.projectDescription ?? "",
        projectImage: formik.values.projectImage ?? [],
        dynamicFields: dynamicFields ?? {},
      })
    );

    formik.submitForm();
  };

  const labelClassName =
    "text-stoneGray text-textSm mb-[4px] xl:leading-[20px] xl:tracking-[0%]";

  const inputClassName =
    "font-light text-textBase px-[16px] text-obsidianBlack rounded-[8px] py-[12px] border border-lightGrayGamma focus:ring-0 placeholder:text-stoneGray placeholder:text-opacity-50 placeholder:text-textSm placeholder:font-light xl:placeholder:[line-height:20px] xl:placeholder:tracking-[0%] xl:leading-[20px] xl:tracking-[0%]";

  return (
    <>
      <div className="rounded-[16px] bg-white shadow-[0px_8px_16px_0px_#108A0008]">
        <p className="border-b border-0 border-solid border-graySoft border-opacity-50 px-[20px] py-[18px] text-textLg xl:leading-[100%] xl:tracking-[0px] text-obsidianBlack">
          {t(
            "createProjectPageConstants.projectDescriptionPageConstants.projectDescription"
          )}
        </p>

        <form onSubmit={formik.handleSubmit}>
          <div className="px-[20px] pt-[24px] pb-[20px] space-y-[24px]">
            {loadingTemplate ? (
              <div className="flex justify-center items-center py-[60px]">
                <BaseLoader size="lg" />
              </div>
            ) : (
              <>
                {categoryTemplate?.field &&
                  categoryTemplate.field.length > 0 && (
                    <DynamicForm
                      fields={categoryTemplate.field}
                      formikValues={formik.values}
                      formikErrors={formik.errors as Record<string, string>}
                      formikTouched={formik.touched as Record<string, boolean>}
                      onFieldChange={(fieldName, value) => {
                        formik.setFieldValue(fieldName, value);
                      }}
                      onFieldBlur={(fieldName) => {
                        formik.setFieldTouched(fieldName, true);
                      }}
                      generateFieldId={generateFieldId}
                      labelClassName={labelClassName}
                      inputClassName={inputClassName}
                    />
                  )}
                <BaseInput
                  name="projectTitle"
                  label={t(
                    "createProjectPageConstants.projectDescriptionPageConstants.projectTitle"
                  )}
                  value={formik.values.projectTitle}
                  onChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  touched={formik.touched.projectTitle}
                  error={formik.errors.projectTitle}
                  placeholder={t(
                    "createProjectPageConstants.projectDescriptionPageConstants.projectTitlePlaceholder"
                  )}
                  labelClassName={labelClassName}
                  className={inputClassName}
                />
                <BaseInput
                  name="projectDescription"
                  type="textarea"
                  label={t(
                    "createProjectPageConstants.projectDescriptionPageConstants.projectDescription"
                  )}
                  value={formik.values.projectDescription}
                  onChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  touched={formik.touched.projectDescription}
                  error={formik.errors.projectDescription}
                  placeholder={t(
                    "createProjectPageConstants.projectDescriptionPageConstants.projectDescriptionPlaceholder"
                  )}
                  labelClassName={labelClassName}
                  className={inputClassName}
                />
                <MultipleImageUpload
                  images={projectImage}
                  onImagesChange={handleImagesChange}
                  onImagesUpload={handleImagesUpload}
                  label={t(
                    "createProjectPageConstants.projectDescriptionPageConstants.projectImageUpload"
                  )}
                  labelClassName={labelClassName}
                  error={formik.errors.projectImage as string | undefined}
                  touched={formik.touched.projectImage}
                  required
                  disabled={uploadingImage}
                  uploading={uploadingImage}
                  uploadPlaceholder={t(
                    "createProjectPageConstants.projectDescriptionPageConstants.projectUploadImagePlaceholder"
                  )}
                />
              </>
            )}
          </div>
        </form>
      </div>
      <div className="flex justify-between mt-[24px] px-[20px]">
        <BaseButton
          startIcon={<BackArrowIcon />}
          label={t("commonConstants.back")}
          onClick={() => router.back()}
          className="bg-white text-textSm font-medium text-obsidianBlack py-[10px] px-[24px] border-none rounded-[8px] shadow-[0px_8px_16px_0px_#108A0008] xl:leading-[100%] xl:tracking-[0px]"
        />

        <BaseButton
          label={t("commonConstants.next")}
          endIcon={<NextArrowIcon />}
          onClick={handleNextClick}
          className="px-[24px] py-[10px] bg-deepTeal text-textSm font-medium rounded-[8px] xl:leading-[100%] xl:tracking-[0px] border-0"
        />
      </div>
    </>
  );
}

export default ProjectDescription;
