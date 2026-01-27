"use server";
import { ListingClient } from "@/components/sell/current-listing";
import prisma from "@/lib/db/prisma";
import { postingOffer } from "@/schemas";
import z from "zod";
import { getCurrentSession } from "@/actions/auth";
export const createOffer = async (
  listingInfo: ListingClient,
  values: z.infer<typeof postingOffer>,
) => {
  const { user } = await getCurrentSession();
  if (!user) {
    return {
      error: "Bạn cần đăng nhập để thực hiện thao thác này",
    };
  }
  const validatedFields = postingOffer.parse(values);
  const { price_offferd, pickup_location, pickup_time, note, contact } =
    validatedFields;
  console.log(note);
  await prisma.offer.create({
    data: {
      listing_id: listingInfo.id,
      sender_id: user.id,
      price_offered: price_offferd,
      pickup_location: pickup_location,
      pickup_time,
      note,
      contact,
      expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    },
  });
  return {
    success: "Gửi lời đề nghị trao đổi thành công",
  };
};
