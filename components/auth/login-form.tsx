"use client";
import React from "react";
import { CardWrapper } from "./card-wrapper";
import { Button } from "../ui/button";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import Link from "next/link";
import { LoginSchema } from "@/schemas";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login } from "@/actions/auth";
import { PasswordInput } from "../ui/password-input";
import { useRouter } from "next/navigation";

function LoginForm() {
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const router = useRouter();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      login(values).then((res) => {
        if (res?.error) {
          setError(res?.error);
        }
        if (res?.success) {
          setSuccess(res?.success);
          router.push("/");
        }
      });
    });
  };
  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonHref="/auth/register"
      backButtonLabel="Don't have an account?"
      showSocial={true}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
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
          <Button size="sm" variant="link" asChild className="px-0 font-normal">
            <Link href="/auth/reset">Quên mật khẩu?</Link>
          </Button>
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button
          type="submit"
          className="w-full bg-gradient text-white"
          disabled={isPending}
        >
          Đăng nhập
        </Button>
      </form>
    </CardWrapper>
  );
}

export default LoginForm;
