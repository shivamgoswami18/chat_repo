"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";

interface BaseModalProps {
  visible: boolean;
  onHide: () => void;
  header?: string | React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  closable?: boolean;
  closeOnEscape?: boolean;
  dismissableMask?: boolean;
  modal?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  position?:
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  style?: React.CSSProperties;
  maxWidth?: string;
  showCloseIcon?: boolean;
  blockScroll?: boolean;
}

const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  onHide,
  header,
  footer,
  children,
  className = "",
  headerClassName = "",
  contentClassName = "",
  footerClassName = "",
  closable = true,
  closeOnEscape = true,
  dismissableMask = true,
  modal = true,
  draggable = false,
  resizable = false,
  position = "center",
  style,
  maxWidth = "32rem",
  showCloseIcon = true,
  blockScroll = true,
}) => {
  const renderFooter = () => {
    if (footer === null) return null;

    if (footer) {
      return <div className={footerClassName}>{footer}</div>;
    }

    return null;
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={header}
      footer={renderFooter()}
      closable={closable}
      closeOnEscape={closeOnEscape}
      dismissableMask={dismissableMask}
      modal={modal}
      draggable={draggable}
      resizable={resizable}
      position={position}
      blockScroll={blockScroll}
      style={{ maxWidth, ...style }}
      className={classNames("mx-4 custom-modal", className)}
      headerClassName={classNames(headerClassName)}
      contentClassName={contentClassName}
    >
      {!showCloseIcon && closable && (
        <style>{`
          .p-dialog-header-close { display: none !important; }
        `}</style>
      )}
      {children}
    </Dialog>
  );
};

export default BaseModal;
