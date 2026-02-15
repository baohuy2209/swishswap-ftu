"use server";
import { ListingClient } from "@/components/sell/current-listing";
import prisma from "@/lib/db/prisma";
import { getCurrentSession } from "./auth";
import { postingSwapPrefrence } from "@/schemas";
import z from "zod";
import { getArrayListingIdFromUser } from "./listings";
import { SwapPreference } from "@/lib/generated/prisma/client";
export const createSwapPreference = async (
  listingInfo: ListingClient,
  values: z.infer<typeof postingSwapPrefrence>,
) => {
  const { user } = await getCurrentSession();
  const validatedField = postingSwapPrefrence.parse(values);
  const {
    product_name,
    product_price,
    product_status,
    pickup_location,
    pickup_time,
    note,
  } = validatedField;
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
      product_name: product_name,
      product_price: Number(product_price),
      product_status: product_status,
      pickup_location: pickup_location,
      pickup_time: pickup_time,
    },
  });
  return {
    swapPreference,
    success: "Gửi lời đề nghị trao đổi thành công",
  };
};
export async function getSwapByListingId(listing_id: string) {
  try {
    const swapReferences = await prisma.swapPreference.findMany({
      where: {
        listing_id: listing_id,
      },
    });
    return {
      success: "Load thành công",
      swapReferences,
    };
  } catch (e) {
    console.log(e instanceof Error ? `${e.message}` : "");
    return {
      error: "Lỗi khi load thông tin các loại sản phẩm ",
      swapReferences: null,
    };
  }
}
export async function getSwapById(id: string) {
  try {
    const swapReference = await prisma.swapPreference.findUnique({
      where: {
        id: id,
      },
    });
    return {
      success: "Load thành công",
      swapReference,
    };
  } catch (e) {
    console.log(e instanceof Error ? `${e.message}` : "");
    return {
      error: "Lỗi khi load thông tin các loại sản phẩm ",
      swapReference: null,
    };
  }
}
export async function acceptedForSwap(swap_id: string) {
  try {
    await prisma.swapPreference.update({
      where: {
        id: swap_id,
      },
      data: {
        status: "accepted",
      },
    });
    return {
      success: "Đã chấp nhận yêu cầu trao đổi",
    };
  } catch (e) {
    console.log(e);
    return {
      error: "Có lỗi khi giao dịch",
    };
  }
}
export async function declinedForSwap(swap_id: string) {
  try {
    await prisma.swapPreference.update({
      where: {
        id: swap_id,
      },
      data: {
        status: "declined",
      },
    });
    return {
      success: "Đã chấp nhận yêu cầu trao đổi",
    };
  } catch (e) {
    console.log(e);
    return {
      error: "Có lỗi khi giao dịch",
    };
  }
}
export const getUserSwaps = async () => {
  const arrayListingIdCurrentUser = await getArrayListingIdFromUser();
  const listSwap: SwapPreference[] = [];
  const length_array = arrayListingIdCurrentUser.length;
  for (let i = 0; i < length_array; i++) {
    const { swapReferences } = await getSwapByListingId(
      arrayListingIdCurrentUser[i],
    );
    if (!swapReferences) continue;
    listSwap.push(...swapReferences);
  }
  return listSwap;
};

export const getUserSwapsAvailable = async () => {
  const arrayListingIdCurrentUser = await getArrayListingIdFromUser();
  const listSwap: SwapPreference[] = [];
  const length_array = arrayListingIdCurrentUser.length;
  for (let i = 0; i < length_array; i++) {
    const { swapReferences } = await getSwapByListingId(
      arrayListingIdCurrentUser[i],
    );
    if (!swapReferences) continue;
    listSwap.push(...swapReferences);
  }
  return listSwap.filter((item) => item.status === "pending");
};
