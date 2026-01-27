"use server";
import prisma from "@/lib/db/prisma";
import { getCurrentSession } from "@/actions/auth";
import { getOfferById } from "./offer";
import { Prisma } from "@/lib/generated/prisma/client";
import { generateOrderNumber } from "@/lib/utils";

export const createOrder = async (offer_id: string) => {
  const { user } = await getCurrentSession();
  const { offer } = await getOfferById(offer_id);

  if (!user) {
    return {
      error: "Cần đăng nhập để thực hiện thao tác này",
    };
  }
  if (!offer) {
    return {
      error: "Lỗi khi load offer",
    };
  }
  const transactionFee = offer.price_offered
    ? offer.price_offered.mul(0.05)
    : new Prisma.Decimal(0);
  const totalAmount = offer.price_offered
    ? offer.price_offered.add(transactionFee)
    : new Prisma.Decimal(0);
  await prisma.order.create({
    data: {
      order_number: generateOrderNumber(),
      buyer_id: offer.sender_id,
      seller_id: user.id,
      listing_id: offer.listing_id,
      offer_id: offer_id,
      item_price: offer.price_offered ?? new Prisma.Decimal(0),
      transaction_fee: transactionFee,
      total_amount: totalAmount,
      pickup_location: offer.pickup_location,
      pickup_time: offer.pickup_time,
    },
  });
};
