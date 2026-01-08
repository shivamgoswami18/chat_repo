"use client";

import Link from "next/link";
import { useState } from "react";
import BaseButton from "../base/BaseButton";
import { getTranslationSync } from "@/i18n/i18n";
import { HamburgerIcon, CloseIcon } from "@/assets/icons/CommonIcons";
import { useRouter } from "next/navigation";
import { routePath } from "@/components/constants/RoutePath";
import { useAppDispatch } from "@/lib/store/hooks";
import { setRole } from "@/lib/store/slices/authSlice";
import { commonLabels } from "@/components/constants/Common";

const MobileMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const t = (key: string, params?: Record<string, string>) => {
    return getTranslationSync(key, params);
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleBecomeAProfessional = () => {
    dispatch(setRole(commonLabels.businessRole));
    router.push(routePath.logIn);
    closeSidebar();
  };

  return (
    <>
      <div className="md:hidden">
        <HamburgerIcon
          className="cursor-pointer"
          onClick={() => setIsSidebarOpen(true)}
        />
      </div>

      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeSidebar}
      >
        <div className="absolute inset-0 bg-blackTransparent" />

        <div
          className={`absolute top-0 right-0 h-full w-[280px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col p-6 gap-4">
            <div className="flex justify-end mb-4">
              <CloseIcon className="cursor-pointer" onClick={closeSidebar} />
            </div>

            <div className="flex flex-col gap-[10px] mt-4">
              <BaseButton
                label={t("homeHeaderConstants.becomeAProfessional")}
                className="text-textBase font-medium text-obsidianBlack bg-white cursor-pointer border-charcoalPale border-[2px] rounded-[8px] py-[9px] px-[19px] xl:leading-[24px] tracking-[0px] w-full"
                onClick={handleBecomeAProfessional}
              />

              <Link
                href={routePath.createProjectSelectService}
                onClick={closeSidebar}
              >
                <BaseButton
                  label={t("homeHeaderConstants.postAProject")}
                  className="text-textBase font-medium bg-deepTeal text-white border-none cursor-pointer rounded-[8px] py-[9px] px-[14px] xl:leading-[24px] tracking-[0px] w-full"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
