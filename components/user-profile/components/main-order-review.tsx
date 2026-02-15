"use client";
import { createReview } from "@/actions/reviews";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { formatNumberVN } from "@/components/market/components/marketing-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { reviewSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { BanknoteArrowDown } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
export interface MainOrderReviewProps {
  listInfoReview: {
    order_id: string | undefined;
    receiver_id: string | undefined;
    image: string | undefined;
    name: string | undefined;
    description: string | undefined;
    price: number | undefined;
    seller: string | undefined;
  }[];
}
function MainOrderReview({ listInfoReview }: MainOrderReviewProps) {
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: "",
      comment: "",
    },
  });
  const onSubmit = (
    values: z.infer<typeof reviewSchema>,
    orderId: string,
    receiverId: string,
  ) => {
    startTransition(() => {
      createReview({
        ...values,
        order_id: orderId,
        receiver_id: receiverId,
      }).then((res) => {
        if (res.error) {
          setError(res.error);
        }
        if (res.succes) {
          setSuccess(res.succes);
        }
      });
    });
  };
  return (
    <div className="py-4">
      {listInfoReview.length === 0 ? (
        <div className="text-gray-800"> Chưa có đơn hàng</div>
      ) : (
        <>
          {listInfoReview.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 flex flex-col md:flex-row gap-3"
            >
              <div className="-shrink-0">
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-linear-to-br from-teal-500 to-emerald-600">
                  {item.image && (
                    <Image
                      src={item?.image!}
                      alt={item?.name!}
                      className="object-cover"
                      fill
                    />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <div className="flex flex-row gap-2 items-start justify-center">
                    <span>Người bán: </span>
                    <Badge variant="outline" className="rounded-xl">
                      {item.seller}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <BanknoteArrowDown className="h-3 w-3" />
                    {formatNumberVN(item?.price!)} VNĐ
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="rounded-xl">
                      Đánh giá
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Gửi đánh giá cho người bán</DialogTitle>
                      <DialogDescription>
                        Đánh giá về người bán để tạo uy tín trên thị trường
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2">
                      <form
                        onSubmit={form.handleSubmit((values) => {
                          if (!item.order_id || !item.receiver_id) return;

                          onSubmit(values, item.order_id, item.receiver_id);
                        })}
                        className="grid flex-1 gap-2 space-y-6"
                      >
                        <div className="space-y-4">
                          <FieldGroup>
                            <Controller
                              control={form.control}
                              name="rating"
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel htmlFor="rating">
                                    Số sao
                                  </FieldLabel>

                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <SelectTrigger
                                      id="rating"
                                      //   aria-invalid={fieldState.invalid}
                                      className="w-full"
                                    >
                                      <SelectValue placeholder="Chọn số sao" />
                                    </SelectTrigger>

                                    <SelectContent className="min-w-40">
                                      <SelectItem value="1">1 sao</SelectItem>
                                      <SelectItem value="2">2 sao</SelectItem>
                                      <SelectItem value="3">3 sao</SelectItem>
                                      <SelectItem value="4">4 sao</SelectItem>
                                      <SelectItem value="5">5 sao</SelectItem>
                                    </SelectContent>
                                  </Select>

                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />
                          </FieldGroup>
                        </div>

                        <div className="space-y-4">
                          <FieldGroup>
                            <Controller
                              control={form.control}
                              name="comment"
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel htmlFor="comment">
                                    Nội dung bình luận
                                  </FieldLabel>
                                  <Textarea
                                    {...field}
                                    id="comment"
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
                        </div>
                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <Button
                          type="submit"
                          className="bg-gradient text-white font-semibold"
                        >
                          Bình luận
                        </Button>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}

export default MainOrderReview;
