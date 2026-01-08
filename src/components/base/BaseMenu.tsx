"use client";

import React, { useRef, ReactElement, cloneElement, useEffect } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { MenuItem } from "primereact/menuitem";
import BaseButton from "./BaseButton";

interface BaseMenuProps {
  items: MenuItem[];
  children: ReactElement<{
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  }>;
  id?: string;
  className?: string;
}

interface PanelInfo {
  panelRef: React.RefObject<OverlayPanel | null>;
  triggerElement: HTMLElement | null;
  panelId: string | undefined;
}

const openPanels = new Set<PanelInfo>();

const BaseMenu: React.FC<BaseMenuProps> = ({
  items,
  children,
  id,
  className = "",
}) => {
  const overlayPanelRef = useRef<OverlayPanel>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      let clickedInsidePanel = false;
      openPanels.forEach((panelInfo) => {
        const trigger = panelInfo.triggerElement;
        
        let overlayElement: HTMLElement | null = null;
        if (panelInfo.panelId) {
          overlayElement = document.getElementById(panelInfo.panelId);
        }
        
        if (!overlayElement) {
          const overlays = document.querySelectorAll('.p-overlaypanel');
          overlays.forEach((overlay) => {
            const overlayEl = overlay as HTMLElement;
            if (overlayEl.contains(target) || overlayEl === target) {
              overlayElement = overlayEl;
            }
          });
        }
        
        if (
          overlayElement &&
          (overlayElement.contains(target) || overlayElement === target)
        ) {
          clickedInsidePanel = true;
        }
        
        if (
          trigger &&
          (trigger.contains(target) || trigger === target)
        ) {
          clickedInsidePanel = true;
        }
      });

      if (!clickedInsidePanel) {
        openPanels.forEach((panelInfo) => {
          const panel = panelInfo.panelRef.current;
          if (panel) {
            panel.hide();
          }
        });
        openPanels.clear();
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  const handleShow = () => {
    const currentPanelInfo: PanelInfo = {
      panelRef: overlayPanelRef,
      triggerElement: triggerElementRef.current,
      panelId: id,
    };
    
    openPanels.forEach((panelInfo) => {
      if (panelInfo.panelRef !== overlayPanelRef && panelInfo.panelRef.current) {
        panelInfo.panelRef.current.hide();
      }
    });
    openPanels.clear();
    openPanels.add(currentPanelInfo);
  };

  const handleHide = () => {
    openPanels.forEach((panelInfo) => {
      if (panelInfo.panelRef === overlayPanelRef) {
        openPanels.delete(panelInfo);
      }
    });
  };

  const handleTriggerClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    triggerElementRef.current = e.currentTarget;

    const panel = overlayPanelRef.current;
    if (panel) {
      openPanels.forEach((panelInfo) => {
        if (panelInfo.panelRef !== overlayPanelRef && panelInfo.panelRef.current) {
          panelInfo.panelRef.current.hide();
        }
      });
      openPanels.clear();
      panel.toggle(e);
    }

    children.props?.onClick?.(e);
  };

  const handleItemClick = (item: MenuItem, e?: React.MouseEvent<HTMLElement>) => {
    if (!e) return;
    
    if (item.disabled) {
      e.preventDefault();
      return;
    }

    if (item.command) {
      item.command({
        originalEvent: e,
        item: item,
      });
    }

    setTimeout(() => {
      overlayPanelRef.current?.hide();
    }, 0);
  };

  const triggerElement = cloneElement(children, {
    onClick: handleTriggerClick,
  });

  return (
    <div className="">
      <OverlayPanel
        ref={overlayPanelRef}
        id={id}
        className={className}
        dismissable
        onShow={handleShow}
        onHide={handleHide}
      >
        <div className="flex flex-col min-w-[200px] rounded-lg">
          {items?.map((item, index) => {
            if (item.separator) {
              return (
                <hr
                  key={`separator-${index}`}
                  className="my-2 border-obsidianBlack border-opacity-10"
                />
              );
            }

            return (
              <BaseButton
                key={index}
                type="button"
                onClick={(e) => handleItemClick(item, e)}
                disabled={item.disabled}
                className={`
                  !justify-start text-left px-2 py-1 text-textMd text-obsidianBlack w-full
                  hover:bg-mintUltraLight transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${item.className || ""}
                `}
              >
                <div className="flex items-center gap-3 w-full">
                  {item.icon && (
                    <i className={item.icon} />
                  )}
                  <span className="text-left">{item.label}</span>
                </div>
              </BaseButton>
            );
          })}
        </div>
      </OverlayPanel>
      {triggerElement}
    </div>
  );
};

export default BaseMenu;
