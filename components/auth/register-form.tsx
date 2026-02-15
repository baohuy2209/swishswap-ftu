"use client";
import { RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { registerUser } from "@/actions/auth";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components//ui/select";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getAllUniversity } from "@/actions/university";
import { University } from "@/lib/generated/prisma/client";
function isEduEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.edu(\.[^\s@]+)?$/i;
  return regex.test(email);
}
function RegisterForm() {
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const router = useRouter();
  const [listUniversity, setListUniversity] = React.useState<University[]>([]);
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      university_name: "",
      phone: "",
    },
  });
  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      const { email } = RegisterSchema.parse(values);
      const isValidateEmail = isEduEmail(email);
      if (!isValidateEmail) {
        setError("Không phải là mail edu");
        return;
      }
      registerUser(values).then((res) => {
        if (res?.error) {
          setError(res?.error);
          return;
        }
        if (res?.success) {
          setSuccess(res?.success);
          router.push("/auth/evindence");
        }
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
    <CardWrapper
      headerLabel="Welcome to Swishswap"
      backButtonHref="/auth/login"
      backButtonLabel="Already have an account?"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Họ và tên</FieldLabel>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Nguyen Bao Huy"
                    type="text"
                    id="name"
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
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="huynguyen002311@gmail.com"
                    type="email"
                    id="email"
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
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                  <PasswordInput
                    {...field}
                    disabled={isPending}
                    placeholder="********"
                    id="password"
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
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword">
                    Xác nhận mật khẩu
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    disabled={isPending}
                    placeholder="********"
                    id="confirmPassword"
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
              name="university_name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="university_name">
                      Trường Đại học
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
                        <SelectItem value="auto">Auto</SelectItem>
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
                  </FieldContent>
                </Field>
              )}
            />
          </FieldGroup>
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
                    placeholder="0375686583"
                    type="text"
                    id="phone"
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
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button
          type="submit"
          className="w-full bg-gradient text-white"
          disabled={isPending}
        >
          Đăng kí
        </Button>
      </form>
    </CardWrapper>
  );
}

export default RegisterForm;
