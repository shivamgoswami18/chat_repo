import { getTranslationSync } from "@/i18n/i18n";

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

export default function DashboardFooter() {
  return (
    <footer>
      <div className="flex flex-col sm:flex-row justify-between xl:flex-col items-center sm:items-start">
        <p className="text-obsidianBlack text-textBase font-light text-opacity-70 xl:leading-[30px] xl:tracking-[0px]">
          {t("projectsPageConstants.footerCopyright", {
            year: new Date().getFullYear().toString(),
          })}
        </p>
        <p className="text-obsidianBlack text-textBase font-light text-opacity-70 xl:leading-[30px] xl:tracking-[0px]">
          {t("projectsPageConstants.termsPrivacy")}
        </p>
      </div>
    </footer>
  );
}
