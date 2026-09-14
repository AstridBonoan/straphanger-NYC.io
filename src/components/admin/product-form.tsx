"use client";

import * as React from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { CircleCheck } from "lucide-react";
import type { Category, Product } from "@/types";
import { productAdminSchema } from "@/lib/validation/schemas";

type ProductFormValues = z.input<typeof productAdminSchema>;
type ProductFormOutput = z.output<typeof productAdminSchema>;
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button, buttonVariants } from "@/components/ui/button";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

function centsToDollarsInput(cents: number | null | undefined): string {
  if (cents == null) return "";
  return (cents / 100).toFixed(2);
}

function dollarsInputToCents(value: string): number {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.round(parsed * 100));
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-600">{message}</p>;
}

const CheckboxField = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string }
>(({ label, className, ...props }, ref) => {
  const id = React.useId();
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2 rounded-md border border-[#0A0A0A]/10 px-3 py-2 text-sm text-[#0A0A0A] transition-colors hover:bg-[#0A0A0A]/[0.03]"
    >
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className={cn("h-4 w-4 rounded border-[#0A0A0A]/30 accent-[#FF4D00]", className)}
        {...props}
      />
      {label}
    </label>
  );
});
CheckboxField.displayName = "CheckboxField";

export interface ProductFormProps {
  mode: "create" | "edit";
  categories: Category[];
  product?: Product;
}

export function ProductForm({ mode, categories, product }: ProductFormProps) {
  const defaultValues: ProductFormValues = React.useMemo(
    () => ({
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      description: product?.description ?? "",
      categoryId: product?.category_id ?? categories[0]?.id ?? "",
      priceCents: product?.price_cents ?? 0,
      compareAtCents: product?.compare_at_cents ?? null,
      isFeatured: product?.is_featured ?? false,
      isBestseller: product?.is_bestseller ?? false,
      isNew: product?.is_new ?? false,
      isActive: product?.is_active ?? true,
      tags: product?.tags ?? [],
    }),
    [product, categories],
  );

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues, unknown, ProductFormOutput>({
    resolver: zodResolver(productAdminSchema),
    defaultValues,
  });

  const [submitted, setSubmitted] = React.useState<ProductFormOutput | null>(null);

  function onSubmit(values: ProductFormOutput) {
    setSubmitted(values);
  }

  function handleGenerateSlug() {
    setValue("slug", slugify(getValues("name") || ""), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
      onChange={() => setSubmitted(null)}
    >
      {submitted ? (
        <div className="flex items-start gap-3 rounded-md border border-[#FF4D00]/25 bg-[#FF4D00]/8 px-4 py-3 text-sm text-[#FF4D00]">
          <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-medium">
              {mode === "create" ? `"${submitted.name}" validated.` : "Changes validated."}
            </p>
            <p className="mt-0.5 text-[#FF4D00]/80">
              Demo mode doesn&apos;t persist to a database — this form checked your
              input against the same schema the real admin API would use.
            </p>
          </div>
        </div>
      ) : null}

      <section className="grid gap-5 rounded-lg border border-[#0A0A0A]/10 bg-white p-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
          <FieldError message={errors.name?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug</Label>
          <div className="flex gap-2">
            <Input id="slug" {...register("slug")} aria-invalid={!!errors.slug} />
            <Button type="button" variant="outline" onClick={handleGenerateSlug}>
              Generate
            </Button>
          </div>
          <FieldError message={errors.slug?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="categoryId">Category</Label>
          <Select id="categoryId" {...register("categoryId")} aria-invalid={!!errors.categoryId}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <FieldError message={errors.categoryId?.message} />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            {...register("description")}
            aria-invalid={!!errors.description}
          />
          <FieldError message={errors.description?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="priceCents">Price (USD)</Label>
          <Controller
            control={control}
            name="priceCents"
            render={({ field }) => (
              <Input
                id="priceCents"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                defaultValue={centsToDollarsInput(field.value)}
                onChange={(event) => field.onChange(dollarsInputToCents(event.target.value))}
                aria-invalid={!!errors.priceCents}
              />
            )}
          />
          <FieldError message={errors.priceCents?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="compareAtCents">Compare-at price (USD)</Label>
          <Controller
            control={control}
            name="compareAtCents"
            render={({ field }) => (
              <Input
                id="compareAtCents"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="Optional"
                defaultValue={centsToDollarsInput(field.value)}
                onChange={(event) => {
                  const raw = event.target.value;
                  field.onChange(raw === "" ? null : dollarsInputToCents(raw));
                }}
                aria-invalid={!!errors.compareAtCents}
              />
            )}
          />
          <FieldError message={errors.compareAtCents?.message} />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="tags">Tags</Label>
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <Input
                id="tags"
                placeholder="essentials, cotton, bestseller"
                defaultValue={field.value?.join(", ") ?? ""}
                onChange={(event) =>
                  field.onChange(
                    event.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  )
                }
              />
            )}
          />
          <p className="text-xs text-[#0A0A0A]/50">Comma-separated.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:col-span-2 sm:grid-cols-4">
          <CheckboxField label="Featured" {...register("isFeatured")} />
          <CheckboxField label="Bestseller" {...register("isBestseller")} />
          <CheckboxField label="New" {...register("isNew")} />
          <CheckboxField label="Active" {...register("isActive")} />
        </div>
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {mode === "create" ? "Create product" : "Save changes"}
        </Button>
        <Link href="/admin/products" className={cn(buttonVariants({ variant: "outline" }))}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
