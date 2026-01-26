import { ListingClient } from "@/components/sell/current-listing";
export function formatNumberVN(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}
export interface ListingsCardProp {
  listing: ListingClient & { image_url: string };
}
import Link from "next/link";
import Image from "next/image";
function ListingsCard({ listing }: ListingsCardProp) {
  return (
    <div className="bg-white rounded-lg overflow-hidden relative space-y-3">
      <div className="absolute top-2 right-2 z-10">
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
          {listing.status}
        </span>
      </div>

      <div className="relative h-48 w-full">
        {listing.image_url && (
          <Image
            src={listing.image_url}
            alt={listing.title || "Product Image"}
            fill
            className="object-cover p-2 rounded-md"
            loading="lazy"
          />
        )}
      </div>

      <div className="p-4 space-y-4">
        <h3 className="text-xl font-medium line-clamp-2 h-10 mb-1">
          {listing.title}
        </h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-start justify-center gap-2">
            <span className="text-sm font-medium">
              {listing.description.length > 20
                ? listing.description.substring(0, 20) + "..."
                : listing.description}
            </span>
            <span className="text-lg font-bold text-emerald-600">
              {formatNumberVN(listing.price)} VNĐ
            </span>
          </div>
          <Link
            href={`sell/listings/${listing.id}`}
            className="w-full text-center bg-gradient text-white py-2 rounded-full text-sm font-bold hover:brightness-110 transition-all"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ListingsCard;
