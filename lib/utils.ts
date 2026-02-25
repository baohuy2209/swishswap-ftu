import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Listing } from "./generated/prisma/client";
import {
  ListingCatalog,
  ListingClient,
} from "@/components/sell/current-listing";
import {
  SafeUserWithExtras,
  UserWithExtras,
} from "@/components/seller-profile/seller-profile";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOrderNumber(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";

  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `ORD-${result}`;
}

export const serializeListing = (item: Listing): ListingClient => ({
  id: item.id,
  seller_id: item.seller_id,
  university_id: item.university_id,
  category_id: item.category_id,

  title: item.title,
  description: item.description,
  condition: item.condition,
  status: item.status,
  location: item.location,
  swap_enabled: item.swap_enabled,
  search_text: item.search_text,
  view_count: item.view_count,
  favorite_count: item.favorite_count,

  price: item.price.toNumber(),

  created_at: item.created_at.toISOString(),
  updated_at: item.updated_at.toISOString(),
  published_at: item.published_at?.toISOString() ?? null,
  reserved_at: item.reserved_at?.toISOString() ?? null,
  completed_at: item.completed_at?.toISOString() ?? null,
});

export function formatDateVN(isoString: string | null) {
  const date = new Date(isoString ? isoString : new Date());

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  });
}
export function toSafeUserWithExtras(
  user: Omit<UserWithExtras, "listings"> & {
    listings: (ListingCatalog | null)[];
  },
): SafeUserWithExtras {
  const { password_hash, ...rest } = user;

  const review_count = user.received_reviews.length;
  const rating_count =
    review_count === 0
      ? 0
      : user.received_reviews.reduce((s, r) => s + r.rating, 0) / review_count;

  return {
    ...rest,
    rating_count,
    review_count,
  };
}
export function removeVietnameseTones(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}
