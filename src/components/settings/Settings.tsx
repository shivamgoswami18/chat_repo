"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import ChangePasswordSection from "./ChangePasswordSection";
import NotificationsSection from "./NotificationsSection";
import { useEffect } from "react";
import { ViewProfile } from "@/lib/api/UserApi";
import BaseSkeleton from "../base/BaseSkeleton";

const Settings = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.profile);
  useEffect(() => {
    dispatch(ViewProfile());
  }, [dispatch]);

  if (!user) {
    return <BaseSkeleton />;
  }
  return (
    <div className="w-full space-y-[20px]">
      <NotificationsSection />
      <ChangePasswordSection />
    </div>
  );
};

export default Settings;