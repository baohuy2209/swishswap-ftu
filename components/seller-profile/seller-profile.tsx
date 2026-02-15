"use client";
import { Prisma, Review } from "@/lib/generated/prisma/client";
import Image from "next/image";
import { ListingCatalog } from "../sell/current-listing";
import Link from "next/link";
import { ArrowLeftToLine } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNumberVN } from "@/components/market/components/marketing-card";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
export type UserWithExtras = Prisma.UserGetPayload<{
  include: {
    listings: true;
    received_reviews: {
      select: {
        rating: true;
        comment: true;
      };
    };
  };
}>;

export type SafeUserWithExtras = Omit<
  UserWithExtras,
  "password_hash" | "listings"
> & {
  rating_count: number;
  review_count: number;
  listings: (ListingCatalog | null)[];
};
export interface SellerProfileProps {
  safeUser: Omit<SafeUserWithExtras, "password_hash"> | null | undefined;
}
export default function SellerProfile({ safeUser }: SellerProfileProps) {
  if (!safeUser) {
    return <p>Lỗi khi load dữ liệu</p>;
  }
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <Link
          href="/market"
          className="flex flex-row gap-2 items-center justify-start hover:scale-110"
        >
          {" "}
          <ArrowLeftToLine className="w-3 h-3" /> <span>Quay trở lại</span>
        </Link>
        {/* Profile Section */}
        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col md:flex-row gap-6 border-b pb-6">
            {/* Avatar */}
            <Avatar className="w-40 h-40">
              <AvatarImage
                src={safeUser.avatar_url ?? "/image.png"}
                alt="Nguyễn Bảo Huy"
              />
              <AvatarFallback>{safeUser.name}</AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-semibold mb-2">{safeUser.name}</h1>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                {safeUser.email_verified ? (
                  <span className="px-3 py-1 text-sm rounded-full bg-sky-100 text-sky-700 font-medium">
                    ✓ Đã xác minh
                  </span>
                ) : (
                  <span className="px-3 py-1 text-sm rounded-full bg-sky-100 text-red-700 font-medium">
                    x Chưa xác minh
                  </span>
                )}

                <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700 font-medium">
                  ⭐ {safeUser.rating_count}/5.0
                </span>
                <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-700 font-medium">
                  📦 {safeUser.listings.length} sản phẩm
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {[
                  {
                    label: "Đang bán",
                    value: safeUser.listings.filter(
                      (item) => item?.status! === "available",
                    ).length,
                  },
                  {
                    label: "Đã bán",
                    value: safeUser.listings.filter(
                      (item) => item?.status! === "completed",
                    ).length,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-gray-50 rounded-lg p-4 text-center"
                  >
                    <div className="text-2xl font-bold text-emerald-500">
                      {item.value}
                    </div>
                    <div className="text-sm text-gray-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <InfoItem label="Email" value="huynguyen002311@gmail.com" />
            <InfoItem label="Số điện thoại" value="0375686583" />
            <InfoItem label="Trường đại học" value="Đại học Bách khoa Hà Nội" />
            <InfoItem label="Địa chỉ" value="TP Hồ Chí Minh" />
          </div>
        </section>

        {/* Products Section */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            📦 Các sản phẩm
          </h2>

          {safeUser.listings.length === 0 ? (
            <div className="text-gryay-800">Chưa có sản phẩm</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {safeUser.listings.map((item) =>
                item ? <ProductCard key={item.id} item={item} /> : null,
              )}
            </div>
          )}
        </section>
        <ReviewCard reviews={safeUser.received_reviews} />
      </main>
    </div>
  );
}

/* ---------- Sub Components ---------- */

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}
interface ProductCardProps {
  item: ListingCatalog;
}
function ProductCard({ item }: ProductCardProps) {
  if (!item) {
    return null;
  }
  return (
    <div className="rounded-xl overflow-hidden bg-white relative shadow hover:shadow-lg transition hover:-translate-y-1">
      <div className="absolute top-2 right-2 z-10">
        {item.status === "completed" ? (
          <span className="bg-red-700 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
            Đã bán
          </span>
        ) : (
          <span className="bg-linear-to-r from-green-600 via-emerald-600 to-teal-700 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
            Đang bán
          </span>
        )}
      </div>
      <div className="relative h-48 w-full">
        {item.image_url && (
          <Image
            src={item.image_url}
            alt={item.title || "Product Image"}
            fill
            className="object-cover p-2 rounded-md"
            loading="lazy"
          />
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
        <div className="text-emerald-500 text-xl font-bold mb-2">
          {formatNumberVN(item.price)} VNĐ
        </div>
      </div>
    </div>
  );
}
interface ReviewCardProps {
  reviews: UserWithExtras["received_reviews"][number][];
}
const ReviewCard = ({ reviews }: ReviewCardProps) => {
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-linear-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Đánh giá từ khách hàng
          </h1>
          <p className="text-slate-600">
            Những phản hồi chân thực từ người dùng
          </p>
        </div>

        {reviews.map((review) => (
          <Card
            key={review.comment}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-slate-200"
          >
            <CardContent className="p-6">
              {/* Header: Rating and Date */}
              <div className="flex items-center justify-between mb-4">
                <StarRating rating={review.rating} />
              </div>

              {/* Review Content */}
              <p className="text-slate-700 leading-relaxed">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
