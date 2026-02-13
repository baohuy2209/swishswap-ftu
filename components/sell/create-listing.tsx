"use client";
import { createListingSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getValueCategories } from "@/actions/category";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { Button } from "../ui/button";
import { postProduct } from "@/actions/listings";
import { toast } from "sonner";
export const LISTING_CONDITION_OPTIONS = [
  { value: "new", label: "Mới 100%" },
  { value: "like_new", label: "Như mới" },
  { value: "good", label: "Còn tốt" },
  { value: "fair", label: "Đã qua sử dụng" },
] as const;
function CreateListings() {
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const [categories, setCatagories] = React.useState<Record<
    string,
    string[]
  > | null>();
  const form = useForm<z.infer<typeof createListingSchema>>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      title: "",
      description: "",
      condition: "new",
      price: undefined,
      location: "",
      swap_enable: true,
      category: "",
      image_360: [],
    },
  });
  const onSubmit = (values: z.infer<typeof createListingSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      postProduct(values)
        .then((res) => {
          if (res.error) {
            setError(res.error);
          }
          if (res.success) {
            setSuccess(res.success);
            const formatted = new Intl.DateTimeFormat("vi-VN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }).format(new Date());
            toast("Đã tạo sản phẩm thành công", {
              description: `${formatted}`,
            });
            form.reset();
          }
        })
        .catch();
    });
  };
  React.useEffect(() => {
    getValueCategories()
      .then((res) => {
        if (res.error) {
          setError(res.error);
        }
        const { categories } = res;
        setCatagories(categories);
      })
      .catch((e) => {
        console.log(e);
        setError("Lỗi khi load data từ cơ sở dữ liệu");
      });
  }, []);
  return (
    <div className="w-[95%] md:w-[85%] mx-auto">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row mb-3 justify-content-center items-center">
            <FieldGroup>
              <Controller
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="title">Nhập tên sản phẩm</FieldLabel>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Điện thoại Iphone X Xs"
                      type="text"
                      id="title"
                      aria-invalid={fieldState.invalid ? "true" : "false"}
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                control={form.control}
                name="category"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel htmlFor="university_name">
                        Loại sản phẩm
                      </FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="university_name"
                          aria-invalid={fieldState.invalid}
                          className="w-full"
                        >
                          <SelectValue placeholder="Please select your university" />
                        </SelectTrigger>
                        <SelectContent
                          position="item-aligned"
                          className="min-w-40"
                        >
                          {Object.entries(categories || {}).length > 0 ? (
                            Object.entries(categories || {}).map(
                              ([group, items]) => (
                                <SelectGroup key={group}>
                                  <SelectLabel>{group}</SelectLabel>
                                  {items.map((item, index) => (
                                    <SelectItem key={index} value={item}>
                                      {item}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              ),
                            )
                          ) : (
                            <SelectItem value="no data">No Data</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
          <div className="mb-3">
            <FieldGroup>
              <Controller
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description">
                      Mô tả sản phẩm
                    </FieldLabel>
                    <FieldDescription>
                      Hãy điền mô tả sơ lược về sản phẩm. Lưu ý: mô tả càng chi
                      tiết thì càng tăng lỷ lệ có người mua càng tăng
                    </FieldDescription>
                    <Textarea
                      id="description"
                      {...field}
                      disabled={isPending}
                      placeholder="Mô tả sản phẩm"
                      aria-invalid={fieldState.invalid ? "true" : "false"}
                      autoComplete="off"
                      className="min-h-72"
                    ></Textarea>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row mb-3">
            <FieldGroup>
              <Controller
                control={form.control}
                name="price"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="price">Giá</FieldLabel>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="20000"
                      type="number"
                      id="price"
                      aria-invalid={fieldState.invalid ? "true" : "false"}
                      autoComplete="off"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                control={form.control}
                name="location"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="location">Địa điểm</FieldLabel>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="e.g Trường Đại học ...; đường Xô Viết Nghệ Tĩnh, Bình Thạnh"
                      type="text"
                      id="location"
                      aria-invalid={fieldState.invalid ? "true" : "false"}
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
          <div className="flex flex-col gap-4 md:flex-row mb-3">
            <FieldGroup>
              <Controller
                control={form.control}
                name="condition"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="condition">
                      Tình trạng sản phẩm
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="condition"
                        aria-invalid={fieldState.invalid}
                        className="w-full"
                      >
                        <SelectValue placeholder="Tình trạng sản phẩm" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {LISTING_CONDITION_OPTIONS.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                control={form.control}
                name="swap_enable"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="swap_enable">
                      Có thể trao đổi?
                    </FieldLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
          <div className="mb-3">
            <FieldGroup>
              <Controller
                control={form.control}
                name="image_360"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="image_360">
                      Tải các ảnh minh họa
                    </FieldLabel>
                    <FieldDescription>
                      Hãy tải các ảnh sản phẩm (tối thiểu ít nhất 4)
                    </FieldDescription>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;

                        field.onChange(Array.from(files));
                      }}
                      disabled={isPending}
                      id="image_360"
                      aria-invalid={fieldState.invalid ? "true" : "false"}
                      autoComplete="off"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button
          type="submit"
          className="w-full bg-gradient text-white"
          disabled={isPending}
        >
          Đăng sản phẩm
        </Button>
      </form>
    </div>
  );
}

export default CreateListings;
