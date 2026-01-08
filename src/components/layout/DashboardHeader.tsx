"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { routePath } from "../constants/RoutePath";
import { BellIcon, HamburgerIcon, CloseIcon } from "@/assets/icons/CommonIcons";
import { getTranslationSync } from "@/i18n/i18n";
import { trailingSlashRegex } from "../constants/Validation";
import BaseButton from "../base/BaseButton";
import BaseMenu from "../base/BaseMenu";
import BaseModal from "../base/BaseModal";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { getHeaderNavItems } from "../constants/RoutePermissions";
import user_image from "@/assets/images/user_dummy_image.png";
import Image from "next/image";
import { MenuItem } from "primereact/menuitem";
import { clearToken, clearRole } from "@/lib/store/slices/authSlice";
import { commonLabels } from "../constants/Common";

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}

const NavLink = ({ href, children, isActive }: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={`text-textBase font-light transition-colors no-underline xl:leading-[100%] xl:tracking-[0px] ${
        isActive
          ? "text-deepTeal bg-deepTeal bg-opacity-5 rounded-[8px] py-[10px] px-[19px]"
          : "text-obsidianBlack hover:text-deepTeal"
      }`}
    >
      {children}
    </Link>
  );
};

interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const MobileNavLink = ({
  href,
  children,
  isActive,
  onClick,
}: MobileNavLinkProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`px-[24px] py-[16px] text-textBase font-medium transition-colors no-underline ${
        isActive
          ? "text-deepTeal bg-mintUltraLight"
          : "text-obsidianBlack hover:text-deepTeal hover:bg-mintUltraLight"
      }`}
    >
      {children}
    </Link>
  );
};

