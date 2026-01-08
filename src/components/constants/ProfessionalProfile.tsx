import projectDetailsBannerImage from "@/assets/images/project_details_portfolio_banner_image.jpg";
import projectDetailsUserImage from "@/assets/images/project_details_portfolio_user_image.jpg";
import { getTranslationSync } from "@/i18n/i18n";
import {
  ProjectDetailPortfolioCheckmarkIcon,
  ProjectDetailPortfolioStarIcon,
  ProjectDetailPortfolioReviewIcon,
  StarIcon,
} from "@/assets/icons/CommonIcons";
import { ReactNode } from "react";

export const professionalProfileHeaderDummyData = {
  bannerImage: projectDetailsBannerImage,
  profileImage: projectDetailsUserImage,
  businessName: "Oslo Woodworks",
  location: "Oslo, Norge",
  memberSince: "Medlem siden 2018",
  description:
    "Profesjonelle snekkertjenester med over 15 års erfaring. Vi spesialiserer oss på kjøkkenrenovering, spesiallaget møbler og gulvinstallasjoner. Kvalitetshåndverk garantert.",
  completedJobs: 156,
  averageRating: 4.8,
  totalReviews: 32,
  phone: "+47 987 65 432",
  email: "contact@oslowood.no",
  services: ["Snekker", "Gulvlegging", "Spesiallagde møbler"],
  workAreas: ["Oslo", "Asker"],
};

export const professionalprofiletab = [
  getTranslationSync("projectDetailProfessionalProfileConstants.portfolio"),
  getTranslationSync("projectDetailProfessionalProfileConstants.review"),
];

interface ProfessionalProfileStatConfig {
  label: string;
  value: number;
  icon: ReactNode;
  valuePostfix?: ReactNode;
}

export const getProfessionalProfileStatsConfig = (
  completedJobs: number,
  averageRating: number,
  totalReviews: number,
  t: (key: string, params?: Record<string, string>) => string
): ProfessionalProfileStatConfig[] => {
  return [
    {
      label: t("projectDetailProfessionalProfileConstants.completedJobs"),
      value: completedJobs,
      icon: <ProjectDetailPortfolioCheckmarkIcon />,
    },
    {
      label: t("projectDetailProfessionalProfileConstants.averageRating"),
      value: averageRating,
      icon: <ProjectDetailPortfolioStarIcon />,
      valuePostfix: <StarIcon className="w-[16px] h-[16px]" />,
    },
    {
      label: t("projectDetailProfessionalProfileConstants.totalReviews"),
      value: totalReviews,
      icon: <ProjectDetailPortfolioReviewIcon />,
    },
  ];
};
