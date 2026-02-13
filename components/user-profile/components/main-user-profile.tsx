"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Save, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { University, User } from "@/lib/generated/prisma/client";
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
import { userProfileSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAllUniversity } from "@/actions/university";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { updateUserProfile } from "@/actions/user";
import { formatDateVN } from "@/lib/utils";
import { toast } from "sonner";
function MainUserProfile({
  user,
}: {
  user: Omit<User, "password_hash"> | null;
}) {
  if (!user) {
    return <p className="text-gray-700 font-bold">Cần phải đăng nhập</p>;
  }
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const [isPending, startTransition] = React.useTransition();
  const [listUniversity, setListUniversity] = React.useState<University[]>([]);

  const form = useForm<z.infer<typeof userProfileSchema>>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      university_name: user.university_name ?? undefined,
      phone: user.phone,
      location: user.location ?? undefined,
    },
  });
  const onSubmit = (values: z.infer<typeof userProfileSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      updateUserProfile(values)
        .then((res) => {
          const formatted = new Intl.DateTimeFormat("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }).format(new Date());
          if (res.error) {
            setError(res.error);
            toast(res.error, {
              description: `${formatted}`,
            });
          }
          if (res.success) {
            setSuccess(res.success);

            toast("Đã tạo sản phẩm thành công", {
              description: `${formatDateVN(formatted)}`,
            });
            form.reset();
          }
        })
        .catch((err) => {
          setError(err.message);
        });
    });
  };
  React.useEffect(() => {
    getAllUniversity()
      .then((res) => {
        if (res.error) {
          setError(res.error);
        }
        if (!res.universities) {
          setError("Lỗi khi load dữ liệu các Trường ĐH");
        } else {
          setListUniversity(res.universities);
        }
      })
      .catch();
  }, []);
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
        <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={`${user.avatar_url ? user.avatar_url : "/image.png"}`}
              />
              <AvatarFallback className="text-lg">AE</AvatarFallback>
            </Avatar>
            <div className="w-full space-y-2">
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="avatar"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldDescription className="text-sm text-gray-600">
                        JPG, PNG or GIF. Max size 2MB
                      </FieldDescription>
                      <Button
                        variant="outline"
                        className="gap-2 bg-transparent"
                      >
                        <Upload className="w-4 h-4" />

                        <Input
                          type="file"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              field.onChange(e.target.files?.[0]);
                            }
                          }}
                          disabled={isPending}
                          id="avatar"
                          aria-invalid={fieldState.invalid ? "true" : "false"}
                          autoComplete="off"
                        />
                      </Button>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <FieldGroup>
                  <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="name">First Name</FieldLabel>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="Họ và tên"
                          type="text"
                          id="title"
                          aria-invalid={fieldState.invalid ? "true" : "false"}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>
              <div className="space-y-2">
                <FieldGroup>
                  <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="Email"
                          type="email"
                          id="email"
                          aria-invalid={fieldState.invalid ? "true" : "false"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <FieldGroup>
                  <Controller
                    control={form.control}
                    name="phone"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="phone">Số điện thoại</FieldLabel>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="+84 375 686 583"
                          type="text"
                          id="phone"
                          aria-invalid={fieldState.invalid ? "true" : "false"}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>
              <div className="space-y-2">
                <FieldGroup>
                  <Controller
                    control={form.control}
                    name="university_name"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="university_name">
                          Trường đại học
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
                            <SelectValue placeholder="Chọn trường đại học" />
                          </SelectTrigger>
                          <SelectContent position="item-aligned">
                            <SelectItem value="auto">
                              Chọn trường đại học
                            </SelectItem>
                            <SelectSeparator />
                            {listUniversity.map((university) => (
                              <SelectItem
                                key={university.value}
                                value={university.value}
                              >
                                {university.label}
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
              </div>
            </div>
            <div className="space-y-2">
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="location"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="location">Location</FieldLabel>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Địa chỉ nơi ở"
                        type="text"
                        id="location"
                        aria-invalid={fieldState.invalid ? "true" : "false"}
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
          <div className="flex justify-end">
            <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
              <Save className="w-4 h-4" />
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default MainUserProfile;
