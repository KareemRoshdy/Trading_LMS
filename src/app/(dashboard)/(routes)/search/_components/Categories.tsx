"use client";

import { Category } from "@prisma/client";
import {
  FcSalesPerformance,
  FcCandleSticks,
  FcComboChart,
  FcCurrencyExchange,
} from "react-icons/fc";

import { IconType } from "react-icons";
import CategoryItem from "./CategoryItem";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  "Forex Strategies": FcCandleSticks,
  "Currency Pairs": FcSalesPerformance,
  "Technical Analysis": FcComboChart,
  "Options Trading": FcCurrencyExchange,
};

const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
};

export default Categories;
