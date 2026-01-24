"use server";

import prisma from "@/lib/db/prisma";
export const getAllCategory = async () => {
  try {
    const category = await prisma.category.findMany();
    return {
      success: "Load dữ liệu thành công",
      categories: category,
    };
  } catch (e) {
    console.log(e instanceof Error ? `${e.message}` : "");
    return {
      error: "Lỗi khi load thông tin các loại sản phẩm ",
      categories: null,
    };
  }
};
export const getCategoryByName = async (name: string) => {
  try {
    const category = await prisma.category.findUnique({
      where: {
        name: name,
      },
    });
    return {
      success: "Load thành công",
      category,
    };
  } catch (e) {
    console.log(e instanceof Error ? `${e.message}` : "");
    return {
      error: "Lỗi khi load thông tin các loại sản phẩm ",
      category: null,
    };
  }
};

export const getCategoryBySlug = async (slug: string) => {
  try {
    const category = await prisma.category.findUnique({
      where: {
        slug: slug,
      },
    });
    return {
      success: "Load thành công",
      category,
    };
  } catch (e) {
    console.log(e instanceof Error ? `${e.message}` : "");
    return {
      error: "Lỗi khi load thông tin các loại sản phẩm ",
      category: null,
    };
  }
};
export const getValueCategories = async () => {
  try {
    const listCategories = await getAllCategory();
    if (listCategories.error && !listCategories.categories) {
      return {
        error: "Lỗi khi load thông tin các loại sản phẩm ",
        categories: null,
      };
    } else {
      const categories: Record<string, string[]> = {};
      listCategories.categories?.forEach((category) => {
        if (!categories[category.group]) {
          categories[category.group] = [];
        }
        categories[category.group].push(category.name);
      });
      return {
        success: "Load dữ liệu thành công",
        categories,
      };
    }
  } catch (e) {
    console.log(e instanceof Error ? `${e.message}` : "");
    return {
      error: "Lỗi khi load thông tin các loại sản phẩm ",
      categories: null,
    };
  }
};
