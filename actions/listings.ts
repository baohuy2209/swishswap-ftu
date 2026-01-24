"use server";
import z from "zod";
import prisma from "@/lib/db/prisma";
import { createClient } from "@/lib/supabase/server";
import { createListingSchema } from "@/schemas";
export const postProduct = async (
  values: z.infer<typeof createListingSchema>,
) => {
  console.log(values);
};
