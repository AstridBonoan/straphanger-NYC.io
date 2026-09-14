import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { getDemoOrderById, getDemoOrders } from "@/lib/orders/demo-orders";
import { getDemoCustomerByEmail } from "@/lib/customers/demo-customers";
import { formatPrice } from "@/lib/products/pricing";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";
import { ThumbnailImage } from "@/components/admin/thumbnail-image";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Order detail | Admin",
};

export function generateStaticParams() {
  return getDemoOrders().map((order) => ({ id: order.id }));
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getDemoOrderById(id);

  if (!order) {
    notFound();
  }

  const customer = getDemoCustomerByEmail(order.email);
  const address = order.shipping_address;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-sm text-[#0A0A0A]/60 hover:text-[#0A0A0A]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>
      </div>

      <PageHeader
        title={`Order #${order.id.replace("ord-", "")}`}
        description={`Placed ${format(new Date(order.created_at), "MMMM d, yyyy 'at' h:mm a")}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section className="rounded-lg border border-[#0A0A0A]/10 bg-white">
            <div className="border-b border-[#0A0A0A]/10 px-5 py-3">
              <h2 className="text-sm font-semibold text-[#0A0A0A]">Items</h2>
            </div>
            <ul className="divide-y divide-[#0A0A0A]/8">
              {(order.items ?? []).map((item) => (
                <li key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <ThumbnailImage src={item.image_url} alt="" size={56} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-[#0A0A0A]">{item.product_name}</p>
                    <p className="text-xs text-[#0A0A0A]/50">
                      {item.color} · {item.size} · SKU {item.sku}
                    </p>
                  </div>
                  <div className="text-right text-sm text-[#0A0A0A]/70">
                    <p>
                      {item.quantity} × {formatPrice(item.unit_price_cents)}
                    </p>
                    <p className="font-medium text-[#0A0A0A]">
                      {formatPrice(item.line_total_cents)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 border-t border-[#0A0A0A]/10 px-5 py-4 text-sm">
              <div className="flex justify-between text-[#0A0A0A]/70">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal_cents)}</span>
              </div>
              <div className="flex justify-between text-[#0A0A0A]/70">
                <span>Shipping</span>
                <span>{order.shipping_cents === 0 ? "Free" : formatPrice(order.shipping_cents)}</span>
              </div>
              <div className="flex justify-between text-[#0A0A0A]/70">
                <span>Tax</span>
                <span>{formatPrice(order.tax_cents)}</span>
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between text-base font-semibold text-[#0A0A0A]">
                <span>Total</span>
                <span>{formatPrice(order.total_cents)}</span>
              </div>
            </div>
          </section>

          {order.notes ? (
            <section className="rounded-lg border border-[#0A0A0A]/10 bg-white p-5">
              <h2 className="text-sm font-semibold text-[#0A0A0A]">Notes</h2>
              <p className="mt-2 text-sm text-[#0A0A0A]/70">{order.notes}</p>
            </section>
          ) : null}
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-lg border border-[#0A0A0A]/10 bg-white p-5">
            <h2 className="text-sm font-semibold text-[#0A0A0A]">Status</h2>
            <div className="mt-3">
              <OrderStatusSelect orderId={order.id} initialStatus={order.status} />
            </div>
          </section>

          <section className="rounded-lg border border-[#0A0A0A]/10 bg-white p-5">
            <h2 className="text-sm font-semibold text-[#0A0A0A]">Customer</h2>
            <div className="mt-3 flex flex-col gap-2 text-sm text-[#0A0A0A]/70">
              <p className="font-medium text-[#0A0A0A]">{address?.full_name ?? "—"}</p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0" /> {order.email}
              </p>
              {address?.phone ? (
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 shrink-0" /> {address.phone}
                </p>
              ) : null}
              {customer ? (
                <Link
                  href={`/admin/customers/${customer.id}`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-2 w-full")}
                >
                  View customer profile
                </Link>
              ) : null}
            </div>
          </section>

          {address ? (
            <section className="rounded-lg border border-[#0A0A0A]/10 bg-white p-5">
              <h2 className="text-sm font-semibold text-[#0A0A0A]">Shipping address</h2>
              <div className="mt-3 flex items-start gap-2 text-sm text-[#0A0A0A]/70">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <address className="not-italic">
                  {address.line1}
                  {address.line2 ? <>, {address.line2}</> : null}
                  <br />
                  {address.city}, {address.state} {address.postal_code}
                  <br />
                  {address.country}
                </address>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
