"use client";
import React from "react";
import { CardWrapper } from "./card-wrapper";
import { Button } from "../ui/button";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { evindenceFormSchema } from "@/schemas";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { uploadEvindence } from "@/actions/auth";
import { useRouter } from "next/navigation";
function EvidenceForm() {
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const router = useRouter();
  const form = useForm<z.infer<typeof evindenceFormSchema>>({
    resolver: zodResolver(evindenceFormSchema),
  });
  const onSubmit = (values: z.infer<typeof evindenceFormSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      uploadEvindence(values).then((res) => {
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
      headerLabel="Minh chứng sinh viên"
      backButtonHref="/"
      backButtonLabel="Quay lại trang chủ"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FieldGroup>
            <Controller
              control={form.control}
              name="evindenceFile"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="evindenceFile">
                    Ảnh thẻ sinh viên
                  </FieldLabel>
                  <Input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        field.onChange(e.target.files?.[0]);
                      }
                    }}
                    disabled={isPending}
                    placeholder="Chọn ảnh"
                    id="evindenceFile"
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
          disabled={isPending}
          className="w-full bg-gradient text-white"
        >
          {isPending ? "Đang tải lên..." : "Tải lên"}
        </Button>
      </form>
    </CardWrapper>
  );
}
export default EvidenceForm;
