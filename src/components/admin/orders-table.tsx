"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Search } from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { formatPrice } from "@/lib/products/pricing";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  OrderStatusBadge,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_OPTIONS,
} from "@/components/admin/order-status-select";

export interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<OrderStatus | "all">("all");

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (!q) return true;
      return (
        order.id.toLowerCase().includes(q) ||
        order.email.toLowerCase().includes(q) ||
        (order.shipping_address?.full_name ?? "").toLowerCase().includes(q)
      );
    });
  }, [orders, search, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0A0A0A]/40" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer, email…"
            className="pl-9"
            aria-label="Search orders"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
          className="max-w-[180px]"
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          {ORDER_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {ORDER_STATUS_LABELS[status]}
            </option>
          ))}
        </Select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#0A0A0A]/10 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#0A0A0A]/10 text-xs uppercase tracking-wide text-[#0A0A0A]/50">
              <th scope="col" className="px-4 py-3 font-medium">Order</th>
              <th scope="col" className="px-4 py-3 font-medium">Customer</th>
              <th scope="col" className="px-4 py-3 font-medium">Date</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0A0A0A]/8">
            {filtered.map((order) => (
              <tr key={order.id} className="align-middle">
                <td className="whitespace-nowrap px-4 py-3">
                  <Link
                    href={`/admin/orders/view/?id=${encodeURIComponent(order.id)}`}
                    className="font-medium text-[#FF4D00] hover:underline"
                  >
                    #{order.id.replace("ord-", "")}
                  </Link>
                  <p className="text-xs text-[#0A0A0A]/50">
                    {order.items?.length ?? 0} item{(order.items?.length ?? 0) === 1 ? "" : "s"}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-[#0A0A0A]">
                    {order.shipping_address?.full_name ?? "—"}
                  </p>
                  <p className="text-xs text-[#0A0A0A]/50">{order.email}</p>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-[#0A0A0A]/70">
                  {format(new Date(order.created_at), "MMM d, yyyy")}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-[#0A0A0A]">
                  {formatPrice(order.total_cents)}
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-[#0A0A0A]/50">
                  No orders match your filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
