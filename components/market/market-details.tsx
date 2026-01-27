"use client";
import { ListingMedia } from "@/lib/generated/prisma/client";
import { ListingClient } from "@/components/sell/current-listing";
import { ChevronRight, Home, Hospital } from "lucide-react";
import Image from "next/image";
import { formatNumberVN } from "@/components/sell/components/listing-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RelatedImage from "@/components/sell/components/related-image";
import React from "react";
import { getUniveryById } from "@/actions/university";
import { getCategoryById } from "@/actions/category";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createSwapPreference } from "@/actions/swap";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { postingOffer, postingSwapPrefrence } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createOffer } from "@/actions/offer";
import { Input } from "../ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import ViewCounter from "./components/view-count";
export interface MarketDetailProps {
  listingInfo: ListingClient;
  listMedia: ListingMedia[];
}
function MarketDetails({ listingInfo, listMedia }: MarketDetailProps) {
  const [date, setDate] = React.useState<Date>();
  const [isPending, startTransition] = React.useTransition();
  const mainImage = listMedia.find((item) => item.is_main_image);
  const relatedImage = listMedia.filter((item) => !item.is_main_image);
  const [uni_name, setUni_name] = React.useState("");
  const [category, setCategory] = React.useState("");
  const formSwap = useForm<z.infer<typeof postingSwapPrefrence>>({
    resolver: zodResolver(postingSwapPrefrence),
    defaultValues: {
      note: "",
      contact: "",
    },
  });
  const formOffer = useForm<z.infer<typeof postingOffer>>({
    resolver: zodResolver(postingOffer),
    defaultValues: {
      price_offferd: undefined,
      pickup_location: "",
      pickup_time: new Date(),
      note: "",
    },
  });
  React.useEffect(() => {
    getUniveryById(listingInfo.university_id).then((res) => {
      const { university } = res;
      if (!university) {
        return;
      } else {
        setUni_name(university.label);
      }
    });
  }, [listingInfo.university_id]);
  React.useEffect(() => {
    getCategoryById(listingInfo.category_id).then((res) => {
      const { category } = res;
      if (!category) {
        return;
      } else {
        setCategory(category.name);
      }
    });
  }, [listingInfo.category_id]);
  const postOffer = (values: z.infer<typeof postingOffer>) => {
    startTransition(() => {
      createOffer(listingInfo, values).then((res) => {
        const formatted = new Intl.DateTimeFormat("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date());
        if (res.error) {
          toast(res.error, {
            description: `${formatted}`,
          });
        }
        if (res.success) {
          toast(res.success, {
            description: `${formatted}`,
          });
        }
      });
    });
  };
  const postSwap = (values: z.infer<typeof postingSwapPrefrence>) => {
    startTransition(() => {
      createSwapPreference(listingInfo, values).then((res) => {
        const formatted = new Intl.DateTimeFormat("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date());
        if (res.error) {
          toast(res.error, {
            description: `${formatted}`,
          });
        }
        if (res.success) {
          toast(res.success, {
            description: `${formatted}`,
          });
        }
      });
    });
  };
  return (
    <div className="bg-gray-50">
      <ViewCounter listingId={listingInfo.id} />
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto py-3 px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-gray-600 hover:text-emerald-600 transition-colors flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              <span>Trang chủ</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link
              href="/market"
              className="text-gray-600 hover:text-emerald-600 transition-colors flex items-center gap-1"
            >
              <Hospital className="w-4 h-4" />
              <span>Thị Trường</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 truncate">{listingInfo.title}</span>
          </div>
        </div>
      </div>
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row gap-10">
          {/* IMAGE SECTION */}
          {mainImage?.images_url && (
            <div className="w-[95%] mx-auto md:w-1/2 min-h-100 relative bg-white rounded-3xl shadow-xl">
              <Image
                src={mainImage.images_url}
                alt={listingInfo.title}
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow">
                {listingInfo.condition === "new"
                  ? "MỚI"
                  : listingInfo.condition === "like_new"
                    ? "GẦN NHƯ MỚI"
                    : listingInfo.condition === "good"
                      ? "CÒN TỐT"
                      : "SỬ DỤNG ĐƯỢC"}
              </div>
            </div>
          )}

          {/* INFO SECTION */}
          <div className="w-[95%] mx-auto md:w-1/2 flex flex-col gap-6">
            {/* TITLE */}
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-800">
                {listingInfo.title}
              </h1>
              <p className="text-gray-500 text-sm">📍 {listingInfo.location}</p>
            </div>

            {/* PRICE */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                Giá bán
              </p>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-5xl font-black text-emerald-600">
                  {formatNumberVN(listingInfo.price)}
                </span>
                <span className="text-xl font-bold text-emerald-500">VNĐ</span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4">
              {listingInfo.swap_enabled ? (
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      >
                        Đề nghị mua
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Gửi đề nghị mua cho người bán</DialogTitle>
                        <DialogDescription>
                          Bạn cần đưa ra giá mặc cả, địa điểm giao dịch, thời
                          gian cụ thể
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex items-center gap-2">
                        <form
                          onSubmit={formOffer.handleSubmit(postOffer)}
                          className="grid flex-1 gap-2 space-y-6"
                        >
                          <div className="space-y-4">
                            <FieldGroup>
                              <Controller
                                control={formOffer.control}
                                name="price_offferd"
                                render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                      htmlFor="price_offferd"
                                      className="sr-only"
                                    >
                                      Giá đề nghị
                                    </FieldLabel>
                                    <Input
                                      {...field}
                                      id="price_offferd"
                                      aria-invalid={
                                        fieldState.invalid ? "true" : "false"
                                      }
                                      type="number"
                                      disabled={isPending}
                                      autoComplete="off"
                                      placeholder="Giá đề nghị"
                                      onChange={(e) =>
                                        field.onChange(e.target.valueAsNumber)
                                      }
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
                                control={formOffer.control}
                                name="pickup_location"
                                render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                      htmlFor="pickup_location"
                                      className="sr-only"
                                    >
                                      Địa điểm giao dịch
                                    </FieldLabel>
                                    <Input
                                      {...field}
                                      id="pickup_location"
                                      placeholder="Địa điểm giao dịch"
                                      aria-invalid={
                                        fieldState.invalid ? "true" : "false"
                                      }
                                      type="text"
                                      disabled={isPending}
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
                                control={formOffer.control}
                                name="pickup_time"
                                render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                      htmlFor="pickup_time"
                                      className="sr-only"
                                    >
                                      Thời gian
                                    </FieldLabel>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          data-empty={!date}
                                          className="data-[empty=true]:text-muted-foreground w-53 justify-between text-left font-normal"
                                        >
                                          {date ? (
                                            format(date, "PPP")
                                          ) : (
                                            <span>Chọn thời gian</span>
                                          )}
                                          <ChevronDownIcon />
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                      >
                                        <Calendar
                                          {...field}
                                          id="pickup_time"
                                          mode="single"
                                          selected={date}
                                          onSelect={setDate}
                                          defaultMonth={date}
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    {fieldState.invalid && (
                                      <FieldError errors={[fieldState.error]} />
                                    )}
                                  </Field>
                                )}
                              />
                            </FieldGroup>
                            <FieldGroup>
                              <Controller
                                control={formOffer.control}
                                name="note"
                                render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                      htmlFor="note"
                                      className="sr-only"
                                    >
                                      Ghi chú
                                    </FieldLabel>
                                    <Textarea
                                      {...field}
                                      id="note"
                                      aria-invalid={
                                        fieldState.invalid ? "true" : "false"
                                      }
                                      disabled={isPending}
                                      autoComplete="off"
                                      className="min-h-40"
                                      placeholder="Ghi chú khác"
                                    ></Textarea>
                                    {fieldState.invalid && (
                                      <FieldError errors={[fieldState.error]} />
                                    )}
                                  </Field>
                                )}
                              />
                            </FieldGroup>
                            <FieldGroup>
                              <Controller
                                control={formOffer.control}
                                name="contact"
                                render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                      htmlFor="contact"
                                      className="sr-only"
                                    >
                                      Số liên lạc
                                    </FieldLabel>
                                    <Input
                                      {...field}
                                      id="contact"
                                      aria-invalid={
                                        fieldState.invalid ? "true" : "false"
                                      }
                                      type="text"
                                      disabled={isPending}
                                      autoComplete="off"
                                      placeholder="Phương thức liên lạc"
                                    />
                                    {fieldState.invalid && (
                                      <FieldError errors={[fieldState.error]} />
                                    )}
                                  </Field>
                                )}
                              />
                            </FieldGroup>
                          </div>
                          <Button
                            type="submit"
                            className="bg-gradient text-white font-semibold"
                          >
                            Gửi đề nghị
                          </Button>
                        </form>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex-1 bg-linear-to-r from-emerald-500 to-emerald-700 text-white shadow-lg">
                        Đề nghị trao đổi
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>
                          Gửi đề nghị trao đổi cho người bán
                        </DialogTitle>
                        <DialogDescription>
                          Bạn gửi đề nghị trao đổi hàng có cùng giá trị với sản
                          phẩm này
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex items-center gap-2">
                        <form
                          onSubmit={formSwap.handleSubmit(postSwap)}
                          className="grid flex-1 gap-2 space-y-6"
                        >
                          <FieldGroup>
                            <Controller
                              control={formSwap.control}
                              name="note"
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel
                                    htmlFor="note"
                                    className="sr-only"
                                  >
                                    Chi tiết yêu cầu trao đổi
                                  </FieldLabel>
                                  <Textarea
                                    {...field}
                                    id="note"
                                    aria-invalid={
                                      fieldState.invalid ? "true" : "false"
                                    }
                                    disabled={isPending}
                                    autoComplete="off"
                                    className="min-h-40"
                                    placeholder="Mô tả chi tiết trao đổi"
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
                              control={formSwap.control}
                              name="contact"
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel
                                    htmlFor="contact"
                                    className="sr-only"
                                  >
                                    Thông tin liên lạc
                                  </FieldLabel>
                                  <Input
                                    {...field}
                                    id="contact"
                                    type="text"
                                    aria-invalid={
                                      fieldState.invalid ? "true" : "false"
                                    }
                                    disabled={isPending}
                                    autoComplete="off"
                                    placeholder="Số liên lạc"
                                  />
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />
                          </FieldGroup>
                          <Button
                            type="submit"
                            className="bg-gradient text-white font-semibold"
                          >
                            Gửi đề nghị
                          </Button>
                        </form>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    >
                      Đề nghị mua
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Gửi đề nghị mua cho người bán</DialogTitle>
                      <DialogDescription>
                        Bạn cần đưa ra giá mặc cả, địa điểm giao dịch, thời gian
                        cụ thể
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2">
                      <form
                        onSubmit={formOffer.handleSubmit(postOffer)}
                        className="grid flex-1 gap-2 space-y-6"
                      >
                        <div className="space-y-4">
                          <FieldGroup>
                            <Controller
                              control={formOffer.control}
                              name="price_offferd"
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel
                                    htmlFor="price_offferd"
                                    className="sr-only"
                                  >
                                    Giá đề nghị
                                  </FieldLabel>
                                  <Input
                                    {...field}
                                    id="price_offferd"
                                    aria-invalid={
                                      fieldState.invalid ? "true" : "false"
                                    }
                                    type="number"
                                    disabled={isPending}
                                    autoComplete="off"
                                    placeholder="Giá đề nghị"
                                    onChange={(e) =>
                                      field.onChange(e.target.valueAsNumber)
                                    }
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
                              control={formOffer.control}
                              name="pickup_location"
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel
                                    htmlFor="pickup_location"
                                    className="sr-only"
                                  >
                                    Địa điểm giao dịch
                                  </FieldLabel>
                                  <Input
                                    {...field}
                                    id="pickup_location"
                                    placeholder="Địa điểm giao dịch"
                                    aria-invalid={
                                      fieldState.invalid ? "true" : "false"
                                    }
                                    type="text"
                                    disabled={isPending}
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
                              control={formOffer.control}
                              name="pickup_time"
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel
                                    htmlFor="pickup_time"
                                    className="sr-only"
                                  >
                                    Thời gian
                                  </FieldLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        data-empty={!date}
                                        className="data-[empty=true]:text-muted-foreground w-53 justify-between text-left font-normal"
                                      >
                                        {date ? (
                                          format(date, "PPP")
                                        ) : (
                                          <span>Chọn thời gian</span>
                                        )}
                                        <ChevronDownIcon />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <Calendar
                                        {...field}
                                        id="pickup_time"
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        defaultMonth={date}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />
                          </FieldGroup>
                          <FieldGroup>
                            <Controller
                              control={formSwap.control}
                              name="note"
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel
                                    htmlFor="note"
                                    className="sr-only"
                                  >
                                    Ghi chú
                                  </FieldLabel>
                                  <Textarea
                                    {...field}
                                    id="note"
                                    aria-invalid={
                                      fieldState.invalid ? "true" : "false"
                                    }
                                    disabled={isPending}
                                    autoComplete="off"
                                    className="min-h-40"
                                    placeholder="Ghi chú khác"
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
                              control={formOffer.control}
                              name="contact"
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel
                                    htmlFor="contact"
                                    className="sr-only"
                                  >
                                    Số liên lạc
                                  </FieldLabel>
                                  <Input
                                    {...field}
                                    id="contact"
                                    aria-invalid={
                                      fieldState.invalid ? "true" : "false"
                                    }
                                    type="text"
                                    disabled={isPending}
                                    autoComplete="off"
                                    placeholder="Phương thức liên lạc"
                                  />
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />
                          </FieldGroup>
                        </div>
                        <Button
                          type="submit"
                          className="bg-gradient text-white font-semibold"
                        >
                          Gửi đề nghị
                        </Button>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* META INFO */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <InfoItem label="Tình trạng" value={listingInfo.condition} />
              <InfoItem label="Trạng thái" value={listingInfo.status} />
              <InfoItem
                label="Lượt xem"
                value={listingInfo.view_count.toString()}
              />
              <InfoItem
                label="Yêu thích"
                value={listingInfo.favorite_count.toString()}
              />
              <InfoItem
                label="Ngày đăng"
                value={listingInfo.published_at ?? "Chưa đăng"}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-2">Mô tả sản phẩm</h3>
              <p className="text-gray-600 leading-relaxed">
                {listingInfo.description}
              </p>
            </div>

            {/* FOOTER INFO */}
            <div className="flex flex-col gap-3 text-sm bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <FooterItem icon="🏫" text={`Trường: ${uni_name}`} />
              <FooterItem icon="🗂️" text={`Danh mục: ${category}`} />
            </div>
          </div>
        </div>
        <RelatedImage listRelatedImage={relatedImage} />
      </div>
    </div>
  );
}

export default MarketDetails;
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800 mt-1">{value}</p>
    </div>
  );
}

function FooterItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3 text-gray-700">
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{text}</span>
    </div>
  );
}
