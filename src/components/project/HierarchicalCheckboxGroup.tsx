"use client";

import React, { useState } from "react";
import BaseCheckbox from "../base/BaseCheckbox";
import BaseButton from "../base/BaseButton";
import { ChevronDownIcon } from "@/assets/icons/CommonIcons";

interface ChildItem {
  id: string;
  name: string;
}

interface ParentItem {
  id: string;
  name: string;
  children: ChildItem[];
}

interface HierarchicalCheckboxGroupProps {
  label: string;
  items: ParentItem[];
  selectedParents: Set<string>;
  selectedChildren: Set<string>;
  onParentChange: (parentId: string, checked: boolean) => void;
  onChildChange: (childId: string, parentId: string, checked: boolean) => void;
  parentNamePrefix?: string;
  childNamePrefix?: string;
}

const HierarchicalCheckboxGroup: React.FC<HierarchicalCheckboxGroupProps> = ({
  label,
  items,
  selectedParents,
  selectedChildren,
  onParentChange,
  onChildChange,
  parentNamePrefix = "",
  childNamePrefix = "",
}) => {
  const [expandedParents, setExpandedParents] = useState<Set<string>>(
    new Set()
  );

  const toggleExpand = (parentId: string) => {
    setExpandedParents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(parentId)) {
        newSet.delete(parentId);
      } else {
        newSet.add(parentId);
      }
      return newSet;
    });
  };

  return (
    <div>
      <div className="text-obsidianBlack text-textSm text-opacity-40 font-light mb-[12px] xl:leading-[100%] xl:tracking-[0px]">
        {label}
      </div>
      <div className="space-y-[10px]">
        {items?.map((item) => {
          const isParentSelected = selectedParents.has(item?.id);
          const itemChildren = item?.children;
          const isExpanded = expandedParents.has(item?.id);
          const hasChildren = itemChildren?.length > 0;

          return (
            <div key={item?.id} className="space-y-[10px]">
              <div className="flex items-center justify-between">
                <BaseCheckbox
                  name={`${parentNamePrefix}${item?.id}`}
                  checked={isParentSelected}
                  onChange={(checked) => onParentChange(item?.id, checked)}
                  label={item?.name}
                  labelClassName={`flex items-center text-textBase font-light xl:leading-[100%] xl:tracking-[0px] ${
                    isParentSelected ? "text-deepTeal" : "text-obsidianBlack"
                  }`}
                  checkboxClassName={`${
                    isParentSelected
                      ? "[&_.p-checkbox-box]:bg-deepTeal [&_.p-checkbox-box]:border-deepTeal"
                      : ""
                  }`}
                />
                {hasChildren && (
                  <BaseButton
                    onClick={() => toggleExpand(item?.id)}
                    className="ml-2 p-0 min-w-0 h-auto bg-transparent border-none"
                  >
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                        isExpanded ? "rotate-270" : "-rotate-90"
                      }`}
                    />
                  </BaseButton>
                )}
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded && hasChildren
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {hasChildren && (
                  <div className="pl-[28px] space-y-[10px] pt-[10px]">
                    {itemChildren?.map((child) => {
                      const isChildSelected = selectedChildren.has(child?.id);
                      return (
                        <div key={child?.id} className="flex items-center">
                          <BaseCheckbox
                            name={`${childNamePrefix}${child?.id}`}
                            checked={isChildSelected}
                            onChange={(checked) =>
                              onChildChange(child?.id, item?.id, checked)
                            }
                            label={child?.name}
                            labelClassName={`flex items-center text-textBase font-light xl:leading-[100%] xl:tracking-[0px] ${
                              isChildSelected
                                ? "text-deepTeal"
                                : "text-obsidianBlack"
                            }`}
                            checkboxClassName={`${
                              isChildSelected
                                ? "[&_.p-checkbox-box]:bg-deepTeal [&_.p-checkbox-box]:border-deepTeal"
                                : ""
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HierarchicalCheckboxGroup;
