"use server";
import { ListingClient } from "@/components/sell/current-listing";
import prisma from "@/lib/db/prisma";
import { getCurrentSession } from "./auth";
import { postingSwapPrefrence } from "@/schemas";
import z from "zod";
export const createSwapPreference = async (
  listingInfo: ListingClient,
  values: z.infer<typeof postingSwapPrefrence>,
) => {
  const { user } = await getCurrentSession();
  const validatedField = postingSwapPrefrence.parse(values);
  const { note } = validatedField;
  if (!user) {
    return {
      error: "Bạn cần đăng nhập để thực hiện thao thác này",
    };
  }
  const swapPreference = await prisma.swapPreference.create({
    data: {
      listing_id: listingInfo.id,
      category_id: listingInfo.category_id,
      sender_id: user?.id,
      Note: note,
    },
  });
  return {
    swapPreference,
    success: "Gửi lời đề nghị trao đổi thành công",
  };
};
