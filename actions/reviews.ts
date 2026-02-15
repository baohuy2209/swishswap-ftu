"use server";

import prisma from "@/lib/db/prisma";
import { updateCompletedOrders } from "./order";
import { Prisma } from "@/lib/generated/prisma/client";

export async function createReview({
  rating,
  comment,
  order_id,
  receiver_id,
}: {
  rating: string;
  comment: string;
  order_id: string;
  receiver_id: string;
}) {
  try {
    await prisma.review.create({
      data: {
        order_id: order_id,
        receiver_id: receiver_id,
        rating: Number(rating),
        comment: comment,
      },
    });
    await updateCompletedOrders(order_id);
    const userReceiver = await prisma.user.findUnique({
      where: {
        id: receiver_id,
      },
      select: {
        review_count: true,
        rating_count: true,
      },
    });
    const newCount = userReceiver?.rating_count! + 1;
    const newRatingCount =
      userReceiver?.review_count! !== 0
        ? (userReceiver?.review_count! * userReceiver?.rating_count! +
            Number(rating)) /
          newCount
        : (userReceiver?.rating_count! + Number(rating)) / newCount;

    await prisma.user.update({
      where: {
        id: receiver_id,
      },
      data: {
        review_count: {
          increment: 1,
        },
        rating_count: newRatingCount,
      },
    });
    return { succes: "Đã đánh giá thành công" };
  } catch (e) {
    return { error: `Message: ${e}` };
  }
}

export async function getSellerReview(seller_id: string) {
  const seller_reviews = await prisma.review.findMany({
    where: {
      receiver_id: seller_id,
    },
    select: {
      rating: true,
      comment: true,
    },
  });
  return seller_reviews;
}
