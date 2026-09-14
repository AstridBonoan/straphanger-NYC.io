import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { AlertTriangle, DollarSign, Package, ShoppingBag } from "lucide-react";
import { getSeedProducts } from "@/lib/products/seed-data";
import {
  calculateDemoRevenueCents,
  getDemoOrders,
  getRecentDemoOrders,
} from "@/lib/orders/demo-orders";
import { formatPrice } from "@/lib/products/pricing";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { OrderStatusBadge } from "@/components/admin/order-status-select";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
};

const LOW_STOCK_THRESHOLD = 5;

export default function AdminDashboardPage() {
  const products = getSeedProducts();
  const orders = getDemoOrders();
  const recentOrders = getRecentDemoOrders(5);
  const revenueCents = calculateDemoRevenueCents();

  const lowStockRows = products
    .flatMap((product) =>
      (product.variants ?? [])
        .filter((variant) => variant.is_active && variant.inventory_quantity < LOW_STOCK_THRESHOLD)
        .map((variant) => ({ product, variant })),
    )
    .sort((a, b) => a.variant.inventory_quantity - b.variant.inventory_quantity);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Snapshot of store performance in demo mode."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Revenue"
          value={formatPrice(revenueCents)}
          hint="Paid, processing, shipped & delivered orders"
          icon={DollarSign}
          accent="teal"
        />
        <StatCard
          label="Orders"
          value={String(orders.length)}
          hint={`${orders.filter((o) => o.status === "pending").length} pending`}
          icon={ShoppingBag}
        />
        <StatCard
          label="Products"
          value={String(products.length)}
          hint={`${products.filter((p) => p.is_active).length} active`}
          icon={Package}
        />
        <StatCard
          label="Low stock"
          value={String(lowStockRows.length)}
          hint={`Variants under ${LOW_STOCK_THRESHOLD} units`}
          icon={AlertTriangle}
          accent={lowStockRows.length > 0 ? "warning" : "default"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-lg border border-[#0A0A0A]/10 bg-white lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#0A0A0A]/10 px-5 py-3">
            <h2 className="text-sm font-semibold text-[#0A0A0A]">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm text-[#FF4D00] hover:underline">
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-[#0A0A0A]/50">
              No orders yet.
            </p>
          ) : (
            <ul className="divide-y divide-[#0A0A0A]/8">
              {recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-[#FF4D00] hover:underline"
                    >
                      #{order.id.replace("ord-", "")}
                    </Link>
                    <p className="truncate text-xs text-[#0A0A0A]/50">
                      {order.shipping_address?.full_name ?? order.email} ·{" "}
                      {format(new Date(order.created_at), "MMM d")}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
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

        <section className="rounded-lg border border-[#0A0A0A]/10 bg-white">
          <div className="flex items-center justify-between border-b border-[#0A0A0A]/10 px-5 py-3">
            <h2 className="text-sm font-semibold text-[#0A0A0A]">Low stock</h2>
            <Link href="/admin/products" className="text-sm text-[#FF4D00] hover:underline">
              View products
            </Link>
          </div>
          {lowStockRows.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-[#0A0A0A]/50">
              Everything is well stocked — no variants under {LOW_STOCK_THRESHOLD} units.
            </p>
          ) : (
            <ul className="divide-y divide-[#0A0A0A]/8">
              {lowStockRows.map(({ product, variant }) => (
                <li key={variant.id} className="flex items-center justify-between gap-4 px-5 py-3">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="truncate text-sm font-medium text-[#0A0A0A] hover:text-[#FF4D00]"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-[#0A0A0A]/50">
                      {variant.color} · {variant.size}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-500/12 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                    {variant.inventory_quantity} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
