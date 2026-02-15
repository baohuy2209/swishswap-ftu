"use client";
import { Heart, Star } from "lucide-react";
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
import { getSellerInfoByListingId, increaseHeart } from "@/actions/listings";
import { getCategoryById } from "@/actions/category";

export type AuthorListing = {
  author: string;
  avatar: string | Blob | undefined;
  university_name: string;
  seller_id: string;
  rating_count: number;
};
function MarketingCard({ listing }: MarketingCardProp) {
  const [seller, setSeller] = React.useState<AuthorListing>({
    author: "",
    avatar: "",
    university_name: "",
    seller_id: "",
    rating_count: 0,
  });
  const [category, setCategory] = React.useState<string | undefined>("");
  const [error, setError] = React.useState("");
  const [heart, setHeart] = React.useState<number>(listing.favorite_count);
  const [isPending, startTransition] = React.useTransition();

  const onHeart = () => {
    setHeart((h) => h + 1);
    startTransition(() => {
      increaseHeart(listing.id).then((res) => {
        if (res?.error) {
          setHeart((h) => h - 1);
        }
      });
    });
  };

  React.useEffect(() => {
    getSellerInfoByListingId(listing.id).then((res) => {
      const { author, avatar, university_name, rating_count, seller_id } = res;
      if (res.error) {
        setError("Lỗi khi load data");
      }
      setSeller({
        author: author ? author : "Nguyễn Bảo Huy",
        university_name: university_name
          ? university_name
          : "Trường Đại học Kinh tế - Luật",
        avatar: avatar === null || avatar === undefined ? "/image.png" : avatar,
        seller_id: seller_id!,
        rating_count: rating_count!,
      });
    });
    getCategoryById(listing.id).then((res) => {
      if (res.error) {
        setError("Lỗi khi load data");
      }
      if (res.success) {
        setCategory(res.category?.name);
      }
    });
  }, [listing]);
  function generateHashtags(
    productName: string,
    category: string | undefined,
    maxTags = 8,
  ): string[] {
    const normalize = (text: string) =>
      text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "") // bỏ ký tự đặc biệt
        .trim();

    const wordsFrom = (text: string) =>
      normalize(text)
        .split(/\s+/)
        .filter((w) => w.length > 2);

    const nameWords = wordsFrom(productName);
    const tags = new Set<string>();

    if (category) {
      const categoryWords = wordsFrom(category);
      categoryWords.forEach((w) => tags.add(`#${w}`));
      if (categoryWords.length > 1) {
        tags.add(`#${categoryWords.join("")}`);
      }
    }
    // hashtag từ tên sản phẩm
    nameWords.forEach((w) => tags.add(`#${w}`));
    if (nameWords.length > 1) {
      tags.add(`#${nameWords.join("")}`);
    }

    return Array.from(tags).slice(0, maxTags);
  }
  return (
    <div className="h-full">
      {error ? (
        <p>Có lỗi, không thể load page được </p>
      ) : (
        <div className="flex flex-col justify-between h-full bg-white rounded-lg overflow-hidden relative space-y-3">
          <div className="absolute top-2 right-2 z-10">
            {listing.swap_enabled ? (
              <div className="flex gap-2">
                <span className="bg-linear-to-r from-green-600 via-emerald-600 to-teal-700 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                  Swappable
                </span>
                <span className="bg-linear-to-r from-green-600 via-emerald-600 to-teal-700 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                  Negotiable
                </span>
              </div>
            ) : (
              <span className="bg-linear-to-r from-green-600 via-emerald-600 to-teal-700 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                Negotiable
              </span>
            )}
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
            <h3 className="text-xl font-medium line-clamp-2 h-10 mb-1 py-2">
              {listing.title}
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-start justify-center gap-2">
                <span className="text-sm font-medium">
                  {listing.description.length > 100
                    ? listing.description.substring(0, 100) + "..."
                    : listing.description}
                </span>
                <div className="w-full flex flex-col md:justify-between gap-2 justify-center items-start">
                  <span className="text-lg font-bold text-emerald-600">
                    {formatNumberVN(listing.price)} VNĐ
                  </span>
                  <div className="flex flex-row gap-2">
                    <div className="flex items-center gap-1 rounded-full bg-white py-1 text-sm ">
                      <span className="whitespace-nowrap">
                        {listing.view_count} views
                      </span>
                    </div>
                    <div
                      onClick={() => {
                        onHeart();
                      }}
                      className="flex items-center gap-1 rounded-full bg-white py-1 text-sm "
                    >
                      <Heart className="h-4 w-4 text-emerald-600 fill-emerald-600" />
                      <span>{heart}</span>
                    </div>

                    {/* Views */}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {generateHashtags(listing.title, category, 3).map((tag) => (
                    <span
                      key={tag}
                      className="bg-gradient text-white font-bold p-1 rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex flex-row justify-center items-center gap-2">
                  <Avatar>
                    <AvatarImage src={seller.avatar} alt="Nguyễn Bảo Huy" />
                    <AvatarFallback>{seller.author}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col justify-center items-start">
                    <div className="flex flex-row gap-2 items-center justify-center">
                      <Link
                        href={`/vendor-profile/${seller.seller_id}`}
                        className="text-gradient font-bold text-lg"
                      >
                        {seller.author}
                      </Link>
                      <p className="flex flex-row gap-0.5 items-center justify-center">
                        <span>{seller.rating_count}</span>
                        <Star className="fill-yellow-400 text-yellow-400" />
                      </p>
                    </div>

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
                Xem chi tiết
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketingCard;
