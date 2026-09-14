"use client";

import * as React from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Loader2, Lock } from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/products/pricing";
import { useCartStore, useCartSummary } from "@/lib/cart/store";
import { checkoutSchema, type CheckoutInput } from "@/lib/validation/schemas";
import {
  formatCardNumber,
  formatExpiry,
  processDemoPayment,
} from "@/lib/checkout/demo-payment";
import { placeDemoOrder } from "@/lib/checkout/place-demo-order";
import { saveCheckoutSuccess } from "@/lib/checkout/success-storage";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/paths";
import { nanoid } from "nanoid";

type Props = {
  defaultEmail?: string;
  defaultName?: string;
};

export function CheckoutForm({ defaultEmail = "", defaultName = "" }: Props) {
  const lines = useCartStore((state) => state.lines);
  const clearCart = useCartStore((state) => state.clearCart);
  const summary = useCartSummary();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: defaultEmail,
      fullName: defaultName,
      phone: "",
      billingSameAsShipping: true,
      notes: "",
      shipping: {
        fullName: defaultName,
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "US",
        phone: "",
      },
      payment: {
        cardName: defaultName,
        cardNumber: "",
        expiry: "",
        cvc: "",
      },
    },
  });

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#0A0A0A]/15 bg-white/50 px-6 py-16 text-center">
        <h2 className="font-display text-xl font-semibold">Nothing to checkout</h2>
        <p className="mt-2 text-sm text-[#0A0A0A]/60">
          Add products to your bag before continuing.
        </p>
        <Link href="/shop" className={cn(buttonVariants(), "mt-6 inline-flex")}>
          Browse shop
        </Link>
      </div>
    );
  }

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    setSubmitting(true);
    try {
      // Prefer real Stripe Checkout when a server route is available (local/non-static).
      try {
        const response = await fetch(withBasePath("/api/checkout"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            fullName: data.fullName,
            phone: data.phone,
            notes: data.notes,
            shipping: data.shipping,
            lines: lines.map((line) => ({
              productId: line.productId,
              variantId: line.variantId,
              quantity: line.quantity,
            })),
          }),
        });

        if (response.ok) {
          const payload = (await response.json()) as {
            url?: string;
            error?: string;
          };
          if (payload.url) {
            window.location.assign(payload.url);
            return;
          }
        }
        // 404 / unavailable → fall through to demo payment (GitHub Pages).
      } catch {
        // Network / static hosting — continue with demo payment.
      }

      const charge = await processDemoPayment(data.payment);
      if (!charge.ok) {
        setServerError(charge.error);
        return;
      }

      const sessionId = `demo_${nanoid()}`;
      const placed = placeDemoOrder({
        checkout: data,
        lines,
        sessionId,
        paymentIntentId: charge.paymentIntentId,
      });

      if (!placed.ok) {
        setServerError(placed.error);
        return;
      }

      clearCart();
      saveCheckoutSuccess({
        sessionId,
        orderId: placed.order.id,
        email: data.email,
        totalCents: placed.order.total_cents,
        isDemo: true,
      });
      // No query string — ?id= on this route crashes Next hydration on Pages.
      // Order id lives in sessionStorage for confirmation + View order.
      window.location.assign(withBasePath("/checkout/success/"));
    } catch {
      setServerError("Unable to complete checkout. Please try again.");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start"
      noValidate
    >
      <div className="space-y-8 rounded-2xl border border-[#0A0A0A]/10 bg-white p-6 md:p-8">
        <section className="space-y-4">
          <h2 className="font-display text-lg font-semibold">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" {...register("email")} />
              {errors.email ? (
                <p className="text-xs text-red-700">{errors.email.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" autoComplete="name" {...register("fullName")} />
              {errors.fullName ? (
                <p className="text-xs text-red-700">{errors.fullName.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-lg font-semibold">Shipping</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="shipping.fullName">Recipient name</Label>
              <Input
                id="shipping.fullName"
                autoComplete="shipping name"
                {...register("shipping.fullName")}
              />
              {errors.shipping?.fullName ? (
                <p className="text-xs text-red-700">{errors.shipping.fullName.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="shipping.line1">Address</Label>
              <Input
                id="shipping.line1"
                autoComplete="shipping address-line1"
                {...register("shipping.line1")}
              />
              {errors.shipping?.line1 ? (
                <p className="text-xs text-red-700">{errors.shipping.line1.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="shipping.line2">Apartment, suite (optional)</Label>
              <Input
                id="shipping.line2"
                autoComplete="shipping address-line2"
                {...register("shipping.line2")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shipping.city">City</Label>
              <Input
                id="shipping.city"
                autoComplete="shipping address-level2"
                {...register("shipping.city")}
              />
              {errors.shipping?.city ? (
                <p className="text-xs text-red-700">{errors.shipping.city.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shipping.state">State</Label>
              <Input
                id="shipping.state"
                autoComplete="shipping address-level1"
                {...register("shipping.state")}
              />
              {errors.shipping?.state ? (
                <p className="text-xs text-red-700">{errors.shipping.state.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shipping.postalCode">Postal code</Label>
              <Input
                id="shipping.postalCode"
                autoComplete="shipping postal-code"
                {...register("shipping.postalCode")}
              />
              {errors.shipping?.postalCode ? (
                <p className="text-xs text-red-700">
                  {errors.shipping.postalCode.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shipping.country">Country</Label>
              <Input
                id="shipping.country"
                autoComplete="shipping country"
                {...register("shipping.country")}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">Payment</h2>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#0A0A0A]/50">
              <Lock className="size-3.5" aria-hidden="true" />
              Demo checkout
            </span>
          </div>
          <p className="text-sm text-[#0A0A0A]/60">
            Use Stripe test card{" "}
            <span className="font-medium text-[#0A0A0A]">4242 4242 4242 4242</span>,
            any future expiry, and any CVC.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="payment.cardName">Name on card</Label>
              <Input
                id="payment.cardName"
                autoComplete="cc-name"
                {...register("payment.cardName")}
              />
              {errors.payment?.cardName ? (
                <p className="text-xs text-red-700">{errors.payment.cardName.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="payment.cardNumber">Card number</Label>
              <div className="relative">
                <CreditCard
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#0A0A0A]/35"
                  aria-hidden="true"
                />
                <Controller
                  control={control}
                  name="payment.cardNumber"
                  render={({ field }) => (
                    <Input
                      id="payment.cardNumber"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="4242 4242 4242 4242"
                      className="pl-9"
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(formatCardNumber(event.target.value))
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  )}
                />
              </div>
              {errors.payment?.cardNumber ? (
                <p className="text-xs text-red-700">{errors.payment.cardNumber.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="payment.expiry">Expiry</Label>
              <Controller
                control={control}
                name="payment.expiry"
                render={({ field }) => (
                  <Input
                    id="payment.expiry"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    value={field.value}
                    onChange={(event) =>
                      field.onChange(formatExpiry(event.target.value))
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                )}
              />
              {errors.payment?.expiry ? (
                <p className="text-xs text-red-700">{errors.payment.expiry.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="payment.cvc">CVC</Label>
              <Input
                id="payment.cvc"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                maxLength={4}
                {...register("payment.cvc")}
              />
              {errors.payment?.cvc ? (
                <p className="text-xs text-red-700">{errors.payment.cvc.message}</p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="space-y-1.5">
          <Label htmlFor="notes">Order notes (optional)</Label>
          <Textarea id="notes" rows={3} {...register("notes")} />
        </section>

        {serverError ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {serverError}
          </p>
        ) : null}
      </div>

      <aside className="sticky top-24 space-y-6 rounded-2xl border border-[#0A0A0A]/10 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold">Order summary</h2>
        <ul className="space-y-3 text-sm">
          {lines.map((line) => (
            <li
              key={`${line.productId}-${line.variantId}`}
              className="flex justify-between gap-3"
            >
              <span className="text-[#0A0A0A]/70">
                {line.name}{" "}
                <span className="text-[#0A0A0A]/45">
                  ({line.color}/{line.size}) × {line.quantity}
                </span>
              </span>
              <span className="shrink-0 font-medium tabular-nums">
                {formatPrice(line.unitPriceCents * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="space-y-2 border-t border-[#0A0A0A]/10 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-[#0A0A0A]/60">Subtotal</dt>
            <dd className="tabular-nums">{formatPrice(summary.subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[#0A0A0A]/60">Shipping</dt>
            <dd className="tabular-nums">
              {summary.shippingCents === 0
                ? "Free"
                : formatPrice(summary.shippingCents)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[#0A0A0A]/60">Tax</dt>
            <dd className="tabular-nums">{formatPrice(summary.taxCents)}</dd>
          </div>
          <div className="flex justify-between border-t border-[#0A0A0A]/10 pt-2 text-base font-semibold">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatPrice(summary.totalCents)}</dd>
          </div>
        </dl>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Processing payment…
            </>
          ) : (
            `Pay ${formatPrice(summary.totalCents)}`
          )}
        </Button>
        <p className="text-center text-xs text-[#0A0A0A]/50">
          No real charges on the GitHub Pages demo. Card details stay in your browser.
        </p>
      </aside>
    </form>
  );
}
