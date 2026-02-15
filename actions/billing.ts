"use server";

import prisma from "@/lib/db/prisma";
import { getCurrentSession } from "@/actions/auth";
import { getOrderByOfferId } from "@/actions/order";

export async function createBillingForTypeBuySell(offer_id: string) {
  const order = await getOrderByOfferId(offer_id);
  const { user } = await getCurrentSession();
  if (!order) {
    return { error: "Lỗi khi load thông tin các loại sản phẩm" };
  }
  await prisma.billing.create({
    data: {
      user_id: user?.id!,
      order_id: order?.id,
      amount: order?.transaction_fee!,
      fee_type: "buy_sell",
    },
  });
}

export async function createBillingForTypeExchange(offer_id: string) {
  const order = await getOrderByOfferId(offer_id);
  const { user } = await getCurrentSession();
  if (!order) {
    return { error: "Lỗi khi load thông tin các loại sản phẩm" };
  }
  await prisma.billing.create({
    data: {
      user_id: user?.id!,
      order_id: order?.id,
      amount: order?.transaction_fee!,
      fee_type: "exchange",
    },
  });
  return { success: "đã tạo billing" };
}

export async function getCurrentUserBilling() {
  const { user } = await getCurrentSession();
  const listBillings = await prisma.billing.findMany({
    where: {
      user_id: user?.id,
    },
  });
  return listBillings;
}
