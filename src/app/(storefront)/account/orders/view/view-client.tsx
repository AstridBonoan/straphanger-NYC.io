"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RequireAuth } from "@/components/auth/require-auth";
import { useOrderById } from "@/lib/orders/use-orders";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/products/pricing";
import { cn } from "@/lib/utils";

function OrderDetailBody({ orderId }: { orderId: string }) {
  const order = useOrderById(orderId);

  if (!order) {
    return (
      <Container className="py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">Order not found</h1>
        <p className="mt-2 text-sm text-[#0A0A0A]/60">
          This order is not available in seed data or this browser&apos;s saved demo orders.
        </p>
        <Link href="/account/orders/" className={cn(buttonVariants(), "mt-6 inline-flex")}>
          Back to orders
        </Link>
      </Container>
    );
  }

  return (
    <RequireAuth nextPath={`/account/orders/view/?id=${encodeURIComponent(orderId)}`}>
      {(session) => {
        const canView =
          order.email.toLowerCase() === session.email.toLowerCase() ||
          session.role === "admin";
        if (!canView) {
          return (
            <Container className="py-16 text-center">
              <h1 className="font-display text-2xl font-semibold">Order unavailable</h1>
              <p className="mt-2 text-sm text-[#0A0A0A]/60">
                Sign in with the email used at checkout, or use a demo admin account.
              </p>
              <Link
                href="/account/orders/"
                className={cn(buttonVariants(), "mt-6 inline-flex")}
              >
                Back to orders
              </Link>
            </Container>
          );
        }

        return (
          <Container className="py-10 md:py-16">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#FF4D00]">
                  Order
                </p>
                <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
                  {order.id}
                </h1>
                <p className="mt-1 text-sm capitalize text-[#0A0A0A]/60">
                  {order.status} · {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <Link
                href="/account/orders/"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Back
              </Link>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
              <ul className="divide-y divide-[#0A0A0A]/10 overflow-hidden rounded-2xl border border-[#0A0A0A]/10 bg-white">
                {(order.items ?? []).map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between gap-4 px-5 py-4 text-sm"
                  >
                    <div>
                      <Link
                        href={`/product/${item.product_slug}/`}
                        className="font-medium hover:underline"
                      >
                        {item.product_name}
                      </Link>
                      <p className="mt-1 text-[#0A0A0A]/55">
                        {item.color} / {item.size} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium tabular-nums">
                      {formatPrice(item.line_total_cents)}
                    </p>
                  </li>
                ))}
              </ul>

              <aside className="space-y-6">
                <div className="rounded-2xl border border-[#0A0A0A]/10 bg-white p-5 text-sm">
                  <h2 className="font-display text-base font-semibold">Totals</h2>
                  <dl className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-[#0A0A0A]/55">Subtotal</dt>
                      <dd className="tabular-nums">
                        {formatPrice(order.subtotal_cents)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[#0A0A0A]/55">Shipping</dt>
                      <dd className="tabular-nums">
                        {formatPrice(order.shipping_cents)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[#0A0A0A]/55">Tax</dt>
                      <dd className="tabular-nums">{formatPrice(order.tax_cents)}</dd>
                    </div>
                    <div className="flex justify-between border-t border-[#0A0A0A]/10 pt-2 font-semibold">
                      <dt>Total</dt>
                      <dd className="tabular-nums">
                        {formatPrice(order.total_cents)}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl border border-[#0A0A0A]/10 bg-white p-5 text-sm">
                  <h2 className="font-display text-base font-semibold">Shipping</h2>
                  {order.shipping_address ? (
                    <p className="mt-3 text-[#0A0A0A]/70">
                      {order.shipping_address.full_name}
                      <br />
                      {order.shipping_address.line1}
                      <br />
                      {order.shipping_address.city}, {order.shipping_address.state}{" "}
                      {order.shipping_address.postal_code}
                    </p>
                  ) : (
                    <p className="mt-3 text-[#0A0A0A]/55">No shipping address on file.</p>
                  )}
                </div>

                {order.stripe_payment_intent_id ? (
                  <div className="rounded-2xl border border-[#0A0A0A]/10 bg-white p-5 text-sm">
                    <h2 className="font-display text-base font-semibold">Payment</h2>
                    <p className="mt-3 break-all text-[#0A0A0A]/70">
                      {order.stripe_payment_intent_id}
                    </p>
                  </div>
                ) : null}
              </aside>
            </div>
          </Container>
        );
      }}
    </RequireAuth>
  );
}

export default function AccountOrderViewClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id")?.trim() ?? "";

  if (!orderId) {
    return (
      <Container className="py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">Missing order</h1>
        <Link href="/account/orders/" className={cn(buttonVariants(), "mt-6 inline-flex")}>
          Back to orders
        </Link>
      </Container>
    );
  }

  return <OrderDetailBody orderId={orderId} />;
}
