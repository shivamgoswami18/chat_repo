"use client";
import { useAppSelector } from "@/lib/store/hooks";
import { ProfileTab, ProfileTabItem } from "../common/ProfileTab";
import MyProjectsSection from "../my-projects/MyProjectsSection";
import Settings from "../settings/Settings";
import BusinessProfile from "./BusinessProfile";
import Profile from "./Profile";
import { RootState } from "@/lib/store/store";
import { useMemo } from "react";
import { commonLabels } from "../constants/Common";
import { getTranslationSync } from "@/i18n/i18n";
import ReviewContent from "../project/ReviewContent";

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};
const customerProfileTabs: ProfileTabItem[] = [
  {
    id: "basic information",
    label: t("sidebarConstants.basicInformation"),
    component: <Profile />,
  },
  {
    id: "security",
    label: t("sidebarConstants.settings"),
    component: <Settings />,
  },
];

const businessProfileTabs: ProfileTabItem[] = [
  {
    id: "business-info",
    label: t("sidebarConstants.basicInformation"),
    component: <BusinessProfile />,
  },
  {
    id: "projects",
    label: t("sidebarConstants.projects"),
    component: <MyProjectsSection />,
  },
  {
    id: "settings",
    label: t("sidebarConstants.settings"),
    component: <Settings />,
  }, 
  {
    id: "review",
    label: t("projectDetailProfessionalProfileConstants.review"),
    component: <ReviewContent />,
  }
];

function ProfileSidebar() {
  const role = useAppSelector((state: RootState) => state.auth.role);
  const tabs = useMemo(() => {
    if (role === commonLabels.businessRole) {
      return businessProfileTabs;
    }
    if (role === commonLabels.customerRole) {
      return customerProfileTabs;
    }
    return [];
  }, [role]);
  return <ProfileTab items={tabs} defaultActiveId={tabs[0]?.id} />;
}

export default ProfileSidebar;
