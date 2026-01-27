"use server";
import prisma from "@/lib/db/prisma";
export const getNameUserById = async (user_id: string | undefined) => {
  if (!user_id) {
    return "Không load được tên người dùng";
  }
  const user = await prisma.user.findUnique({
    where: {
      id: user_id,
    },
  });
  return user?.name;
};
