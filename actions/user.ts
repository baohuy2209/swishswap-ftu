"use server";
import prisma from "@/lib/db/prisma";
import { createClient } from "@/lib/supabase/server";
import { userProfileSchema } from "@/schemas";
import z from "zod";
import { getCurrentSession } from "./auth";
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
export const getUserById = async (user_id: string | undefined) => {
  if (!user_id) {
    return { error: "Không load được tên người dùng" };
  }
  const user = await prisma.user.findUnique({
    where: {
      id: user_id,
    },
  });
  const safeUser = {
    ...user,
    password_hash: undefined,
  };
  return { safeUser };
};
export const uploadImageAvartar = async (file: File) => {
  const fileExt = file.name.split(".").pop();
  const filePath = `user-profile/${crypto.randomUUID()}.${fileExt}`;
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("proof-student")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });
  if (error) {
    return {
      error: "Xảy ra lỗi khi tải ảnh lên Supabase: " + error.message,
      url: null,
    };
  }
  const { data: publicUrl } = supabase.storage
    .from("proof-student")
    .getPublicUrl(data.path);
  return { url: publicUrl.publicUrl };
};
export const updateUserProfile = async (
  values: z.infer<typeof userProfileSchema>,
) => {
  const validatedFields = userProfileSchema.parse(values);
  const { name, email, university_name, phone, location, avatar } =
    validatedFields;
  const { user } = await getCurrentSession();
  const avatar_image_url = await uploadImageAvartar(avatar);
  if (!avatar_image_url.url) {
    return {
      error: avatar_image_url.error,
    };
  }
  await prisma.user.update({
    where: {
      id: user?.id,
    },
    data: {
      name: name,
      email: email,
      university_name: university_name,
      phone: phone,
      location: location,
      avatar_url: avatar_image_url.url,
    },
  });
  return { success: "Cập nhật thông tin thành công" };
};
