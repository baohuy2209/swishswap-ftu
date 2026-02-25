import React from "react";
import { ListingCatalog } from "../sell/current-listing";
import MarketingCard from "../market/components/marketing-card";
export interface SearchResultProps {
  safeListings: ListingCatalog[];
}
function SearchResult({ safeListings }: SearchResultProps) {
  return (
    <div className="py-4 mt-4">
      {safeListings.length > 0 ? (
        <div className="mt-4 p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-stretch">
          {safeListings.map((item) => (
            <MarketingCard key={item.id} listing={item} />
          ))}
        </div>
      ) : (
        <p>Không có sản phẩm</p>
      )}
    </div>
  );
}

export default SearchResult;
