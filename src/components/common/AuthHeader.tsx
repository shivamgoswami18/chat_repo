'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BaseButton from '../base/BaseButton';
import { getTranslationSync } from '@/i18n/i18n';
import { routePath } from '../constants/RoutePath';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setRole, selectIsBusiness } from '@/lib/store/slices/authSlice';
import { commonLabels } from '@/components/constants/Common';

export default function AuthHeader() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isBusiness = useAppSelector(selectIsBusiness);
  const t = (key: string, params?: Record<string, string>) => {
    return getTranslationSync(key, params);
  };
  const isLogInPage = pathname.includes(routePath.logIn);
  const isRegisterPage = pathname.includes(routePath.register);
  const buttonLabel = isLogInPage
    ? t('logInPageConstants.registerNow')
    : t('logInPageConstants.logIn');
  const buttonLink = isRegisterPage ? routePath.logIn : routePath.register;

  const handleRegisterAsCustomer = () => {
    dispatch(setRole(commonLabels.customerRole));
  };

  const handleRegisterAsBusiness = () => {
    dispatch(setRole(commonLabels.businessRole));
  };

  return (
    <header className="mx-auto pt-[15px] xl:pt-[21px] px-3 xs:px-10 md:px-[160px] xxs:px-5 max-w-container flex items-center justify-between bg-white">
      <div className="text-obsidianBlack font-bold text-titleXl xl:leading-[100%] xl:tracking-[-1px]">
        {t('logInPageConstants.logo')}
      </div>
      <div className="flex items-center gap-3">
        {isRegisterPage && (
          <>
            {isBusiness ? (
              <BaseButton
                className="bg-transparent leading-6 border-2 border-obsidianBlack/10 rounded-[8px] py-[9px] px-[14px] xl:leading-[24px] text-obsidianBlack"
                onClick={handleRegisterAsCustomer}
              >
                <span className="text-textBase leading-6 transition no-underline">
                  {t("registerPageConstants.becomeACustomer")}
                </span>
              </BaseButton>
            ) : (
              <BaseButton
                className="bg-transparent leading-6 border-2 border-obsidianBlack/10 rounded-[8px] py-[9px] px-[14px] xl:leading-[24px] text-obsidianBlack"
                onClick={handleRegisterAsBusiness}
              >
                <span className="text-textBase leading-6 transition no-underline">
                  {t("logInPageConstants.registerAsProfessional")}
                </span>
              </BaseButton>
            )}
          </>
        )}
        <BaseButton className="bg-transparent leading-6 border-2 border-obsidianBlack/10 rounded-[8px] py-[9px] px-[14px] xl:leading-[24px]">
          <Link
            href={buttonLink}
            className="text-textBase leading-6 transition text-obsidianBlack no-underline "
          >
            {buttonLabel}
          </Link>
        </BaseButton>
      </div>
    </header>
  );
}
