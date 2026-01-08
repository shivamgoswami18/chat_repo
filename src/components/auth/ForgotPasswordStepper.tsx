"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { ForgotPasswordStep } from "@/types/forgotPassword";
import ForgotPassword from "./ForgotPassword";
import VerifyOTP from "./VerifyOtp";
import ResetPassword from "./ResetPassword";
import ResetPasswordSuccess from "./ResetPasswordSuccess";
import { useEffect } from "react";
import { resetForgotPasswordState } from "@/lib/store/slices/forgotPasswordSlice";

const ForgotPasswordStepper = () => {
  const { step } = useAppSelector((state) => state.forgotPassword);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(resetForgotPasswordState());
  }, [dispatch]);

  return (
    <>
      {step === ForgotPasswordStep.email && <ForgotPassword />}
      {step === ForgotPasswordStep.verify_otp && <VerifyOTP />}
      {step === ForgotPasswordStep.reset_password && <ResetPassword />}
      {step === ForgotPasswordStep.success && <ResetPasswordSuccess />}
    </>
  );
};

export default ForgotPasswordStepper;
