import Image, { StaticImageData } from "next/image";
import BaseButton from "@/components/base/BaseButton";
import StatCard from "@/components/project/StatCard";
import Chip from "@/components/project/Chip";
import InfoItem from "@/components/project/InfoItem";
import { getTranslationSync } from "@/i18n/i18n";
import { LocationPinIcon, CalendarIcon } from "@/assets/icons/CommonIcons";
import { getProfessionalProfileStatsConfig } from "@/components/constants/ProfessionalProfile";

interface ProfessionalProfileHeaderProps {
  bannerImage: string | StaticImageData;
  profileImage: string | StaticImageData;
  businessName: string;
  location: string;
  memberSince: string;
  description: string;
  completedJobs: number;
  averageRating: number;
  totalReviews: number;
  phone: string;
  email: string;
  services: string[];
  workAreas: string[];
  onSendMessage?: () => void;
}

const ProfessionalProfileHeader = ({
  bannerImage,
  profileImage,
  businessName,
  location,
  memberSince,
  description,
  completedJobs,
  averageRating,
  totalReviews,
  phone,
  email,
  services,
  workAreas,
  onSendMessage,
}: ProfessionalProfileHeaderProps) => {
  const t = (key: string, params?: Record<string, string>) => {
    return getTranslationSync(key, params);
  };

  const professionalProfileStats = getProfessionalProfileStatsConfig(
    completedJobs,
    averageRating,
    totalReviews,
    t
  );

  return (
    <div className="bg-white rounded-[16px]">
      <div className="relative w-full h-[200px] md:h-[300px] rounded-t-[16px] overflow-hidden mb-[-60px] md:mb-[-80px]">
        <Image
          src={bannerImage}
          alt={t("projectDetailProfessionalProfileConstants.bannerImageAlt")}
          fill
          className="object-cover"
        />
      </div>

      <div className="relative ml-[20px] md:ml-[60px] z-10">
        <div className="relative w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full border-solid border-[6px] border-white overflow-hidden">
          <Image
            src={profileImage}
            alt={t("projectDetailProfessionalProfileConstants.profileImageAlt")}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col figmascreen:flex-row figmascreen:justify-between mt-[10px] gap-[10px] p-[20px] md:p-[40px]">
        <div className="flex flex-col">
          <h1 className="text-obsidianBlack font-medium text-titleMid xl:leading-[100%] xl:tracking-[0px]">
            {businessName}
          </h1>

          <div className="flex flex-col xs:flex-row xs:items-center gap-[10px] xs:gap-[30px] mt-[10px] mb-[24px]">
            <InfoItem icon={<LocationPinIcon />} text={location} />
            <InfoItem icon={<CalendarIcon />} text={memberSince} />
          </div>

          <p className="text-obsidianBlack text-textBase xs:text-textMd font-light max-w-3xl xl:leading-[100%] xl:tracking-[0px]">
            {description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] mt-[30px]">
            {professionalProfileStats?.map((stat, index) => (
              <StatCard
                key={index}
                label={stat?.label}
                value={stat?.value}
                icon={stat?.icon}
                valuePostfix={stat?.valuePostfix}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:mt-[30px] figmascreen:mt-[0px] figmascreen:flex-col">
          <div className="flex flex-col gap-[20px] mt-[24px] md:mt-[0px]">
            <div className="flex flex-col xs:flex-row md:flex-col gap-[10px] xs:gap-[12px]">
              <InfoItem icon={<LocationPinIcon />} text={phone} />
              <InfoItem icon={<LocationPinIcon />} text={email} />
            </div>
            <div>
              <BaseButton
                onClick={onSendMessage}
                className="bg-deepTeal text-white border-none rounded-[8px] px-[25px] py-[10px] font-medium text-textSm xl:leading-[100%] xl:tracking-[0px]"
                label={t(
                  "projectDetailProfessionalProfileConstants.sendMessage"
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-[24px] mt-[24px] md:mt-[0px] figmascreen:mt-[24px]">
            <div className="flex flex-col gap-[7px]">
              <h3 className="text-obsidianBlack font-light text-textSm text-opacity-40 xl:leading-[100%] xl:tracking-[0px]">
                {t("projectDetailProfessionalProfileConstants.servicesOffered")}
              </h3>
              <div className="flex flex-wrap gap-[6px]">
                {services?.map((service, index) => (
                  <Chip key={index} label={service} color="bluePrimary" />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-[7px]">
              <h3 className="text-obsidianBlack font-light text-textSm text-opacity-40 xl:leading-[100%] xl:tracking-[0px]">
                {t("projectDetailProfessionalProfileConstants.workAreas")}
              </h3>
              <div className="flex flex-wrap gap-[6px]">
                {workAreas?.map((area, index) => (
                  <Chip key={index} label={area} color="orangeAccent" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfileHeader;
