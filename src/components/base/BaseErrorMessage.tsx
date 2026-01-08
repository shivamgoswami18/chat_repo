"use client";

import React, { useEffect, useRef } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { clearError as clearAuthError } from "@/lib/store/slices/authSlice";

interface BaseErrorMessageProps {
  error: string | null;
  className?: string;
  containerClassName?: string;
  clearAction?: () => { type: string };
}

const BaseErrorMessage: React.FC<BaseErrorMessageProps> = ({
  error,
  className = "text-red-600 text-mini font-light",
  containerClassName = "mb-[5px]",
  clearAction = clearAuthError,
}) => {
  const dispatch = useAppDispatch();
  const dispatchRef = useRef(dispatch);

  useEffect(() => {
    dispatchRef.current = dispatch;
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatchRef.current(clearAction());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearAction]);

  if (!error) return null;

  return (
    <div className={containerClassName}>
      <p className={className}>{error}</p>
    </div>
  );
};

export default BaseErrorMessage;
