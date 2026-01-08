"use client";
import { BackArrowIcon, ProjectStatusIcon } from "@/assets/icons/CommonIcons";
import BaseButton from "../base/BaseButton";
import { getTranslationSync } from "@/i18n/i18n";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { selectIsAuthenticated } from "@/lib/store/slices/authSlice";
interface Props {
  currentStep: number;
  children: React.ReactNode;
}

export default function CreateProjectStepper({
  currentStep,
  children,
}: Readonly<Props>) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const totalStep = isAuthenticated ? 3 : 4;
  const steps: number[] = Array.from({length : totalStep} , (_ , index) => index + 1)

  const getStepState = (step: number, currentStep: number) => {
    const isCompleted = step < currentStep;
    const isActive = step === currentStep;

    let className: string;

    if (isCompleted) {
      className = "text-deepTeal bg-white";
    } else if (isActive) {
      className = "bg-deepTeal text-white";
    } else {
      className =
        "text-obsidianBlack text-opacity-50 bg-white";
    }

    return { isCompleted, className };
  };

  const router = useRouter();
  const t = (key: string, params?: Record<string, string>) =>
    getTranslationSync(key, params);

  return (
    <div className="bg-mintUltraLight flex flex-col justify-center items-center">
      <div className="min-h-screen max-w-container px-[20px] py-[30px] w-full md:w-[70%] desktop:w-[65%] figmascreen:w-[60%] flex flex-col justify-center">
        <div className="flex items-center gap-[20px] flex-wrap">
          <BaseButton
            className="bg-white text-textMd font-light text-obsidianBlack py-[13px] ps-[14px] pe-[24px] border-none rounded-[8px] shadow-[0px_8px_16px_0px_#108A0008]"
            startIcon={<BackArrowIcon />}
            label={t("commonConstants.back")}
            onClick={() => router.back()}
          />
          <div>
            <p className="text-titleSm font-bold mb-[2px] xl:leading-[100%] xl:tracking-[0px]">
              {t("createProjectPageConstants.createProjectTitle")}
            </p>
            <p className="text-textSm text-obsidianBlack text-opacity-40 xl:leading-[100%] xl:tracking-[0px]">
              {t("createProjectPageConstants.createProjectDescription")}
            </p>
          </div>
        </div>

        <div className="my-[60px] flex justify-center items-center">
          <div className="flex items-center">
            {steps?.map((step) => {
              const { isCompleted, className } = getStepState(
                step,
                currentStep
              );

              return (
                <div key={step} className="flex items-center">
                  <div
                    className={`flex h-[40px] w-[40px] text-textMd xl:leading-[100%] xl:tracking-[0px] font-light md:h-[48px] md:w-[48px] items-center justify-center rounded-[50px] shadow-[0px_8px_16px_0px_#108A0008] ${className}`}
                  >
                    {isCompleted ? (
                      <ProjectStatusIcon size={20} stroke="#0B7C68" />
                    ) : (
                      step
                    )}
                  </div>

                  {step !== steps.length && (
                    <div className="h-[4px] w-[30px] xs:w-[50px] text-textMd xl:leading-[100%] xl:tracking-[0px] font-light md:w-[100px] bg-deepTeal bg-opacity-10 shadow-[0px_8px_16px_0px_#108A0008]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
