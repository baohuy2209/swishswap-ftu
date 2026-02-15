"use server";
import z, { array } from "zod";
import prisma from "@/lib/db/prisma";
import { createClient } from "@/lib/supabase/server";
import { createListingSchema } from "@/schemas";
import { getCurrentSession } from "@/actions/auth";
import { getCategoryByName } from "@/actions/category";
import { getUniveryById } from "@/actions/university";

// Xử lí uplaod
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
// Xử lí đăng sản phẩm
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
// Lấy Ảnh chính bằng listing_id
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
// Lấy thông tin các listing của user
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
// Lấy thông tin chi tiết listing bằng id bao gồm cả các hình ảnh
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
// Load các listing của người dùng khác
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
        status: "available",
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
export async function getSellerListing(seller_id: string) {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return {
        sellerListings: null,
        error: "Bạn chưa đăng nhập",
      };
    }
    const sellerListings = await prisma.listing.findMany({
      where: {
        seller_id: seller_id,
      },
    });
    return {
      sellerListings,
    };
  } catch (e) {
    console.log(e);
    return {
      sellerListings: null,
      error: "Lỗi khi lấy dữ liệu",
    };
  }
}
// Lấy thông tin của các listing trừ hình ảnh
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
// Lấy thông tin tổng quan người bán của các listing
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
    rating_count: user?.rating_count,
    seller_id: user.id,
  };
}
// Chuyển trạng thái của listing là đăng bán - có status là available
export async function updateAvailableStateForListing(listing_id: string) {
  try {
    await prisma.listing.update({
      where: {
        id: listing_id,
      },
      data: {
        status: "available",
        published_at: new Date(),
      },
    });
    return {
      success: "Đăng bán sản phẩm thành công",
    };
  } catch (e) {
    console.log(e);
    return {
      error: "Có lỗi khi đăng bán sản phẩm",
    };
  }
}
// Chuyển trạng thái của listing là đăng bán - có status là reserved
export async function updateReservedForListing(listing_id: string) {
  try {
    await prisma.listing.update({
      where: {
        id: listing_id,
      },
      data: {
        status: "reserved",
        reserved_at: new Date(),
      },
    });
    return {
      success: "Giao dịch với người mua thành công",
    };
  } catch (e) {
    console.log(e);
    return {
      error: "Có lỗi khi giao dịch",
    };
  }
}
// Chuyển trạng thái của listing là đăng bán - có status là reserved
export async function updateCompleteForListing(listing_id: string) {
  try {
    await prisma.listing.update({
      where: {
        id: listing_id,
      },
      data: {
        status: "completed",
        completed_at: new Date(),
      },
    });
    return {
      success: "Hoàn tất bán sản phẩm",
    };
  } catch (e) {
    console.log(e);
    return {
      error: "Có lỗi từ cơ sở dữ liệu",
    };
  }
}
export async function increaseHeart(listing_id: string) {
  try {
    await prisma.listing.update({
      where: { id: listing_id },
      data: {
        favorite_count: {
          increment: 1,
        },
      },
    });
  } catch (e) {
    console.log(e);
    return { error: "Có lỗi phía server" };
  }
}
export async function increaseViews(listing_id: string) {
  try {
    await prisma.listing.update({
      where: { id: listing_id },
      data: {
        view_count: {
          increment: 1,
        },
      },
    });
  } catch (e) {
    console.log(e);
    return { error: "Có lỗi phía server" };
  }
}
export async function get3TopsListing() {
  try {
    const topListings = await prisma.listing.findMany({
      orderBy: {
        view_count: "desc",
      },
      take: 3,
      where: {
        status: "available",
      },
    });
    return { topListings };
  } catch (e) {
    console.error(e);
    return { error: "Lỗi khi lấy dữ liệu" };
  }
}

export async function getArrayListingIdFromUser() {
  const { userListings } = await getUserCurrentListings();
  if (!userListings) {
    return [];
  }
  const ArrayListingId = userListings.map((item) => item.id);
  return ArrayListingId;
}
export async function getTitleByListingId(listing_id: string) {
  const currentListing = await prisma.listing.findUnique({
    where: {
      id: listing_id,
    },
  });
  return currentListing?.title;
}
export async function getListTitle(lists_id: string[]) {
  const listTitle: string[] = [];
  const length_array = lists_id.length;
  for (let i = 0; i < length_array; i++) {
    const title = await getTitleByListingId(lists_id[i]);
    if (!title) continue;
    listTitle.push(title);
  }
  return listTitle;
}
export async function getListHasSameUniversity() {
  const { user } = await getCurrentSession();
  const userUniversity = user?.university_id;
  const listing_from_same_university = await prisma.listing.findMany({
    where: {
      university_id: userUniversity,
      NOT: {
        seller_id: user?.id,
      },
    },
  });
  return listing_from_same_university;
}
export async function getListingSameCategoryById(id: string) {
  try {
    const listingDetail = await getListingsById(id);
    const { user } = await getCurrentSession();
    if (!user) {
      return {
        listingsSameCategory: null,
      };
    }
    const listingsSameCategory = await prisma.listing.findMany({
      where: {
        seller_id: {
          not: user.id,
        },
        status: "available",
        category_id: listingDetail.listingInfo?.category_id,
      },
    });
    return {
      listingsSameCategory,
    };
  } catch (e) {
    console.log(e);
    return {
      listingsSameCategory: null,
    };
  }
}
