"use client";
import { ListingCatalog } from "@/components/sell/current-listing";
import MarketingCard from "@/components/market/components/marketing-card";
import TrendingListing from "../home/trending-listing";
import ListingFromSameUni from "./listing-same-uni";
export interface MainMarketProps {
  safeListings: ListingCatalog[];
  listingFromSameUni: (ListingCatalog | null)[];
}
export function getTop3Listings(listings: ListingCatalog[]) {
  return listings
    .filter((item) => item.status === "available") // giống where
    .sort((a, b) => b.view_count - a.view_count) // desc
    .slice(0, 3);
}
function MainMarket({ safeListings, listingFromSameUni }: MainMarketProps) {
  return (
    <div className="py-4 mt-4">
      <div className="bg-[#f8f8f8] rounded-[24px] py-4 lg:w-[90%] w-full mx-auto">
        <TrendingListing safeListings={getTop3Listings(safeListings)} />
        <ListingFromSameUni listingFromSameUni={listingFromSameUni} />
      </div>
      {safeListings.length > 0 ? (
        <div className="mt-4 p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-stretch">
          {safeListings.map((item) => (
            <MarketingCard key={item.id} listing={item} />
          ))}
        </div>
      ) : (
        <p>Chưa có sản phẩm nào được đăng bán</p>
      )}
    </div>
  );
}

export default MainMarket;
