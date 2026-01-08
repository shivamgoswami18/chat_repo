import { useState, useCallback } from "react";
import { ParentItem } from "../constants/Projects";

export interface UseHierarchicalFilterReturn {
  selectedParents: Set<string>;
  selectedChildren: Set<string>;
  handleParentChange: (parentId: string, checked: boolean) => void;
  handleChildChange: (
    childId: string,
    parentId: string,
    checked: boolean
  ) => void;
  reset: () => void;
}

export const useHierarchicalFilter = (
  items: ParentItem[]
): UseHierarchicalFilterReturn => {
  const [selectedParents, setSelectedParents] = useState<Set<string>>(
    new Set()
  );
  const [selectedChildren, setSelectedChildren] = useState<Set<string>>(
    new Set()
  );

  const handleParentChange = useCallback(
    (parentId: string, checked: boolean) => {
      const parent = items.find((item) => item.id === parentId);
      if (!parent) return;

      setSelectedParents((prev) => {
        const newSet = new Set(prev);
        if (checked) {
          newSet.add(parentId);
        } else {
          newSet.delete(parentId);
        }
        return newSet;
      });

      setSelectedChildren((prev) => {
        const newSet = new Set(prev);
        if (checked) {
          parent.children.forEach((child) => newSet.add(child.id));
        } else {
          parent.children.forEach((child) => newSet.delete(child.id));
        }
        return newSet;
      });
    },
    [items]
  );

  const handleChildChange = useCallback(
    (childId: string, parentId: string, checked: boolean) => {
      const parent = items.find((item) => item.id === parentId);
      if (!parent) return;

      setSelectedChildren((prev) => {
        const newSet = new Set(prev);
        if (checked) {
          newSet.add(childId);
        } else {
          newSet.delete(childId);
        }

        const allChildrenSelected = parent.children.every((child) =>
          newSet.has(child.id)
        );

        setSelectedParents((prevParents) => {
          const newParents = new Set(prevParents);
          if (allChildrenSelected) {
            newParents.add(parentId);
          } else {
            newParents.delete(parentId);
          }
          return newParents;
        });

        return newSet;
      });
    },
    [items]
  );

  const reset = useCallback(() => {
    setSelectedParents(new Set());
    setSelectedChildren(new Set());
  }, []);

  return {
    selectedParents,
    selectedChildren,
    handleParentChange,
    handleChildChange,
    reset,
  };
};
