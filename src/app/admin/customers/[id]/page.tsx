import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Calendar, DollarSign, Mail, MapPin, Phone, ShoppingBag } from "lucide-react";
import {
  getDemoCustomerWithStatsById,
  getCustomerOrders,
  getDemoCustomers,
} from "@/lib/customers/demo-customers";
import { formatPrice } from "@/lib/products/pricing";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { OrderStatusBadge } from "@/components/admin/order-status-select";

export const metadata: Metadata = {
  title: "Customer detail | Admin",
};

export function generateStaticParams() {
  return getDemoCustomers().map((customer) => ({ id: customer.id }));
}

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = getDemoCustomerWithStatsById(id);

  if (!customer) {
    notFound();
  }

  const orders = getCustomerOrders(customer.email);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-1.5 text-sm text-[#0A0A0A]/60 hover:text-[#0A0A0A]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to customers
        </Link>
      </div>

      <PageHeader title={customer.fullName} description={customer.email} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Orders" value={String(customer.orderCount)} icon={ShoppingBag} />
        <StatCard
          label="Total spent"
          value={formatPrice(customer.totalSpentCents)}
          icon={DollarSign}
          accent="teal"
        />
        <StatCard
          label="Customer since"
          value={format(new Date(customer.createdAt), "MMM yyyy")}
          icon={Calendar}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-lg border border-[#0A0A0A]/10 bg-white p-5 lg:col-span-1">
          <h2 className="text-sm font-semibold text-[#0A0A0A]">Contact</h2>
          <div className="mt-3 flex flex-col gap-2 text-sm text-[#0A0A0A]/70">
            <p className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 shrink-0" /> {customer.email}
            </p>
            {customer.phone ? (
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0" /> {customer.phone}
              </p>
            ) : null}
            <p className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0" /> {customer.location}
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-[#0A0A0A]/10 bg-white lg:col-span-2">
          <div className="border-b border-[#0A0A0A]/10 px-5 py-3">
            <h2 className="text-sm font-semibold text-[#0A0A0A]">Order history</h2>
          </div>
          {orders.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-[#0A0A0A]/50">
              No orders yet.
            </p>
          ) : (
            <ul className="divide-y divide-[#0A0A0A]/8">
              {orders.map((order) => (
                <li key={order.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-[#FF4D00] hover:underline"
                    >
                      #{order.id.replace("ord-", "")}
                    </Link>
                    <p className="text-xs text-[#0A0A0A]/50">
                      {format(new Date(order.created_at), "MMM d, yyyy")} ·{" "}
                      {order.items?.length ?? 0} item{(order.items?.length ?? 0) === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    <span className="font-medium text-[#0A0A0A]">
                      {formatPrice(order.total_cents)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
