"use client";

import React, { useState, useCallback } from "react";
import BaseInput from "@/components/base/BaseInput";
import BaseRadio from "@/components/base/BaseRadio";
import BaseDropdown from "@/components/base/BaseDropdown";
import BaseCheckbox from "@/components/base/BaseCheckbox";
import BaseFileUpload from "@/components/base/BaseFileUpload";
import type { TemplateField } from "@/lib/store/slices/projectSlice";
import { uploadProjectImages } from "@/lib/api/ProjectApi";
import { errorHandler } from "@/components/constants/Common";
import { UploadIcon, ChevronDownIcon } from "@/assets/icons/CommonIcons";
import { getTranslationSync } from "@/i18n/i18n";

interface DynamicFormProps {
  fields: TemplateField[];
  formikValues?: Record<string, string | number | string[]>;
  formikErrors?: Record<string, string>;
  formikTouched?: Record<string, boolean>;
  onFieldChange?: (
    fieldName: string,
    value: string | number | string[] | null
  ) => void;
  onFieldBlur?: (fieldName: string) => void;
  generateFieldId?: (field: TemplateField) => string;
  labelClassName?: string;
  inputClassName?: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  formikValues = {},
  formikErrors = {},
  formikTouched = {},
  onFieldChange,
  onFieldBlur,
  generateFieldId,
  labelClassName,
  inputClassName,
}) => {
  const [uploadingFields, setUploadingFields] = useState<Set<string>>(
    new Set()
  );

  const t = useCallback(
    (key: string, params?: Record<string, string>) =>
      getTranslationSync(key, params),
    []
  );

  const handleFileUpload = async (file: File, fieldId: string) => {
    setUploadingFields((prev) => new Set(prev).add(fieldId));
    try {
      const imagePaths = await uploadProjectImages([file]);
      if (imagePaths && imagePaths.length > 0) {
        onFieldChange?.(fieldId, imagePaths[0]);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setUploadingFields((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fieldId);
        return newSet;
      });
    }
  };

  interface FieldRenderProps {
    field: TemplateField;
    fieldId: string;
    fieldValue: string | number | string[];
    fieldError: string | undefined;
    fieldTouched: boolean | undefined;
  }

  const renderTextInput = ({
    field,
    fieldId,
    fieldValue,
    fieldError,
    fieldTouched,
  }: FieldRenderProps) => (
    <BaseInput
      key={field._id}
      label={field.lableName}
      name={fieldId}
      placeholder={field.lableName}
      disabled={field.readOnly === "yes"}
      fullWidth
      type="text"
      value={String(fieldValue ?? "")}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        onFieldChange?.(fieldId, e.target.value);
      }}
      handleBlur={() => {
        onFieldBlur?.(fieldId);
      }}
      error={fieldError}
      touched={fieldTouched}
      labelClassName={labelClassName}
      className={inputClassName}
    />
  );

  const renderTextarea = ({
    field,
    fieldId,
    fieldValue,
    fieldError,
    fieldTouched,
  }: FieldRenderProps) => (
    <BaseInput
      key={field._id}
      label={field.lableName}
      name={fieldId}
      placeholder={field.lableName}
      disabled={field.readOnly === "yes"}
      fullWidth
      type="textarea"
      rows={4}
      value={String(fieldValue ?? "")}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onFieldChange?.(fieldId, e.target.value);
      }}
      handleBlur={() => {
        onFieldBlur?.(fieldId);
      }}
      error={fieldError}
      touched={fieldTouched}
      labelClassName={labelClassName}
      className={inputClassName}
    />
  );

  const renderEmail = ({
    field,
    fieldId,
    fieldValue,
    fieldError,
    fieldTouched,
  }: FieldRenderProps) => (
    <BaseInput
      key={field._id}
      label={field.lableName}
      name={fieldId}
      placeholder={field.lableName}
      disabled={field.readOnly === "yes"}
      fullWidth
      type="email"
      value={String(fieldValue ?? "")}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        onFieldChange?.(fieldId, e.target.value);
      }}
      handleBlur={() => {
        onFieldBlur?.(fieldId);
      }}
      error={fieldError}
      touched={fieldTouched}
      labelClassName={labelClassName}
      className={inputClassName}
    />
  );

  const renderTel = ({
    field,
    fieldId,
    fieldValue,
    fieldError,
    fieldTouched,
  }: FieldRenderProps) => (
    <BaseInput
      key={field._id}
      label={field.lableName}
      name={fieldId}
      placeholder={field.lableName}
      disabled={field.readOnly === "yes"}
      fullWidth
      type="tel"
      value={String(fieldValue ?? "")}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        onFieldChange?.(fieldId, e.target.value);
      }}
      handleBlur={() => {
        onFieldBlur?.(fieldId);
      }}
      error={fieldError}
      touched={fieldTouched}
      labelClassName={labelClassName}
      className={inputClassName}
    />
  );

  const renderPassword = ({
    field,
    fieldId,
    fieldValue,
    fieldError,
    fieldTouched,
  }: FieldRenderProps) => (
    <BaseInput
      key={field._id}
      label={field.lableName}
      name={fieldId}
      placeholder={field.lableName}
      disabled={field.readOnly === "yes"}
      fullWidth
      type="password"
      value={String(fieldValue ?? "")}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        onFieldChange?.(fieldId, e.target.value);
      }}
      handleBlur={() => {
        onFieldBlur?.(fieldId);
      }}
      error={fieldError}
      touched={fieldTouched}
      labelClassName={labelClassName}
      className={inputClassName}
    />
  );

  const renderNumber = ({
    field,
    fieldId,
    fieldValue,
    fieldError,
    fieldTouched,
  }: FieldRenderProps) => (
    <BaseInput
      key={field._id}
      label={field.lableName}
      name={fieldId}
      placeholder={field.lableName}
      disabled={field.readOnly === "yes"}
      fullWidth
      type="number"
      value={
        fieldValue !== null && fieldValue !== undefined
          ? String(fieldValue)
          : ""
      }
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || value === null || value === undefined) {
          onFieldChange?.(fieldId, "");
        } else {
          const numValue = Number.parseFloat(value);
          onFieldChange?.(fieldId, Number.isNaN(numValue) ? "" : numValue);
        }
      }}
      handleBlur={() => {
        if (onFieldBlur) {
          onFieldBlur(fieldId);
        }
      }}
      error={fieldError}
      touched={fieldTouched}
      labelClassName={labelClassName}
      className={inputClassName}
    />
  );

  const renderDate = ({
    field,
    fieldId,
    fieldValue,
    fieldError,
    fieldTouched,
  }: FieldRenderProps) => (
    <BaseInput
      key={field._id}
      label={field.lableName}
      name={fieldId}
      placeholder={field.lableName}
      disabled={field.readOnly === "yes"}
      fullWidth
      type="date"
      value={String(fieldValue ?? "")}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        onFieldChange?.(fieldId, e.target.value);
      }}
      handleBlur={() => {
        onFieldBlur?.(fieldId);
      }}
      error={fieldError}
      touched={fieldTouched}
      labelClassName={labelClassName}
      className={inputClassName}
    />
  );

  const renderDropdown = ({
    field,
    fieldId,
    fieldValue,
    fieldError,
    fieldTouched,
  }: FieldRenderProps) => {
    const dropdownOptions: { value: string; label: string }[] =
      field.variableOptions
        ? field.variableOptions.split(",").map((option) => ({
            value: option.trim(),
            label: option.trim(),
          }))
        : [];
    const selectedValue = String(fieldValue ?? "");

    return (
      <BaseDropdown
        key={field._id}
        label={field.lableName}
        name={fieldId}
        placeholder={field.lableName}
        disabled={field.readOnly === "yes"}
        fullWidth
        options={dropdownOptions}
        value={selectedValue}
        onChange={(value: string) => {
          onFieldChange?.(fieldId, value);
        }}
        handleBlur={() => {
          onFieldBlur?.(fieldId);
        }}
        error={fieldError}
        touched={fieldTouched}
        labelClassName={labelClassName}
        endIcon={<ChevronDownIcon className="opacity-30 w-[20px] h-[20px]" />}
      />
    );
  };

  const renderCheckbox = ({
    field,
    fieldId,
    fieldValue,
    fieldError,
    fieldTouched,
  }: FieldRenderProps) => {
    const checkboxOptions = field.variableOptions
      ? field.variableOptions.split(",").map((option) => option.trim())
      : [];

    let checkboxValues: string[] = [];
    if (Array.isArray(fieldValue)) {
      checkboxValues = fieldValue;
    } else if (fieldValue) {
      checkboxValues = [String(fieldValue)];
    }

    const handleCheckboxChange = (option: string, checked: boolean) => {
      const newValues = checked
        ? [...checkboxValues, option]
        : checkboxValues.filter((v) => v !== option);
      onFieldChange?.(fieldId, newValues);
    };

    return (
      <div key={field._id}>
        <label className={`block ${labelClassName ?? ""} mb-2`}>
          {field.lableName}
        </label>
        <div className="flex flex-col gap-2">
          {checkboxOptions.map((option, index) => (
            <BaseCheckbox
              key={`${fieldId}-${index}`}
              name={`${fieldId}-${index}`}
              label={option}
              checked={checkboxValues.includes(option)}
              onChange={(checked: boolean) =>
                handleCheckboxChange(option, checked)
              }
              labelClassName="text-stoneGray"
            />
          ))}
        </div>
        {fieldError && fieldTouched && (
          <small id={`error-${fieldId}`} className="p-error text-mini">
            {fieldError}
          </small>
        )}
      </div>
    );
  };

  const renderRadio = ({
    field,
    fieldId,
    fieldValue,
    fieldError,
    fieldTouched,
  }: FieldRenderProps) => {
    const radioOptions = field.variableOptions
      ? field.variableOptions.split(",").map((option) => option.trim())
      : [];

    return (
      <div key={field._id}>
        <label className={`block ${labelClassName ?? ""} mb-2`}>
          {field.lableName}
        </label>
        <div className="flex flex-col gap-2">
          {radioOptions.map((option, index) => (
            <BaseRadio
              key={`${fieldId}-${index}`}
              name={fieldId}
              value={option}
              label={option}
              checked={String(fieldValue) === option}
              disabled={field.readOnly === "yes"}
              onChange={(value) => {
                onFieldChange?.(fieldId, value);
              }}
              onBlur={() => {
                onFieldBlur?.(fieldId);
              }}
              labelClassName={labelClassName}
            />
          ))}
        </div>
        {fieldError && fieldTouched && (
          <small id={`error-${fieldId}`} className="p-error text-mini">
            {fieldError}
          </small>
        )}
      </div>
    );
  };

  const renderFile = ({
    field,
    fieldId,
    fieldValue,
    fieldError,
    fieldTouched,
  }: FieldRenderProps) => {
    const fileName = fieldValue ? String(fieldValue) : "";
    const baseImageURL = process.env.NEXT_PUBLIC_BASE_IMAGE_URL || "";
    const imagePreviewUrl = fileName ? `${baseImageURL}${fileName}` : "";
    const isUploading = uploadingFields.has(fieldId);

    return (
      <div key={field._id}>
        <BaseFileUpload
          name={fieldId}
          accept="image/*"
          customUI
          label={field.lableName}
          labelClassName={labelClassName}
          imagePreview={imagePreviewUrl || null}
          onImageChange={async (imageUrl, file) => {
            if (file) {
              await handleFileUpload(file, fieldId);
            } else {
              onFieldChange?.(fieldId, "");
            }
          }}
          error={fieldError}
          touched={fieldTouched}
          disabled={field.readOnly === "yes" || isUploading}
          containerClassName="bg-offWhite py-[32px] rounded-[8px] border border-lightGrayGamma"
          uploadPlaceholder={
            <div className="flex flex-col items-center">
              <UploadIcon className="mb-[10px]" />
              <span className="text-textSm text-stoneGray">
                {isUploading
                  ? t("commonConstants.uploading")
                  : `${field.lableName}`}
              </span>
            </div>
          }
          editButtonLabel={t("profilePageConstants.edit")}
          showEditButton
        />
      </div>
    );
  };

  const renderField = (field: TemplateField) => {
    const fieldId = generateFieldId
      ? generateFieldId(field)
      : `template_${field._id}`;
    const fieldValue = formikValues[fieldId] ?? "";
    const fieldError = formikErrors[fieldId] as string | undefined;
    const fieldTouched = formikTouched[fieldId] as boolean | undefined;

    const fieldProps: FieldRenderProps = {
      field,
      fieldId,
      fieldValue,
      fieldError,
      fieldTouched,
    };

    switch (field.fieldType) {
      case "text":
      case "input":
        return renderTextInput(fieldProps);
      case "textarea":
        return renderTextarea(fieldProps);
      case "email":
        return renderEmail(fieldProps);
      case "tel":
        return renderTel(fieldProps);
      case "password":
        return renderPassword(fieldProps);
      case "number":
        return renderNumber(fieldProps);
      case "date":
        return renderDate(fieldProps);
      case "dropdown":
        return renderDropdown(fieldProps);
      case "checkbox":
        return renderCheckbox(fieldProps);
      case "radio":
        return renderRadio(fieldProps);
      case "file":
        return renderFile(fieldProps);
      default:
        return null;
    }
  };

  return (
    <div className="space-y-[24px]">
      {fields.map((field) => renderField(field))}
    </div>
  );
};

export default DynamicForm;
