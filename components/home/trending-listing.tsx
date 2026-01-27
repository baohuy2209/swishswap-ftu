"use client";
import Link from "next/link";
import { ListingWithImage } from ".";
import MarketingCard from "../market/components/marketing-card";

function TrendingListing({
  safeListings,
}: {
  safeListings?: ListingWithImage;
}) {
  if (safeListings === undefined) {
    return null;
  }
  return (
    <div className="max-w-7xl mx-auto px-4 mt-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            🔥 Sản phẩm nổi bật
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Những món đồ đang được quan tâm nhiều nhất trên SwishSwap
          </p>
        </div>

        <Link
          href="/market"
          className="text-sm text-green-600 hover:underline hidden sm:block"
        >
          Xem tất cả →
        </Link>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 py-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {safeListings.map((item) => (
          <div key={item.id} className="h-full">
            <MarketingCard listing={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrendingListing;
