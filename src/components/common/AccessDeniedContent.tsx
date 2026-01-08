"use client";

import { useRouter } from "next/navigation";
import BaseButton from "@/components/base/BaseButton";
import { AccessDeniedIcon } from "@/assets/icons/CommonIcons";
import { getTranslationSync } from "@/i18n/i18n";

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

export default function AccessDeniedContent() {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-graySoft px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <AccessDeniedIcon />
        </div>
        <h1 className="text-titleXl font-bold text-obsidianBlack mb-4">
          {t("commonConstants.accessDenied")}
        </h1>
        <p className="text-charcoalGrey mb-6">
          {t("commonConstants.accessDeniedMessage")}
        </p>
        <BaseButton
          onClick={handleBack}
          className="w-full bg-deepTeal text-white font-semibold py-3 px-6 rounded-lg border-none"
          label={t("commonConstants.back")}
        />
      </div>
    </div>
  );
}

