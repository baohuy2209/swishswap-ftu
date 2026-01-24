"use server";

import prisma from "@/lib/db/prisma";

export const getAllUniversity = async () => {
  try {
    const universities = await prisma.university.findMany();
    return {
      success: "Load thành công các thông tin trường đại đại",
      universities,
    };
  } catch (e) {
    console.log(e instanceof Error ? `${e.message}` : "");
    return {
      error: "Lỗi khi load thông tin các trường đại học ",
      universities: null,
    };
  }
};
export const getUniveryIdByValue = async (value: string) => {
  try {
    const universityId = await prisma.university.findUnique({
      where: {
        value: value,
      },
    });
    return {
      success: "Load thành công",
      universityId,
    };
  } catch (e) {
    console.log(e instanceof Error ? `${e.message}` : "");
    return {
      error: "Lỗi khi load dữ liệu từ database",
      universityId: null,
    };
  }
};
