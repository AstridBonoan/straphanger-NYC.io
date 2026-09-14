import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  subject: z.string().trim().min(3, "Subject is required."),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(2000, "Message is too long."),
});

export const signUpSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name is required."),
    email: z.string().trim().email("Enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Za-z]/, "Password must include a letter.")
      .regex(/[0-9]/, "Password must include a number."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const passwordResetSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});

export const profileUpdateSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required."),
  phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
});

export const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required."),
  line1: z.string().trim().min(3, "Street address is required."),
  line2: z.string().trim().optional().or(z.literal("")),
  city: z.string().trim().min(2, "City is required."),
  state: z.string().trim().min(2, "State is required."),
  postalCode: z
    .string()
    .trim()
    .min(3, "Postal code is required.")
    .max(20, "Postal code is too long."),
  country: z.string().trim().min(2, "Country is required."),
  phone: z.string().trim().optional().or(z.literal("")),
});

export const checkoutSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  fullName: z.string().trim().min(2, "Full name is required."),
  phone: z.string().trim().optional().or(z.literal("")),
  shipping: addressSchema,
  billingSameAsShipping: z.boolean(),
  billing: addressSchema.optional(),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  payment: z.object({
    cardName: z.string().trim().min(2, "Name on card is required."),
    cardNumber: z
      .string()
      .trim()
      .min(13, "Enter a valid card number.")
      .refine((value) => {
        const digits = value.replace(/\D/g, "");
        return digits.length >= 13 && digits.length <= 19;
      }, "Enter a valid card number."),
    expiry: z
      .string()
      .trim()
      .regex(/^\d{2}\/\d{2}$/, "Use MM/YY format."),
    cvc: z
      .string()
      .trim()
      .regex(/^\d{3,4}$/, "Enter a 3 or 4 digit CVC."),
  }),
});

export const productAdminSchema = z.object({
  name: z.string().trim().min(2, "Product name is required."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase kebab-case."),
  description: z.string().trim().min(20, "Add a fuller product description."),
  categoryId: z.string().trim().min(1, "Select a category."),
  priceCents: z
    .number({ invalid_type_error: "Price is required." })
    .int()
    .positive("Price must be greater than zero."),
  compareAtCents: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional(),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isActive: z.boolean().default(true),
  tags: z.array(z.string().trim().min(1)).default([]),
});

export const productVariantAdminSchema = z.object({
  sku: z.string().trim().min(3, "SKU is required."),
  size: z.enum(["XS", "S", "M", "L", "XL", "XXL", "ONE_SIZE"]),
  color: z.string().trim().min(1, "Color is required."),
  colorHex: z
    .string()
    .trim()
    .regex(/^#([0-9A-Fa-f]{6})$/, "Use a hex color like #0A0A0A."),
  priceCents: z.number().int().positive().nullable().optional(),
  inventoryQuantity: z
    .number({ invalid_type_error: "Inventory is required." })
    .int()
    .min(0, "Inventory cannot be negative."),
  isActive: z.boolean().default(true),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ProductAdminInput = z.infer<typeof productAdminSchema>;
export type ProductVariantAdminInput = z.infer<typeof productVariantAdminSchema>;
