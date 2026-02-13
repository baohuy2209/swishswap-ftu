"use client";
import React from "react";
import { ListingCatalog } from "@/components/sell/current-listing";
import { useSession } from "@/providers/session-provider";
import { getUniveryById } from "@/actions/university";
import { AuthorListing } from "@/components/market/components/marketing-card";
import { getSellerInfoByListingId } from "@/actions/listings";
import { getUserById } from "@/actions/user";
import { User } from "@/lib/generated/prisma/client";
import Link from "next/link";
import { formatNumberVN } from "../sell/components/listing-card";
export interface ListingFromSameUniProps {
  listingFromSameUni: (ListingCatalog | null)[];
}
export interface SellerGroup {
  seller: AuthorListing;
  listings: ListingCatalog[];
}
function isListingCatalog(item: ListingCatalog | null): item is ListingCatalog {
  return item !== null;
}
export async function groupListingsBySeller(
  listings: (ListingCatalog | null)[],
): Promise<SellerGroup[]> {
  if (!listings || listings.length === 0) return [];

  const map = new Map<string, ListingCatalog[]>();

  listings.filter(isListingCatalog).forEach((listing) => {
    if (!map.has(listing.seller_id)) {
      map.set(listing.seller_id, []);
    }
    map.get(listing.seller_id)!.push(listing);
  });
  let listGroupListings = [];
  for (const [key, value] of map) {
    const { safeUser } = await getUserById(key);
    const sellerInfo = {
      author: safeUser?.name ?? "Nguyễn Bảo Huy",
      university_name:
        safeUser?.university_name ?? "Trường Đại học Kinh tế - Luật",
      avatar: safeUser?.avatar_url ?? "/image.png",
    };
    listGroupListings.push({
      seller: sellerInfo,
      listings: value,
    });
  }
  return listGroupListings;
}
function ListingFromSameUni({ listingFromSameUni }: ListingFromSameUniProps) {
  const user = useSession();
  const [university, setUniversity] = React.useState("");
  const [listingMapSeller, setListingMapSeller] = React.useState<SellerGroup[]>(
    [],
  );

  React.useEffect(() => {
    getUniveryById(user?.university_id || "cmks5a4fm000lustgao9dyrkh").then(
      (res) => {
        setUniversity(res.university?.label || "Đại học Bách khoa Hà Nội");
      },
    );
    groupListingsBySeller(listingFromSameUni).then((res) => {
      setListingMapSeller(res);
    });
  }, [listingFromSameUni]);
  return (
    <div className="lg:w-[90%] w-[95%] mx-auto p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sản phẩm từ người bán cùng trường đại học
        </h1>
        <p className="text-gray-600">
          Khám phá các sản phẩm từ sinh viên cùng{" "}
          <span className="font-bold">{university}</span>
        </p>
      </div>
      {listingFromSameUni.length === 0 || !listingFromSameUni ? (
        <p className="text-gray-700 text-sm">
          Chưa có người bán nào cùng trường
        </p>
      ) : (
        <div className="space-y-6">
          {listingMapSeller.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border-2 border-transparent hover:border-green-500 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-4 pb-5 border-b-2 border-gray-100 mb-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  us
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {item.seller.author}
                  </h2>
                  <p className="text-gray-600 text-sm flex items-center gap-1">
                    <span>📍</span>
                    <span>{item.listings.length} sản phẩm</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-100">
                {item.listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="min-w-[350px] max-w-[350px] border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-white hover:border-green-500 hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex gap-4"
                  >
                    <div className="w-24 h-24 min-w-[96px] rounded-md bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-5xl">
                      📱
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <h3 className="font-bold text-gray-900 leading-snug">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-tight">
                        {listing.description}
                      </p>
                      <div className="flex flex-col justify-between items-start gap-2 mt-auto">
                        <span className="text-lg font-bold text-green-600">
                          {formatNumberVN(listing.price)} ₫
                        </span>
                        <Link
                          href={`market/${listing.id}`}
                          className="px-4 py-1.5 bg-white border-2 border-green-500 text-green-600 rounded-md text-sm font-semibold hover:bg-green-500 hover:text-white transition-colors duration-200"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListingFromSameUni;
