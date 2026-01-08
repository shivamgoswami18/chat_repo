"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { setRole } from "@/lib/store/slices/authSlice";
import { routePath } from "@/components/constants/RoutePath";
import { commonLabels } from "@/components/constants/Common";
import BaseButton from "@/components/base/BaseButton";

interface BecomeAProfessionalButtonProps {
  label: string;
  className?: string;
}

const BecomeAProfessionalButton = ({
  label,
  className,
}: BecomeAProfessionalButtonProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleBecomeAProfessional = () => {
    dispatch(setRole(commonLabels.businessRole));
    router.push(routePath.logIn);
  };

  return (
    <BaseButton
      label={label}
      className={className}
      onClick={handleBecomeAProfessional}
    />
  );
};

export default BecomeAProfessionalButton;
