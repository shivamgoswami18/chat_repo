"use client";
import { getTranslationSync } from "@/i18n/i18n";
import Link from "next/link";

function AuthFooter() {
  const t = (key: string, params?: Record<string, string>) => {
    return getTranslationSync(key, params);
  };
  return (
    <footer className="md:px-[60px] px-5 py-[15px] xl:py-[20px]">
      <div className="w-full flex md:justify-between text-sm text-obsidianBlack max-w-container mx-auto flex-wrap gap-1 md:gap-4 items-center justify-center">
        <p className="font-extraLight xl:leading-[100%] xl:tracking-[0px]">{t("logInPageConstants.copyWright")}</p>

        <div className="flex items-center gap-6">
          <Link
            href="/privacy-policy"
            className="transition no-underline text-obsidianBlack xl:leading-[20px] space-y-3 xl:tracking-[0%]"
          >
            {t("logInPageConstants.privacyPolicy")}
          </Link>
          <Link
            href="/terms-and-conditions"
            className="transition no-underline text-obsidianBlack xl:leading-[20px] space-y-3 xl:tracking-[0%]"
          >
            {t("logInPageConstants.termsConditions")}
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default AuthFooter;
