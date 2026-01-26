"use client";
import { ListingCatalog } from "@/components/sell/current-listing";
import MarketingCard from "@/components/market/components/marketing-card";
export interface MainMarketProps {
  safeListings: ListingCatalog[];
}
function MainMarket({ safeListings }: MainMarketProps) {
  return (
    <>
      {safeListings.length > 0 ? (
        <div className="mt-4 p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {safeListings.map((item) => (
            <MarketingCard key={item.id} listing={item} />
          ))}
        </div>
      ) : (
        <p>Chưa có sản phẩm nào được đăng bán</p>
      )}
    </>
  );
}

export default MainMarket;