export default function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const navigationItems = getHeaderNavItems(role);

  const isActive = (path: string): boolean => {
    if (!path || !pathname) return false;
    const normalizedPath = path.replace(trailingSlashRegex, "");
    const normalizedPathname = pathname.replace(trailingSlashRegex, "");

    return (
      normalizedPathname === normalizedPath ||
      normalizedPathname.startsWith(`${normalizedPath}/`)
    );
  };

  const handleProfileClick = () => {
    router.push(routePath.profile);
  };

  const handleSettingsClick = () => {
    router.push(`${routePath.profile}?tab=${routePath.settings}`);
  };

  const handleSubscribeClick = () => {
    router.push(routePath.subscription);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    dispatch(clearToken());
    dispatch(clearRole());
    setShowLogoutModal(false);
    router.push(routePath.logIn);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const businessProfileMenu: MenuItem[] = [
    {
      label: t("sidebarConstants.profile"),
      command: handleProfileClick,
      className: "border-0 bg-whitePrimary",
    },
    {
      separator: true,
    },
    {
      label: t("sidebarConstants.settings"),
      command: handleSettingsClick,
      className: "border-0 bg-whitePrimary",
    },
    {
      separator: true,
    },
    {
      label: t("subscriptionPageConstants.subscriptionHeader"),
      command: handleSubscribeClick,
      className: "border-0 bg-whitePrimary",
    },
    {
      separator: true,
    },
    {
      label: t("sidebarConstants.logout"),
      command: handleLogoutClick,
      className: "text-redPrimary border-0 bg-whitePrimary",
    },
  ];
  const customerProfileMenu: MenuItem[] = [
    {
      label: t("sidebarConstants.profile"),
      command: handleProfileClick,
      className: "border-0 bg-whitePrimary",
    },
    {
      separator: true,
    },
    {
      label: t("sidebarConstants.settings"),
      command: handleSettingsClick,
      className: "border-0 bg-whitePrimary",
    },
    {
      separator: true,
    },
    {
      label: t("sidebarConstants.logout"),
      command: handleLogoutClick,
      className: "text-redPrimary border-0 bg-whitePrimary",
    },
  ];

  const profileMenuItems = useMemo(() => {
    if (role === commonLabels.businessRole) {
      return businessProfileMenu;
    }
    if (role === commonLabels.customerRole) {
      return customerProfileMenu;
    }
    return [];
  }, [role]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="w-full bg-white border-b border-lightGrayGamma sticky top-0 z-50">
        <div className="max-w-container mx-auto px-[10px] xxs:px-[20px] xs:px-[40px] md:px-[80px] desktop:px-[124px]">
          <div className="flex items-center justify-between h-[60px] md:h-[80px]">
            <div className="flex items-center gap-[16px]">
              <div className="md:hidden">
                <HamburgerIcon
                  className="cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(true)}
                />
              </div>
              <h1 className="hidden md:block text-obsidianBlack font-bold text-titleMid xl:leading-[100%] xl:tracking-[-1px]">
                {t("logInPageConstants.logo")}
              </h1>
            </div>

            <nav className="hidden md:flex items-center gap-[41px]">
              {navigationItems?.map((item) => (
                <NavLink
                  key={item?.path}
                  href={item?.path}
                  isActive={isActive(item?.path)}
                >
                  {t(item?.translationKey)}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-[20px]">
              <div className="relative">
                <BaseButton
                  className="p-[7px] md:p-[12px] rounded-full bg-mintUltraLight border-[2px] border-deepTeal border-opacity-10"
                  startIcon={<BellIcon className="text-obsidianBlack" />}
                />
                <span className="absolute top-[5px] right-[8px] md:top-[12px] md:right-[10px] w-[8px] h-[8px] bg-redPrimary rounded-full"></span>
              </div>

              <BaseMenu
                items={profileMenuItems}
                id="profile_menu "
                className="!absolute p-2 rounded !mt-[22px] md:!mt-[25px]"
              >
                <BaseButton className="w-[35px] h-[35px] md:w-[48px] md:h-[48px] rounded-full border-none p-0 overflow-hidden flex items-center justify-center cursor-pointer">
                  <Image
                    src={user_image}
                    alt={t("HeaderConstants.userImageAlt")}
                    className="w-full h-full object-cover"
                  />
                </BaseButton>
              </BaseMenu>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <button
          className="absolute inset-0 bg-blackTransparent"
          onClick={handleNavClick}
        />

        <aside
          className={`absolute top-0 left-0 h-full w-[280px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between pt-[24px] px-[24px] pb-[24px] border-b border-lightGrayGamma">
              <h1 className="text-obsidianBlack font-bold text-titleMid xl:leading-[100%] xl:tracking-[-1px]">
                {t("logInPageConstants.logo")}
              </h1>
              <div className="flex justify-end">
                <CloseIcon
                  className="cursor-pointer"
                  onClick={handleNavClick}
                />
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-[4px]">
                {navigationItems?.map((item) => (
                  <MobileNavLink
                    key={item?.path}
                    href={item?.path}
                    isActive={isActive(item?.path)}
                    onClick={handleNavClick}
                  >
                    {t(item?.translationKey)}
                  </MobileNavLink>
                ))}
              </div>
            </nav>
          </div>
        </aside>
      </div>

      <BaseModal
        visible={showLogoutModal}
        onHide={handleCancelLogout}
        header={t("dashboardHeaderPageConstants.alert")}
        maxWidth="500px"
        className="logout-modal"
        contentClassName="py-2 px-3 w-[350px]"
        footerClassName="py-4 px-6 rounded-b-lg w-[350px]"
        headerClassName="py-4 px-6 text-center font-normal text-opacity-10 rounded-t-lg border-b w-[350px]"
        footer={
          <div className="flex gap-[12px] justify-between">
            <BaseButton
              label={t("commonConstants.cancel")}
              onClick={handleCancelLogout}
              className="bg-obsidianBlack bg-opacity-10 text-opacity-50 text-obsidianBlack border border-lightGrayGamma rounded-lg px-6 py-2 font-medium w-full"
            />
            <BaseButton
              label={t("sidebarConstants.logout")}
              onClick={handleConfirmLogout}
              className="bg-redPrimary bg-opacity-10 text-redPrimary rounded-lg border-0 px-6 py-2 font-medium w-full"
            />
          </div>
        }
      >
        <div className="space-y-2">
          <h3 className="text-lg font-normal text-obsidianBlack text-titleSm text-center">
            {t("dashboardHeaderPageConstants.areYouSure")}
          </h3>
          <p className="text-textSm text-obsidianBlack text-opacity-50 text-center">
            {t("dashboardHeaderPageConstants.logoutConfirmation")}
          </p>
        </div>
      </BaseModal>
    </>
  );
}
