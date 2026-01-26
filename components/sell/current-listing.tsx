"use client";
import { Listing } from "@/lib/generated/prisma/client";
import ListingsCard from "@/components/sell/components/listing-card";
export type ListingClient = Omit<
  Listing,
  | "price"
  | "created_at"
  | "updated_at"
  | "published_at"
  | "reserved_at"
  | "completed_at"
> & {
  price: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  reserved_at: string | null;
  completed_at: string | null;
};
export type ListingCatalog = ListingClient & { image_url: string };
export interface CurrentListingProp {
  safeListings: ListingCatalog[];
}
function CurrentListing({ safeListings }: CurrentListingProp) {
  return (
    <>
      {safeListings.length > 0 ? (
        <div className="mt-4 p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {safeListings.map((item) => (
            <ListingsCard key={item.id} listing={item} />
          ))}
        </div>
      ) : (
        <p>Không có sản phẩm nào</p>
      )}
    </>
  );
}

export default CurrentListing;
