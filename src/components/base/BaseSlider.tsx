"use client";

import { ReactNode } from "react";
import { Carousel } from "primereact/carousel";

interface BaseSliderProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  itemClassName?: string;
  onItemHover?: (index: number | null) => void;
}

const BaseSlider = <T,>({
  items,
  renderItem,
  itemClassName = "",
  onItemHover,
}: BaseSliderProps<T>) => {
  const responsiveOptions = [
    {
      breakpoint: "1000px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "600px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  const itemsWithIndex = items.map((item, index) => ({ item, index }));

  const itemTemplate = ({ item, index }: { item: T; index: number }) => (
    <div
      className={`h-full ${itemClassName}`}
      onMouseEnter={() => onItemHover?.(index)}
      onMouseLeave={() => onItemHover?.(null)}
    >
      {renderItem(item, index)}
    </div>
  );

  return (
    <Carousel
      value={itemsWithIndex}
      itemTemplate={itemTemplate}
      numVisible={3}
      numScroll={1}
      responsiveOptions={responsiveOptions}
      circular={false}
      showIndicators={false}
    />
  );
};

export default BaseSlider;
