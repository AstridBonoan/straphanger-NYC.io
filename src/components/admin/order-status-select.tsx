"use client";

import * as React from "react";
import type { OrderStatus } from "@/types";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

const STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  pending: "bg-[#0A0A0A]/8 text-[#0A0A0A]/70",
  paid: "bg-[#FF4D00]/12 text-[#FF4D00]",
  processing: "bg-blue-500/10 text-blue-700",
  shipped: "bg-indigo-500/10 text-indigo-700",
  delivered: "bg-green-600/10 text-green-700",
  cancelled: "bg-red-500/10 text-red-700",
  refunded: "bg-amber-500/10 text-amber-700",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_BADGE_CLASSES[status],
      )}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}

export interface OrderStatusSelectProps {
  orderId: string;
  initialStatus: OrderStatus;
  onStatusChange?: (status: OrderStatus) => void;
}

/**
 * Demo-only status control: updates local component state and shows a note
 * that nothing was persisted. A real implementation would call a Server
 * Action that writes to the orders table and revalidates this page.
 */
export function OrderStatusSelect({ orderId, initialStatus, onStatusChange }: OrderStatusSelectProps) {
  const [status, setStatus] = React.useState<OrderStatus>(initialStatus);
  const [changed, setChanged] = React.useState(false);

  function handleChange(next: OrderStatus) {
    setStatus(next);
    setChanged(next !== initialStatus);
    onStatusChange?.(next);
  }

  return (
    <div className="flex flex-col gap-2">
      <Select
        aria-label={`Update status for order ${orderId}`}
        value={status}
        onChange={(event) => handleChange(event.target.value as OrderStatus)}
        className="max-w-[200px]"
      >
        {ORDER_STATUS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {ORDER_STATUS_LABELS[option]}
          </option>
        ))}
      </Select>
      {changed ? (
        <p className="text-xs text-[#FF4D00]">
          Updated locally — demo mode doesn&apos;t persist status changes.
        </p>
      ) : null}
    </div>
  );
}
