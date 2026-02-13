"use client";
import { ListingCatalog } from "@/components/sell/current-listing";
import React from "react";
import MarketingCard from "./marketing-card";
function ListingSameCategory({
  listingsSameCategory,
}: {
  listingsSameCategory: ListingCatalog[] | undefined;
}) {
  return (
    <div className="py-4 lg:w-[90%] w-[95%] mx-auto lg:px-8 ">
      <div className="mb-2 flex items-start">
        <h1 className="font-bold text-2xl">Các sản phẩm tương tự</h1>
      </div>
      {listingsSameCategory ? (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-100">
          {listingsSameCategory.map((item) => (
            <MarketingCard key={item.id} listing={item} />
          ))}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default ListingSameCategory;
