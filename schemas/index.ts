import * as z from "zod";
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});
export const RegisterSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long",
    }),
    confirmPassword: z.string().min(1, {
      message: "Please confirm your password",
    }),
    name: z.string().min(1, {
      message: "Name is required",
    }),
    university_name: z.string().min(1, {
      message: "University name is required",
    }),
    phone: z.string().min(10, {
      message: "Please enter a valid phone number",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });
