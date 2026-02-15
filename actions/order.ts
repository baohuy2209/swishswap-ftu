"use server";
import prisma from "@/lib/db/prisma";
import { getCurrentSession } from "@/actions/auth";
import { getOfferById } from "./offer";
import { Prisma, User } from "@/lib/generated/prisma/client";
import { generateOrderNumber } from "@/lib/utils";
import { getSwapById } from "./swap";
import { getListingsById, getMainImageByListingId } from "./listings";
import { getNameUserById } from "./user";

export const createOrderFromOffer = async (offer_id: string) => {
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
export const createOrderFromSwap = async (swap_id: string) => {
  const { user } = await getCurrentSession();
  const { swapReference } = await getSwapById(swap_id);
  if (!user) {
    return {
      error: "Cần đăng nhập để thực hiện thao tác này",
    };
  }
  if (!swapReference) {
    return {
      error: "Lỗi khi load offer",
    };
  }
  const { listingInfo } = await getListingsById(swapReference.listing_id);
  const transactionFee = listingInfo?.price
    ? listingInfo?.price.mul(0.05)
    : new Prisma.Decimal(0);
  const totalAmount = listingInfo?.price
    ? listingInfo?.price.add(transactionFee)
    : new Prisma.Decimal(0);
  await prisma.order.create({
    data: {
      order_number: generateOrderNumber(),
      buyer_id: swapReference.sender_id,
      seller_id: user.id,
      listing_id: swapReference.listing_id,
      offer_id: swapReference.id,
      item_price: listingInfo?.price ?? new Prisma.Decimal(0),
      transaction_fee: transactionFee,
      total_amount: totalAmount,
      pickup_location: swapReference.pickup_location,
      pickup_time: swapReference.pickup_time,
    },
  });
};
export const updateCompletedOrders = async (order_id: string) => {
  await prisma.order.update({
    where: {
      id: order_id,
    },
    data: {
      completed_at: new Date(),
      seller_cash_confirmed: true,
      pickup_confirmed_at: new Date(),
    },
  });
};

export const updateCancelledOrders = async (offer_id: string) => {
  await prisma.order.update({
    where: {
      offer_id: offer_id,
    },
    data: {
      cancelled_at: new Date(),
    },
  });
};

export const getOrderByOfferId = async (offer_id: string) => {
  const order = await prisma.order.findUnique({
    where: {
      offer_id: offer_id,
    },
  });
  return order;
};

export const getOrdersByUserID = async (
  user: Omit<User, "password_hash"> | null,
) => {
  const listOrders = await prisma.order.findMany({
    where: {
      buyer_id: user?.id,
      completed_at: null,
    },
  });
  return listOrders;
};
export const getInfoToReview = async (
  user: Omit<User, "password_hash"> | null,
) => {
  const listOrders = await getOrdersByUserID(user);
  let listInfoReview = [];
  for (var item of listOrders) {
    const { listingMedia } = await getMainImageByListingId(item.listing_id);
    const { listingInfo } = await getListingsById(item.listing_id);
    const nameSeller = await getNameUserById(item.seller_id);
    const infoReview = {
      order_id: item.id,
      receiver_id: item.seller_id,
      image: listingMedia?.images_url,
      name: listingInfo?.title,
      description: listingInfo?.description,
      price: listingInfo?.price.toNumber(),
      seller: nameSeller,
    };
    listInfoReview.push(infoReview);
  }
  return listInfoReview;
};
