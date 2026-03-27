import { z } from "zod";

const stripHtml = (value: string): string => value.replace(/<[^>]*>/g, "").trim();
const optionalSanitized = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform(stripHtml)
    .refine((val) => val.length > 0, {
      message: "String must contain at least 1 character",
    })
    .optional();

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be at most 100 characters")
    .transform(stripHtml),
  description: optionalSanitized(1000).or(z.literal("")),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .min(0.01, "Price must be at least 0.01"),
  stock: z.coerce
    .number({ invalid_type_error: "Stock must be a number" })
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative"),
  imageUrl: z.string().optional(),
  roastLevel: optionalSanitized(100).or(z.literal("")),
  grind: optionalSanitized(100).or(z.literal("")),
  size: optionalSanitized(100).or(z.literal("")),
});

export const updateProductSchema = createProductSchema.partial();
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
