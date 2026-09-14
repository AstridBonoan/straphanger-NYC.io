"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useOrderById } from "@/lib/orders/use-orders";
import { PageHeader } from "@/components/admin/page-header";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { formatPrice } from "@/lib/products/pricing";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminOrderViewClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id")?.trim() ?? "";
  const order = useOrderById(orderId);

  if (!orderId || !order) {
    return (
      <div className="space-y-4">
        <PageHeader title="Order not found" description="No matching demo order in seed data or this browser." />
        <Link href="/admin/orders/" className={cn(buttonVariants({ variant: "outline" }))}>
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Order #${order.id.replace("ord-", "")}`}
        description={`${order.email} · ${new Date(order.created_at).toLocaleString()}`}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="overflow-hidden rounded-lg border border-[#0A0A0A]/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#0A0A0A]/10 text-xs uppercase tracking-wide text-[#0A0A0A]/50">
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Qty</th>
                <th className="px-4 py-3 text-right font-medium">Line total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0A0A0A]/8">
              {(order.items ?? []).map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-xs text-[#0A0A0A]/50">
                      {item.color} / {item.size}
                    </p>
                  </td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatPrice(item.line_total_cents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-[#0A0A0A]/10 bg-white p-4">
            <h2 className="text-sm font-semibold">Status</h2>
            <div className="mt-3">
              <OrderStatusSelect orderId={order.id} initialStatus={order.status} />
            </div>
          </div>
          <div className="rounded-lg border border-[#0A0A0A]/10 bg-white p-4 text-sm">
            <h2 className="font-semibold">Totals</h2>
            <dl className="mt-3 space-y-2">
              <div className="flex justify-between">
                <dt className="text-[#0A0A0A]/55">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(order.subtotal_cents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#0A0A0A]/55">Shipping</dt>
                <dd className="tabular-nums">{formatPrice(order.shipping_cents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#0A0A0A]/55">Tax</dt>
                <dd className="tabular-nums">{formatPrice(order.tax_cents)}</dd>
              </div>
              <div className="flex justify-between border-t border-[#0A0A0A]/10 pt-2 font-semibold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatPrice(order.total_cents)}</dd>
              </div>
            </dl>
          </div>
          <Link href="/admin/orders/" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
            Back to orders
          </Link>
        </aside>
      </div>
    </div>
  );
}
