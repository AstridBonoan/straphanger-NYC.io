"use client";

import Link from "next/link";
import { RequireAuth } from "@/components/auth/require-auth";
import { useOrdersByEmail } from "@/lib/orders/use-orders";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/products/pricing";
import { withBasePath } from "@/lib/paths";
import { cn } from "@/lib/utils";

export default function AccountOrdersPage() {
  return (
    <RequireAuth nextPath="/account/orders/">
      {(session) => <OrdersList email={session.email} />}
    </RequireAuth>
  );
}

function OrdersList({ email }: { email: string }) {
  const orders = useOrdersByEmail(email);

  return (
    <Container className="py-10 md:py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#FF4D00]">
            Account
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
            Order history
          </h1>
        </div>
        <Link
          href="/account/"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Back
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#0A0A0A]/15 bg-white/50 px-6 py-16 text-center">
          <h2 className="font-display text-xl font-semibold">No orders yet</h2>
          <p className="mt-2 text-sm text-[#0A0A0A]/60">
            When you place an order, it will show up here.
          </p>
          <Link href="/shop/" className={cn(buttonVariants(), "mt-6 inline-flex")}>
            Shop now
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-[#0A0A0A]/10 overflow-hidden rounded-2xl border border-[#0A0A0A]/10 bg-white">
          {orders.map((order) => (
            <li key={order.id}>
              <a
                href={withBasePath(`/order/#id=${encodeURIComponent(order.id)}`)}
                className="flex flex-col gap-2 px-5 py-4 transition hover:bg-[#0A0A0A]/[0.02] sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">Order {order.id}</p>
                  <p className="text-sm text-[#0A0A0A]/55">
                    {new Date(order.created_at).toLocaleDateString()} ·{" "}
                    <span className="capitalize">{order.status}</span>
                  </p>
                </div>
                <p className="font-semibold tabular-nums">
                  {formatPrice(order.total_cents)}
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
