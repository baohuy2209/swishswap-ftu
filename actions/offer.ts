"use server";
import { ListingClient } from "@/components/sell/current-listing";
import prisma from "@/lib/db/prisma";
import { postingOffer } from "@/schemas";
import z from "zod";
import { getCurrentSession } from "@/actions/auth";
import { getArrayListingIdFromUser } from "./listings";
import { Offer } from "@/lib/generated/prisma/client";
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
  const { price_offferd, pickup_location, pickup_time, note } = validatedFields;
  await prisma.offer.create({
    data: {
      listing_id: listingInfo.id,
      sender_id: user.id,
      price_offered: price_offferd,
      pickup_location: pickup_location,
      pickup_time,
      note,
      expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    },
  });
  return {
    success: "Gửi lời đề nghị trao đổi thành công",
  };
};
export const getOfferByListingId = async (listing_id: string) => {
  try {
    const offers = await prisma.offer.findMany({
      where: {
        listing_id: listing_id,
      },
    });
    return {
      success: "Load thành công",
      offers,
    };
  } catch (e) {
    console.log(e instanceof Error ? `${e.message}` : "");
    return {
      error: "Lỗi khi load thông tin các loại sản phẩm ",
      offers: null,
    };
  }
};

export const getUserOffers = async () => {
  const arrayListingIdCurrentUser = await getArrayListingIdFromUser();
  const listOffers: Offer[] = [];
  const length_array = arrayListingIdCurrentUser.length;
  for (let i = 0; i < length_array; i++) {
    const { offers } = await getOfferByListingId(arrayListingIdCurrentUser[i]);
    if (!offers) continue;
    listOffers.push(...offers);
  }
  return listOffers;
};
export async function acceptedForOffer(offer_id: string) {
  try {
    await prisma.offer.update({
      where: {
        id: offer_id,
      },
      data: {
        status: "accepted",
        responded_at: new Date(),
      },
    });
    return {
      success: "Đã chấp nhận yêu cầu",
    };
  } catch (e) {
    console.log(e);
    return {
      error: "Có lỗi khi giao dịch",
    };
  }
}
export async function declinedForOffer(offer_id: string) {
  try {
    await prisma.offer.update({
      where: {
        id: offer_id,
      },
      data: {
        status: "declined",
        responded_at: new Date(),
      },
    });
    return {
      success: "Đã chấp nhận yêu cầu",
    };
  } catch (e) {
    console.log(e);
    return {
      error: "Có lỗi khi giao dịch",
    };
  }
}

export async function completedForOffer(offer_id: string) {
  try {
    await prisma.offer.update({
      where: {
        id: offer_id,
      },
      data: {
        status: "countered",
        responded_at: new Date(),
      },
    });
    return {
      success: "Đã chấp nhận yêu cầu",
    };
  } catch (e) {
    console.log(e);
    return {
      error: "Có lỗi khi giao dịch",
    };
  }
}
export const getOfferById = async (id: string) => {
  try {
    const offer = await prisma.offer.findUnique({
      where: {
        id: id,
      },
    });
    return {
      success: "Load thành công",
      offer,
    };
  } catch (e) {
    console.log(e instanceof Error ? `${e.message}` : "");
    return {
      error: "Lỗi khi load thông tin các loại sản phẩm ",
      offer: null,
    };
  }
};
