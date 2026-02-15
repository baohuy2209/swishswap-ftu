"use server";
import prisma from "@/lib/db/prisma";
import { createClient } from "@/lib/supabase/server";
import { userProfileSchema } from "@/schemas";
import z from "zod";
import { getCurrentSession } from "./auth";
import { toSafeUserWithExtras } from "@/lib/utils";
import { getMainImageByListingId } from "./listings";

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
  if (!user) {
    return { safeUser: null };
  }
  const safeUser = {
    ...user,
    password_hash: undefined,
  };
  return { safeUser };
};

export const getSellerById = async (user_id: string | undefined) => {
  if (!user_id) {
    return { user: null };
  }
  const user = await prisma.user.findUnique({
    where: {
      id: user_id,
    },
    include: {
      listings: true,
      received_reviews: true,
    },
  });
  if (!user) return { user: null };
  const safeListings = (
    await Promise.all(
      user.listings.map(async (item) => {
        const { listingMedia } = await getMainImageByListingId(item.id);

        if (!listingMedia) return null;

        return {
          ...item,
          image_url: listingMedia.images_url,
          price: item.price.toNumber(),
          created_at: item.created_at.toISOString(),
          updated_at: item.updated_at.toISOString(),
          published_at: item.published_at?.toISOString() ?? null,
          reserved_at: item.reserved_at?.toISOString() ?? null,
          completed_at: item.completed_at?.toISOString() ?? null,
        };
      }),
    )
  ).filter(Boolean);
  return {
    user: toSafeUserWithExtras({
      ...user,
      listings: safeListings,
    }),
  };
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
