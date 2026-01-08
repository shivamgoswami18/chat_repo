"use client";

import React, { useState } from "react";
import StarRating from "../common/StarRating";
import BaseInput from "../base/BaseInput";
import BaseButton from "../base/BaseButton";
import { getTranslationSync } from "@/i18n/i18n";

function ProjectReview() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const t = (key: string, params?: Record<string, string>) => {
    return getTranslationSync(key, params);
  };

  return (
    <div className="px-[20px] py-[18px] w-[300px] sm:min-w-[330px]">
      <p className="text-obsidianBlack font-light text-textSm xl:leading-[100%] xl:tracking-[0px] mb-[10px]">
        {t("homePageConstants.rating")}
      </p>

      <div className="flex items-center gap-[14px] mb-[18px] justify-center">
        <StarRating
          rating={rating}
          onChange={setRating}
          starClassName="w-[40px] h-[40px] cursor-pointer"
        />
      </div>

      <form>
        <BaseInput
          label={t("projectDetailProfessionalProfileConstants.review")}
          type="textarea"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience"
          labelClassName="text-obsidianBlack font-light text-textSm xl:leading-[100%] xl:tracking-[0px] mb-[10px]"
          className="mb-[24px] font-light text-textSm px-[16px] text-obsidianBlack rounded-[8px] py-[12px] border border-lightGrayGamma focus:ring-0 placeholder:text-stoneGray placeholder:text-opacity-50 placeholder:text-textSm placeholder:font-light xl:placeholder:[line-height:20px] xl:placeholder:tracking-[0%] xl:leading-[20px] xl:tracking-[0%]"
        />

        <div className="flex gap-[8px]">
          <BaseButton
            label={t("commonConstants.cancel")}
            className="bg-obsidianBlack bg-opacity-5 text-obsidianBlack text-textSm xl:leading-[100%] xl:tracking-[0px] text-opacity-50 py-[10px] rounded-[8px] px-[48px] border-0"
          />{" "}
          <BaseButton
            label={t("commonConstants.submit")}
            className="bg-deepTeal text-textSm xl:leading-[100%] xl:tracking-[0px] py-[10px] rounded-[8px] px-[48px] border-0"
          />
        </div>
      </form>
    </div>
  );
}

export default ProjectReview;
