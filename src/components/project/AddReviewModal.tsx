"use client";
import { CloseIcon } from "@/assets/icons/CommonIcons";
import BaseButton from "../base/BaseButton";
import BaseModal from "../base/BaseModal";
import { useState } from "react";
import BaseInput from "../base/BaseInput";
import { getTranslationSync } from "@/i18n/i18n";
import StarRating from "../common/StarRating";
import { useFormik } from "formik";
import * as Yup from "yup";
import { validationMessages } from "../constants/Validation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addReview } from "@/lib/api/ReviewApi";
import BaseErrorMessage from "../base/BaseErrorMessage";

interface AddReviewModalProps {
  visible: boolean;
  projectId: string | undefined;
  businessId: string | undefined;
  onHide: () => void;
}

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

const AddReviewModal: React.FC<AddReviewModalProps> = ({
  visible,
  onHide,
  projectId,
  businessId,
}) => {
  const [rating, setRating] = useState<number>(0);
  const dispatch = useAppDispatch();
  const {loading , error} = useAppSelector((state) => state.reviewState)
  const formik = useFormik({
    initialValues: {
      review_text: "",
    },
    validationSchema: Yup.object({
      review_text: Yup.string().required(
        validationMessages.required(
          t("projectDetailProfessionalProfileConstants.review")
        )
      ),
    }),

    onSubmit: async (values) => {
      if (!rating) return;

      const payload = {
        project_id: projectId,
        business_id: businessId,
        rating,
        review_text: values.review_text,
      };

      await dispatch(addReview({ payload }));
      onHide();
    },
  });

  return (
    <BaseModal
      visible={visible}
      onHide={onHide}
      maxWidth="500px"
      header={
        <div className="relative flex items-center justify-center p-[10px] sm:p-[16px] border-solid border-0 border-b border-graySoft border-opacity-50">
          <h2 className="text-obsidianBlack text-opacity-50 text-center sm:text-textSm font-light xl:leading-[100%] xl:tracking-[0px]">
            {t("reviewPageConstants.rateAndReviewTitle")}
          </h2>
          <BaseButton
            onClick={onHide}
            className="absolute right-[16px] bg-transparent border-none"
          >
            <CloseIcon className="text-obsidianBlack opacity-30" />
          </BaseButton>
        </div>
      }
      className="min-w-[334px]"
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="px-[20px] pt-[18px] pb-[20px]">
          <p className="text-textSm text-obsidianBlack font-light xl:leading-[100%] xl:tracking-[0px]">
            {t("reviewPageConstants.rating")}
          </p>
          <div className="flex gap-[6px] justify-center mt-[10px] mb-[18px]">
            <StarRating
              rating={rating}
              onChange={setRating}
              starClassName="w-[40px] h-[40px] cursor-pointer"
            />
          </div>
          <BaseInput
            name="review_text"
            label={t("reviewPageConstants.review")}
            type="textarea"
            placeholder={t("reviewPageConstants.reviewPlaceholder")}
            value={formik.values.review_text}
            onChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            error={formik.errors.review_text}
            touched={formik.touched.review_text}
            className="font-light text-textSm px-[16px] text-obsidianBlack rounded-[8px] py-[12px] border border-lightGrayGamma focus:ring-0 placeholder:text-stoneGray placeholder:text-opacity-50 placeholder:text-textSm placeholder:font-light xl:placeholder:[line-height:20px] xl:placeholder:tracking-[0%] xl:leading-[20px] xl:tracking-[0%]"
            labelClassName="text-textSm text-obsidianBlack font-light xl:leading-[100%] xl:tracking-[0px] mb-[10px]"
          />
          <BaseErrorMessage error={error}/>
          <div className="flex justify-between mt-[24px] gap-[8px]">
            <BaseButton
              onClick={onHide}
              label={t("commonConstants.cancel")}
              className="bg-obsidianBlack bg-opacity-5 text-obsidianBlack text-opacity-50 font-medium text-textSm xl:leading-[100%] xl:tracking-[0px] py-[10px] px-[48px] rounded-[8px] border-none"
            />
            <BaseButton
              type="submit"
              disabled={!rating || !formik.isValid}
              loader={loading}
              label={t("commonConstants.submit")}
              className="py-[10px] px-[48px] bg-deepTeal border-none text-white rounded-[8px] text-textSm font-medium xl:leading-[100%] xl:tracking-[0px] border-0"
            />
          </div>
        </div>
      </form>
    </BaseModal>
  );
};

export default AddReviewModal;
