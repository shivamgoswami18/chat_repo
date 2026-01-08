"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadIcon, CloseIcon } from "@/assets/icons/CommonIcons";
import { errorHandler } from "@/components/constants/Common";
import BaseButton from "@/components/base/BaseButton";

interface MultipleImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  onImagesUpload: (files: File[]) => Promise<string[]>;
  label: string;
  labelClassName?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  uploading?: boolean;
  uploadPlaceholder?: string;
  gridCols?: string;
  containerClassName?: string;
  imageBaseUrl?: string;
  onFilesSelected?: (files: File[]) => void;
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  images,
  onImagesChange,
  onImagesUpload,
  label,
  labelClassName = "",
  error,
  touched,
  required = false,
  disabled = false,
  uploading = false,
  uploadPlaceholder,
  gridCols = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  containerClassName = "",
  imageBaseUrl = process.env.NEXT_PUBLIC_BASE_IMAGE_URL ?? "",
  onFilesSelected,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleMultipleImagesChange = async (files: File[]) => {
    if (files.length === 0 || disabled || isUploading) {
      return;
    }
    setIsUploading(true);
    let uploadedPaths: string[] = [];
    try {
      uploadedPaths = await onImagesUpload(files);
      if (uploadedPaths.length > 0) {
        const updatedImages = [...images, ...uploadedPaths];
        onImagesChange(updatedImages);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (disabled || isUploading) {
      return;
    }
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(updatedImages);
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const filesArray = Array.from(selectedFiles);
      if (onFilesSelected) {
        onFilesSelected(filesArray);
      }
      handleMultipleImagesChange(filesArray);
    }
    event.target.value = "";
  };

  const isUploadDisabled = disabled || isUploading || uploading;

  return (
    <div className={containerClassName}>
      <label
        htmlFor="multipleImageUploadInput"
        className={`${labelClassName} block`}
      >
        {label}
        {required && <span className="text-black">*</span>}
      </label>
      <div className="mt-[4px]">
        {images?.length > 0 && (
          <div className={`grid ${gridCols} gap-[12px] mb-[12px]`}>
            {images?.map((image, imageIndex) => (
              <div
                key={image}
                className="relative aspect-square rounded-[8px] overflow-hidden border border-lightGrayGamma group"
              >
                <Image
                  src={`${imageBaseUrl}${image}`}
                  alt={`Image ${imageIndex + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {!isUploadDisabled && (
                  <BaseButton
                    onClick={() => handleRemoveImage(imageIndex)}
                    className="absolute top-[8px] right-[8px] bg-obsidianBlack bg-opacity-75 rounded-full cursor-pointer px-[6px] py-[5px] border-none opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <CloseIcon className="text-white" />
                  </BaseButton>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="relative">
          <BaseButton
            onClick={() => {
              if (!isUploadDisabled) {
                document.getElementById("multipleImageUploadInput")?.click();
              }
            }}
            disabled={isUploadDisabled}
            className={`w-full bg-offWhite py-[32px] rounded-[8px] border border-solid border-lightGrayGamma ${
              isUploadDisabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-gray-50 transition-colors"
            }`}
          >
            <div className="flex flex-col items-center">
              <UploadIcon className="mb-[10px]" />
              {uploadPlaceholder && (
                <span className="text-textSm text-stoneGray">
                  {uploadPlaceholder}
                </span>
              )}
            </div>
          </BaseButton>

          <input
            id="multipleImageUploadInput"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isUploadDisabled}
          />
        </div>
      </div>
      {error && touched && (
        <small className="p-error text-mini mt-[4px] block">{error}</small>
      )}
    </div>
  );
};

export default MultipleImageUpload;
