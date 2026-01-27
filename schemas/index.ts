import * as z from "zod";
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Hãy nhập địa chỉ email",
  }),
  password: z.string().min(1, {
    message: "Hãy nhập password",
  }),
});
export const RegisterSchema = z
  .object({
    email: z.email({
      message: "Hãy nhập email",
    }),
    password: z.string().min(6, {
      message: "Password có ít nhất 6 kí tự",
    }),
    confirmPassword: z.string().min(1, {
      message: "Hãy xác nhận mật khẩu",
    }),
    name: z.string().min(1, {
      message: "Hãy nhập họ và tên",
    }),
    university_name: z.string().min(1, {
      message: "Hãy chọn trường đại học",
    }),
    phone: z.string().min(10, {
      message: "Hãy nhập số điện thoại",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Xác nhận password không thành công",
  });
export const evindenceFileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, {
    message: "Vui lòng chọn ảnh",
  })
  .refine((file) => file.size <= 10 * 1024 * 1024, {
    message: "Kích thước ảnh không được vượt quá 10MB",
  })
  .refine(
    (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
    {
      message: "Chỉ chấp nhận định dạng ảnh JPEG, PNG hoặc JPG",
    },
  );
export const evindenceFormSchema = z.object({
  evindenceFile: evindenceFileSchema,
});

export const createListingSchema = z.object({
  title: z.string({
    message: "Hãy nhập tên sản phẩm và chú thích liên quan",
  }),
  description: z
    .string({
      message: "Hãy nhập mô tả sản phẩm",
    })
    .min(20, {
      message: "Hãy nhập ít nhất 20 kí tự mô tả sản phẩm để đăng bán",
    }),
  condition: z.enum(["new", "like_new", "good", "fair"]),
  price: z.number().min(1, "Hãy nhập giá sản phẩm"),
  location: z.string({
    message: "Hãy nhập địa chỉ có thể trao đổi hàng",
  }),
  swap_enable: z.boolean(),
  category: z.string({
    message: "Hãy chọn loại sản phẩm",
  }),
  image_360: z
    .array(evindenceFileSchema)
    .min(3, "Phải tải lên ít nhất 3 ảnh")
    .max(10, "Chỉ được tải tối đa 10 ảnh"),
});
export const postingSwapPrefrence = z.object({
  note: z.string().min(40, {
    message: "Bạn cần nhập chi tiết điều kiện trao đổi",
  }),
  contact: z.string().min(1, {
    message: "Bạn cần nhập thông tin liên lạc",
  }),
});
export const postingOffer = z.object({
  price_offferd: z.number().min(1, "Hây nhập giá đề nghị của bạn"),
  pickup_location: z.string().min(1, "Hãy nhập chi tiết địa điểm để nhận hàng"),
  pickup_time: z.date({
    message: "Hãy chọn thời gian trao đổi cụ thể",
  }),
  note: z.string(),
  contact: z.string(),
});
