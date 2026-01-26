"use server";
import z from "zod";
import prisma from "@/lib/db/prisma";
import { createClient } from "@/lib/supabase/server";
import { createListingSchema } from "@/schemas";
import { getCurrentSession } from "./auth";
import { getCategoryByName } from "./category";
import { getUniveryById } from "./university";
export const uploadImageProduct = async (file: File) => {
  const fileExt = file.name.split(".").pop();
  const filePath = `image-listings/${crypto.randomUUID()}.${fileExt}`;
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
export const postProduct = async (
  values: z.infer<typeof createListingSchema>,
) => {
  const validatedFields = createListingSchema.parse(values);
  const {
    title,
    description,
    condition,
    price,
    location,
    swap_enable,
    category,
    image_360,
  } = validatedFields;
  const { session, user } = await getCurrentSession();
  const categoryEntity = await getCategoryByName(category);
  if (!categoryEntity.category) {
    return {
      error: "Lỗi khi lấy thông tin loại sản phẩm",
    };
  }
  if (!session || !user) {
    return {
      error: "Hãy đăng nhập để thực hiện đăng bán đồ cũ",
    };
  }
  try {
    const new_list = await prisma.listing.create({
      data: {
        seller_id: user.id,
        university_id: user.university_id,
        category_id: categoryEntity.category.id,
        title,
        description,
        condition,
        price,
        location,
        swap_enabled: swap_enable,
      },
    });
    image_360.forEach(async (image_file, index) => {
      const current_image_url = await uploadImageProduct(image_file);
      if (!current_image_url.url) {
        return {
          error: current_image_url.error,
        };
      }
      if (index === 0) {
        await prisma.listingMedia.create({
          data: {
            listing_id: new_list.id,
            images_url: current_image_url.url,
            is_main_image: true,
          },
        });
      } else {
        await prisma.listingMedia.create({
          data: {
            listing_id: new_list.id,
            images_url: current_image_url.url,
          },
        });
      }
    });
    return { success: `Đã đăng thành công ${new_list.title}` };
  } catch (e) {
    console.log(e);
    return {
      error: "Đăng sản phẩm thất bại",
    };
  }
};
export const getMainImageByListingId = async (id: string) => {
  try {
    const listingMedia = await prisma.listingMedia.findFirst({
      where: {
        listing_id: id,
        is_main_image: true,
      },
    });
    return {
      success: "Lấy dữ liệu thành công",
      listingMedia,
    };
  } catch (e) {
    console.log(e);
    return { error: "Lỗi khi lấy hình ảnh sản phẩm" };
  }
};
export const getUserCurrentListings = async () => {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return {
        userListings: null,
        error: "Bạn chưa đăng nhập",
      };
    }
    const userListings = await prisma.listing.findMany({
      where: {
        seller_id: user.id,
      },
    });
    return {
      userListings,
    };
  } catch (e) {
    console.log(e);
    return {
      userListings: null,
      error: "Lỗi khi lấy dữ liệu",
    };
  }
};

export async function getDetailListingsById(id: string) {
  const listingInfo = await prisma.listing.findUnique({
    where: {
      id: id,
    },
  });
  const listMedia = await prisma.listingMedia.findMany({
    where: {
      listing_id: id,
    },
  });
  return {
    listingInfo,
    listMedia,
  };
}

export async function getMarketList() {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return {
        userListings: null,
        error: "Bạn chưa đăng nhập",
      };
    }
    const userListings = await prisma.listing.findMany({
      where: {
        seller_id: {
          not: user.id,
        },
      },
    });
    return {
      userListings,
    };
  } catch (e) {
    console.log(e);
    return {
      userListings: null,
      error: "Lỗi khi lấy dữ liệu",
    };
  }
}
export async function getListingsById(id: string) {
  const listingInfo = await prisma.listing.findUnique({
    where: {
      id: id,
    },
  });
  return {
    listingInfo,
  };
}

export async function getSellerInfoByListingId(listing_id: string) {
  const { listingInfo } = await getListingsById(listing_id);
  if (!listingInfo) {
    return {
      error: "Lỗi khi lấy thông tin lên",
    };
  }
  const user = await prisma.user.findUnique({
    where: {
      id: listingInfo.seller_id,
    },
  });
  if (!user?.university_id) {
    return {
      error: "Không lấy được thông tin của trường đại học",
    };
  }
  const { university } = await getUniveryById(user?.university_id);

  return {
    author: user?.name,
    avatar: user?.avatar_url,
    university_name: university?.label,
  };
}
