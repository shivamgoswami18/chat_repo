"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import BaseButton from "./BaseButton";

interface BaseFileUploadProps {
  name?: string;
  accept?: string;
  disabled?: boolean;
  onFileChange?: (file: File | null) => void;
  onImageChange?: (imageUrl: string | null, file: File | null) => void;
  fileButtonLabel?: React.ReactNode;
  fileButtonClassName?: string;
  children?: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  label?: string;
  labelClassName?: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  helperText?: string;
  helperTextClassName?: string;
  mode?: "basic" | "advanced";
  multiple?: boolean;
  maxFileSize?: number;
  auto?: boolean;
  customUI?: boolean;
  imagePreview?: string | null;
  uploadPlaceholder?: React.ReactNode;
  showEditButton?: boolean;
  editButtonLabel?: string;
  editButtonClassName?: string;
  containerClassName?: string;
}

const BaseFileUpload: React.FC<BaseFileUploadProps> = ({
  name,
  accept,
  disabled,
  onFileChange,
  onImageChange,
  fileButtonLabel,
  fileButtonClassName,
  children,
  className,
  fullWidth,
  label,
  labelClassName,
  required,
  error,
  touched,
  helperText,
  helperTextClassName,
  mode = "basic",
  multiple = false,
  maxFileSize,
  auto = true,
  customUI = false,
  imagePreview,
  uploadPlaceholder,
  showEditButton = true,
  editButtonLabel,
  editButtonClassName,
  containerClassName,
}) => {
  const fileUploadRef = useRef<FileUpload>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: FileUploadSelectEvent) => {
    const file = event.files?.[0] || null;
    onFileChange?.(file);
  };

  const handleImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        onImageChange?.(imageUrl, file);
        onFileChange?.(file);
      };
      reader.readAsDataURL(file);
    } else {
      onImageChange?.(null, null);
      onFileChange?.(null);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  if (customUI) {
    const currentImage = imagePreview;
    return (
      <div
        className={`${fullWidth ? "w-full" : ""} text-start ${className || ""}`}
      >
        {label && (
          <label htmlFor={name} className={`${labelClassName} block`}>
            {label}
            {required && <span className="text-black">*</span>}
          </label>
        )}
        {helperText && (
          <div className={`${helperTextClassName}`}>{helperText}</div>
        )}
        <div className="relative">
          <div
            className={`${containerClassName || ""} relative overflow-hidden ${
              !currentImage
                ? "cursor-pointer hover:bg-offWhite transition-colors"
                : ""
            }`}
            onClick={!currentImage ? handleEditClick : undefined}
          >
            {currentImage ? (
              <Image
                src={currentImage}
                alt={label ?? ""}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              uploadPlaceholder || (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  {fileButtonLabel ?? ""}
                </div>
              )
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleImageFileChange}
            className="hidden"
            id={name}
            name={name}
            disabled={disabled}
          />
          {currentImage && showEditButton && (
            <BaseButton
              label={editButtonLabel ?? ""}
              onClick={handleEditClick}
              className={
                editButtonClassName ||
                "absolute bottom-0 left-0 text-white bg-obsidianBlack bg-opacity-75 text-textSm border-none rounded-t-none rounded-b-[7px] font-light w-full xl:leading-[20px] xl:tracking-[0%]"
              }
            />
          )}
          {children}
        </div>
        {error && touched && (
          <small id={`error-${name}`} className="p-error text-mini">
            {error}
          </small>
        )}
      </div>
    );
  }

  return (
    <div
      className={`${fullWidth ? "w-full" : ""} text-start ${className || ""}`}
    >
      {label && (
        <label htmlFor={name} className={`${labelClassName} block`}>
          {label}
          {required && <span className="text-black">*</span>}
        </label>
      )}
      {helperText && (
        <div className={`${helperTextClassName}`}>{helperText}</div>
      )}
      <div className="w-full">
        <FileUpload
          ref={fileUploadRef}
          name={name}
          accept={accept}
          mode={mode}
          multiple={multiple}
          maxFileSize={maxFileSize}
          disabled={disabled}
          auto={auto}
          onSelect={handleFileSelect}
          chooseLabel={(fileButtonLabel as string) ?? ""}
          chooseOptions={{
            className: fileButtonClassName,
            icon: null,
          }}
          className={error && touched ? "p-invalid" : ""}
        />
        {children}
      </div>
      {error && touched && (
        <small id={`error-${name}`} className="p-error text-mini">
          {error}
        </small>
      )}
    </div>
  );
};

export default BaseFileUpload;
