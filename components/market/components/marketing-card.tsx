"use client";
import { ListingClient } from "@/components/sell/current-listing";
export function formatNumberVN(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}
export interface MarketingCardProp {
  listing: ListingClient & { image_url: string };
}
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { getSellerInfoByListingId } from "@/actions/listings";
type AuthorListing = {
  author: string;
  avatar: string | Blob | undefined;
  university_name: string;
};
function MarketingCard({ listing }: MarketingCardProp) {
  const [seller, setSeller] = React.useState<AuthorListing>({
    author: "",
    avatar: "",
    university_name: "",
  });
  const [error, setError] = React.useState("");
  React.useEffect(() => {
    getSellerInfoByListingId(listing.id).then((res) => {
      const { author, avatar, university_name } = res;
      if (res.error) {
        setError("Lỗi khi load data");
      }
      setSeller({
        author: author ? author : "Nguyễn Bảo Huy",
        university_name: university_name
          ? university_name
          : "Trường Đại học Kinh tế - Luật",
        avatar: avatar === null || avatar === undefined ? "/image.png" : avatar,
      });
    });
  }, []);
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
            <div className="flex flex-row justify-center items-center gap-2">
              <Avatar>
                <AvatarImage src={seller.avatar} alt="Nguyễn Bảo Huy" />
                <AvatarFallback>{seller.author}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center items-start">
                <span className="text-gradient font-bold text-lg">
                  {seller.author}
                </span>
                <small className="text-sm text-gray-600">
                  {seller.university_name}
                </small>
              </div>
            </div>
          </div>
          <Link
            href={`market/${listing.id}`}
            className="w-full text-center bg-gradient text-white py-2 rounded-full text-sm font-bold hover:brightness-110 transition-all"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MarketingCard;
