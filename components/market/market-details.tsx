"use client";
import { ListingMedia } from "@/lib/generated/prisma/client";
import { ListingClient } from "@/components/sell/current-listing";
import { ChevronRight, Home, Hospital } from "lucide-react";
import Image from "next/image";
import { formatNumberVN } from "@/components/sell/components/listing-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RelatedImage from "@/components/sell/components/related-image";
import React from "react";
import { getUniveryById } from "@/actions/university";
import { getCategoryById } from "@/actions/category";
export interface MarketDetailProps {
  listingInfo: ListingClient;
  listMedia: ListingMedia[];
}
function MarketDetails({ listingInfo, listMedia }: MarketDetailProps) {
  const mainImage = listMedia.find((item) => item.is_main_image);
  const relatedImage = listMedia.filter((item) => !item.is_main_image);
  const [uni_name, setUni_name] = React.useState("");
  const [category, setCategory] = React.useState("");
  React.useEffect(() => {
    getUniveryById(listingInfo.university_id).then((res) => {
      const { university } = res;
      if (!university) {
        return;
      } else {
        setUni_name(university.label);
      }
    });
  }, [listingInfo.university_id]);
  React.useEffect(() => {
    getCategoryById(listingInfo.category_id).then((res) => {
      const { category } = res;
      if (!category) {
        return;
      } else {
        setCategory(category.name);
      }
    });
  }, [listingInfo.category_id]);
  return (
    <div className="bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto py-3 px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-gray-600 hover:text-emerald-600 transition-colors flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              <span>Trang chủ</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link
              href="/sell"
              className="text-gray-600 hover:text-emerald-600 transition-colors flex items-center gap-1"
            >
              <Hospital className="w-4 h-4" />
              <span>Thị Trường</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 truncate">{listingInfo.title}</span>
          </div>
        </div>
      </div>
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row gap-10">
          {/* IMAGE SECTION */}
          {mainImage?.images_url && (
            <div className="w-[95%] mx-auto md:w-1/2 min-h-100 relative bg-white rounded-3xl shadow-xl">
              <Image
                src={mainImage.images_url}
                alt={listingInfo.title}
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow">
                {listingInfo.condition === "new"
                  ? "MỚI"
                  : listingInfo.condition === "like_new"
                    ? "GẦN NHƯ MỚI"
                    : listingInfo.condition === "good"
                      ? "CÒN TỐT"
                      : "SỬ DỤNG ĐƯỢC"}
              </div>
            </div>
          )}

          {/* INFO SECTION */}
          <div className="w-[95%] mx-auto md:w-1/2 flex flex-col gap-6">
            {/* TITLE */}
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-800">
                {listingInfo.title}
              </h1>
              <p className="text-gray-500 text-sm">📍 {listingInfo.location}</p>
            </div>

            {/* PRICE */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                Giá bán
              </p>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-5xl font-black text-emerald-600">
                  {formatNumberVN(listingInfo.price)}
                </span>
                <span className="text-xl font-bold text-emerald-500">VNĐ</span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4">
              {listingInfo.swap_enabled ? (
                <>
                  <Button
                    variant="outline"
                    className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  >
                    Đề nghị mua
                  </Button>
                  <Button className="flex-1 bg-linear-to-r from-emerald-500 to-emerald-700 text-white shadow-lg">
                    Đề nghị trao đổi
                  </Button>
                </>
              ) : (
                <Button className="flex-1 bg-linear-to-r from-emerald-500 to-emerald-700 text-white shadow-lg">
                  Đề nghị mua
                </Button>
              )}
            </div>

            {/* META INFO */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <InfoItem label="Tình trạng" value={listingInfo.condition} />
              <InfoItem label="Trạng thái" value={listingInfo.status} />
              <InfoItem
                label="Lượt xem"
                value={listingInfo.view_count.toString()}
              />
              <InfoItem
                label="Yêu thích"
                value={listingInfo.favorite_count.toString()}
              />
              <InfoItem
                label="Đổi hàng"
                value={listingInfo.swap_enabled ? "Có hỗ trợ" : "Không"}
              />
              <InfoItem
                label="Ngày đăng"
                value={listingInfo.published_at ?? "Chưa đăng"}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-2">Mô tả sản phẩm</h3>
              <p className="text-gray-600 leading-relaxed">
                {listingInfo.description}
              </p>
            </div>

            {/* FOOTER INFO */}
            <div className="flex flex-col gap-3 text-sm bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <FooterItem icon="🏫" text={`Trường: ${uni_name}`} />
              <FooterItem icon="🗂️" text={`Danh mục: ${category}`} />
            </div>
          </div>
        </div>
        <RelatedImage listRelatedImage={relatedImage} />
      </div>
    </div>
  );
}

export default MarketDetails;
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800 mt-1">{value}</p>
    </div>
  );
}

function FooterItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3 text-gray-700">
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{text}</span>
    </div>
  );
}
