import { StarIcon } from "@/assets/icons/CommonIcons";

interface StarRatingProps {
  rating: number;
  starClassName?: string;
  onChange?: (rating: number) => void;
}

const StarRating = ({
  rating,
  starClassName = "w-5 h-5 md:w-6 md:h-6 xl:w-9 xl:h-9",
  onChange
}: StarRatingProps) => {
  return (
    <div className="flex gap-[4px]">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
           onClick={() => onChange?.(star)}
          fill={star <= rating ? "#FFD700" : "#E5E5E5"}
          stroke={star <= rating ? "#FFD700" : "#E5E5E5"}
          className={starClassName}
        />
      ))}
    </div>
  );
};

export default StarRating;
