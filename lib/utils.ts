import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Listing } from "./generated/prisma/client";
import { ListingClient } from "@/components/sell/current-listing";

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
