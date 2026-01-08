"use client";

import { useState, useEffect } from "react";
import BaseModal from "@/components/base/BaseModal";
import SubscriptionPackages from "@/components/subscription/SubscriptionPackages";
import BaseButton from "../base/BaseButton";
import { CloseIcon } from "@/assets/icons/CommonIcons";

export default function SubscriptionModalWrapper() {
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  useEffect(() => {
    const isFirstTimeUser = true;
    if (isFirstTimeUser) {
      setShowSubscribeModal(true);
    }
  }, []);

  return (
    <BaseModal
      visible={showSubscribeModal}
      onHide={() => setShowSubscribeModal(false)}
      maxWidth="1000px"
      showCloseIcon={false}
      header={
        <div className="flex items-end justify-end p-[10px] sm:p-[20px] border-0 border-solid border-b border-graySoft border-opacity-50">
          <BaseButton
            onClick={() => setShowSubscribeModal(false)}
            className="bg-transparent border-none"
          >
            <CloseIcon className="text-obsidianBlack opacity-30" />
          </BaseButton>
        </div>
      }
    >
      <SubscriptionPackages />
    </BaseModal>
  );
}
