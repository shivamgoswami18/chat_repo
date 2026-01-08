"use client";

import { useEffect, useState } from "react";
import { StarIcon } from "@/assets/icons/CommonIcons";
import StarRating from "@/components/common/StarRating";
import BaseProgressBar from "@/components/base/BaseProgressBar";
import { getTranslationSync } from "@/i18n/i18n";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import { ListOfReviewPayload, reviewList } from "@/lib/api/ReviewApi";
import BaseSkeleton from "../base/BaseSkeleton";
import PaginationInfo from "../common/PaginationInfo";
import { RatingCounts } from "@/lib/store/slices/reviewSlice";

export interface Review {
  id: number;
  rating: number;
  tag: string;
  text: string;
  name: string;
  date: string;
}

export interface RatingBreakdown {
  stars: number;
  count: number;
  percentage: number;
}
interface ReviewContentProps {
  showTitle?: boolean;
}

const t = (key: string, params?: Record<string, string>) =>
  getTranslationSync(key, params);
const ReviewContent = ({ showTitle = false }: ReviewContentProps) => {
  const dispatch = useAppDispatch();
  const [limit, setLimit] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { reviewsData, loading } = useAppSelector(
    (state: RootState) => state.reviewState
  );
  const { id } = useAppSelector((state) => state.auth);
  const payload: ListOfReviewPayload = {
    sortKey: "_id",
    sortValue: "desc",
    page: 1,
    limit,
  };

  const handleLoadMore = async () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    const newLimit = limit + 10;

    try {
      setLimit(newLimit);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(reviewList(id, { payload }));
    }
  }, [dispatch, id, limit]);
  const ratingCounts = (reviewsData?.ratingCounts ?? {}) as RatingCounts;
  const totalReviews = Object.values(ratingCounts).reduce(
    (sum, c) => sum + c,
    0
  );

  if (loading) {
    return <BaseSkeleton count={5} gap="10px" />;
  }
  const hasReviews = (reviewsData?.items?.length ?? 0) > 0;

  return (
    <div className="bg-white rounded-[16px]">
      {showTitle && (
        <h2 className="text-obsidianBlack text-opacity-50 text-textBase font-light border-0 border-solid border-b px-[20px] py-[15px] border-graySoft border-opacity-40">
          {t("reviewPageConstants.review")}
        </h2>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 figmascreen:gap-[24px] gap-[16px] p-[20px]">
        <div className="lg:col-span-2 space-y-[10px] order-2 lg:order-1">
          {!hasReviews && (
            <div className="flex items-center justify-center px-[10px] sm:px-[16px]">
              <p className="text-obsidianBlack text-textBase font-light text-center">
                {t("commonConstants.noReviewFound")}
              </p>
            </div>
          )}
          {reviewsData?.items?.map((review) => (
            <div
              key={review?._id}
              className="bg-white border-[2px] border-solid border-offWhite rounded-[16px] p-[10px] sm:p-[20px]"
            >
              <div className="flex items-center gap-[10px]">
                <StarRating rating={review?.rating} starClassName="w-5 h-5" />
                <span className="text-deepTeal text-mini font-light xl:leading-[100%] xl:tracking-[0px]">
                  {review?.project_title}
                </span>
              </div>
              <p className="text-obsidianBlack text-textBase font-light mt-[10px] mb-[8px] lg:mt-[18px] lg:mb-[12px] xl:leading-[100%] xl:tracking-[0px]">
                {review?.review_text}
              </p>
              <div className="flex flex-col gap-[2px]">
                <span className="text-obsidianBlack text-textBase text-opacity-70 font-light xl:leading-[100%] xl:tracking-[0px]">
                  {review?.customer_name}
                </span>
                <span className="text-obsidianBlack text-mini text-opacity-40 font-light xl:leading-[100%] xl:tracking-[0px]">
                  {review?.createdAt.split("T")[0]}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1 order-1 lg:order-2">
          <div className="bg-white border-[2px] border-solid border-offWhite rounded-[16px]">
            <div className="flex justify-between items-center pt-[10px] sm:pt-[20px] px-[10px] sm:px-[20px] flex-wrap">
              <div className="flex items-center gap-[12px]">
                <span className="text-obsidianBlack font-light text-titleMid lg:text-titleXxxlPlus xl:leading-[100%] xl:tracking-[0px]">
                  {reviewsData?.averageRating.toFixed(1)}
                </span>
                <StarIcon
                  fill="#FFD700"
                  stroke="#FFD700"
                  className="w-[28px] h-[28px] lg:w-[42px] lg:h-[42px]"
                />
              </div>
              <div className="flex justify-center items-center">
                <p className="text-obsidianBlack text-opacity-40 text-textSm font-light xl:leading-[100%] xl:tracking-[0px]">
                  {reviewsData?.totalCount}{" "}
                  {t("projectDetailProfessionalProfileConstants.reviews")}
                </p>
              </div>
            </div>

            <div className="w-full h-[1px] bg-graySoft bg-opacity-40 my-[10px] lg:my-[18px]" />

            <div className="space-y-[10px] pb-[10px] sm:pb-[20px] px-[10px] sm:px-[20px]">
              {reviewsData &&
                Object.entries(ratingCounts)
                  .sort(([a], [b]) => Number(b) - Number(a))
                  .map(([stars, count]) => {
                    const percentage =
                      totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                    return (
                      <div key={stars} className="flex items-center gap-[27px]">
                        <div className="flex items-center gap-[4px]">
                          <div className="w-[10px] h-[20px] flex items-center justify-center">
                            <span className="text-obsidianBlack text-textBase font-light text-opacity-50">
                              {stars}
                            </span>
                          </div>
                          <StarIcon
                            fill="#FFD700"
                            stroke="#FFD700"
                            className="w-4 h-4"
                          />
                        </div>
                        <BaseProgressBar percentage={percentage} />
                        <span className="text-sm text-gray-500">{count}</span>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
      <PaginationInfo
        currentCount={reviewsData?.items?.length ?? 0}
        totalCount={reviewsData?.totalCount ?? 0}
        itemLabel={t("projectDetailProfessionalProfileConstants.reviews")}
        onLoadMore={handleLoadMore}
        isLoadingMore={isLoadingMore}
        className="pb-[20px]"
      />
    </div>
  );
};

export default ReviewContent;
