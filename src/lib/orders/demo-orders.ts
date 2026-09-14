import type {
  AddressSnapshot,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  ProductVariant,
} from "@/types";
import { getSeedProducts } from "@/lib/products/seed-data";
import {
  calculateShipping,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
} from "@/lib/products/pricing";

/** Order statuses that count toward realized revenue on the dashboard. */
export const REVENUE_ORDER_STATUSES: OrderStatus[] = [
  "paid",
  "processing",
  "shipped",
  "delivered",
];

function findProduct(productId: string): Product {
  const product = getSeedProducts().find((p) => p.id === productId);
  if (!product) {
    throw new Error(`Demo order data references unknown product: ${productId}`);
  }
  return product;
}

function findVariant(product: Product, color: string, size?: string): ProductVariant {
  const variant = (product.variants ?? []).find(
    (v) => v.color.toLowerCase() === color.toLowerCase() && (!size || v.size === size),
  );
  if (!variant) {
    throw new Error(
      `Demo order data references unknown variant: ${product.slug} / ${color} / ${size ?? ""}`,
    );
  }
  return variant;
}

type DemoLineSpec = {
  productId: string;
  color: string;
  size?: string;
  quantity: number;
};

function buildOrderItem(orderId: string, spec: DemoLineSpec, index: number): OrderItem {
  const product = findProduct(spec.productId);
  const variant = findVariant(product, spec.color, spec.size);
  const unitPriceCents = variant.price_cents ?? product.price_cents;
  const primaryImage =
    product.images?.find((img) => img.is_primary) ?? product.images?.[0] ?? null;

  return {
    id: `${orderId}-item-${index + 1}`,
    order_id: orderId,
    product_id: product.id,
    variant_id: variant.id,
    product_name: product.name,
    product_slug: product.slug,
    sku: variant.sku,
    size: variant.size,
    color: variant.color,
    quantity: spec.quantity,
    unit_price_cents: unitPriceCents,
    line_total_cents: unitPriceCents * spec.quantity,
    image_url: primaryImage?.url ?? null,
    created_at: product.created_at,
  };
}

function address(overrides: Partial<AddressSnapshot> & Pick<AddressSnapshot, "full_name">): AddressSnapshot {
  return {
    line1: "100 Market Street",
    city: "Austin",
    state: "TX",
    postal_code: "78701",
    country: "US",
    ...overrides,
  };
}

type DemoOrderSpec = {
  id: string;
  email: string;
  fullName: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  shippingAddress: AddressSnapshot;
  notes?: string | null;
  lines: DemoLineSpec[];
};

function buildOrder(spec: DemoOrderSpec): Order {
  const items = spec.lines.map((line, index) => buildOrderItem(spec.id, line, index));
  const subtotalCents = calculateSubtotal(
    items.map((item) => ({ unitPriceCents: item.unit_price_cents, quantity: item.quantity })),
  );
  const taxCents = calculateTax(subtotalCents);
  const shippingCents = calculateShipping(subtotalCents);
  const totalCents = calculateTotal(subtotalCents, taxCents, shippingCents);

  return {
    id: spec.id,
    user_id: null,
    email: spec.email,
    status: spec.status,
    subtotal_cents: subtotalCents,
    tax_cents: taxCents,
    shipping_cents: shippingCents,
    total_cents: totalCents,
    currency: "USD",
    stripe_checkout_session_id: null,
    stripe_payment_intent_id: null,
    shipping_address: spec.shippingAddress,
    billing_address: spec.shippingAddress,
    notes: spec.notes ?? null,
    created_at: spec.createdAt,
    updated_at: spec.updatedAt ?? spec.createdAt,
    items,
  };
}

const orderSpecs: DemoOrderSpec[] = [
  {
    id: "ord-1001",
    email: "jordan.blake@example.com",
    fullName: "Jordan Blake",
    status: "delivered",
    createdAt: "2026-07-02T15:12:00.000Z",
    updatedAt: "2026-07-06T18:40:00.000Z",
    shippingAddress: address({
      full_name: "Jordan Blake",
      line1: "482 Cedar Ave",
      city: "Denver",
      state: "CO",
      postal_code: "80202",
      phone: "303-555-0148",
    }),
    lines: [
      { productId: "prod-classic-tee", color: "Black", size: "M", quantity: 2 },
      { productId: "prod-core-hoodie", color: "Signal", size: "L", quantity: 1 },
    ],
  },
  {
    id: "ord-1002",
    email: "priya.n@example.com",
    fullName: "Priya Natarajan",
    status: "shipped",
    createdAt: "2026-07-10T09:45:00.000Z",
    updatedAt: "2026-07-12T14:05:00.000Z",
    shippingAddress: address({
      full_name: "Priya Natarajan",
      line1: "77 Harbor View Rd",
      city: "Seattle",
      state: "WA",
      postal_code: "98101",
      phone: "206-555-0122",
    }),
    lines: [
      { productId: "prod-tech-hoodie", color: "Charcoal", size: "L", quantity: 1 },
      { productId: "prod-socks", color: "Mixed", size: "M", quantity: 1 },
    ],
  },
  {
    id: "ord-1003",
    email: "marcus.webb@example.com",
    fullName: "Marcus Webb",
    status: "processing",
    createdAt: "2026-07-18T12:00:00.000Z",
    shippingAddress: address({
      full_name: "Marcus Webb",
      line1: "9 Lakeshore Dr",
      city: "Chicago",
      state: "IL",
      postal_code: "60601",
      phone: "312-555-0187",
    }),
    lines: [
      { productId: "prod-premium-pullover", color: "Concrete", size: "M", quantity: 1 },
    ],
  },
  {
    id: "ord-1004",
    email: "elena.ruiz@example.com",
    fullName: "Elena Ruiz",
    status: "paid",
    createdAt: "2026-07-22T08:30:00.000Z",
    shippingAddress: address({
      full_name: "Elena Ruiz",
      line1: "1450 Sunset Blvd",
      city: "Los Angeles",
      state: "CA",
      postal_code: "90026",
      phone: "213-555-0104",
    }),
    lines: [
      { productId: "prod-classic-cap", color: "Black", quantity: 1 },
      { productId: "prod-tote", color: "Concrete", quantity: 1 },
      { productId: "prod-mug", color: "Black", quantity: 1 },
    ],
  },
  {
    id: "ord-1005",
    email: "sam.oconnell@example.com",
    fullName: "Sam O'Connell",
    status: "pending",
    createdAt: "2026-07-27T19:20:00.000Z",
    shippingAddress: address({
      full_name: "Sam O'Connell",
      line1: "220 Riverside Ln",
      city: "Brooklyn",
      state: "NY",
      postal_code: "11237",
      phone: "503-555-0173",
    }),
    notes: "Please gift wrap — birthday present.",
    lines: [{ productId: "prod-weekend-short", color: "Stone", size: "M", quantity: 2 }],
  },
  {
    id: "ord-1006",
    email: "taylor.kim@example.com",
    fullName: "Taylor Kim",
    status: "delivered",
    createdAt: "2026-06-14T11:05:00.000Z",
    updatedAt: "2026-06-19T16:00:00.000Z",
    shippingAddress: address({
      full_name: "Taylor Kim",
      line1: "58 Birchwood Ct",
      city: "Minneapolis",
      state: "MN",
      postal_code: "55401",
      phone: "612-555-0136",
    }),
    lines: [{ productId: "prod-coach-jacket", color: "Black", size: "L", quantity: 1 }],
  },
  {
    id: "ord-1007",
    email: "jordan.blake@example.com",
    fullName: "Jordan Blake",
    status: "cancelled",
    createdAt: "2026-07-30T10:15:00.000Z",
    updatedAt: "2026-07-30T16:00:00.000Z",
    shippingAddress: address({
      full_name: "Jordan Blake",
      line1: "482 Cedar Ave",
      city: "Denver",
      state: "CO",
      postal_code: "80202",
      phone: "303-555-0148",
    }),
    notes: "Customer requested cancellation — ordered wrong size.",
    lines: [{ productId: "prod-beanie", color: "Charcoal", quantity: 1 }],
  },
  {
    id: "ord-1008",
    email: "priya.n@example.com",
    fullName: "Priya Natarajan",
    status: "refunded",
    createdAt: "2026-06-28T13:40:00.000Z",
    updatedAt: "2026-07-03T09:00:00.000Z",
    shippingAddress: address({
      full_name: "Priya Natarajan",
      line1: "77 Harbor View Rd",
      city: "Seattle",
      state: "WA",
      postal_code: "98101",
      phone: "206-555-0122",
    }),
    notes: "Refunded — item arrived damaged.",
    lines: [{ productId: "prod-snapback", color: "Signal", quantity: 1 }],
  },
];

const orders: Order[] = orderSpecs
  .map(buildOrder)
  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

export function getDemoOrders(): Order[] {
  return orders;
}

export function getDemoOrderById(id: string): Order | undefined {
  return orders.find((order) => order.id === id);
}

export function getRecentDemoOrders(limit = 5): Order[] {
  return orders.slice(0, limit);
}

export function getDemoOrdersByEmail(email: string): Order[] {
  const normalized = email.trim().toLowerCase();
  return orders.filter((order) => order.email.toLowerCase() === normalized);
}

export function calculateDemoRevenueCents(
  statuses: OrderStatus[] = REVENUE_ORDER_STATUSES,
): number {
  const allowed = new Set(statuses);
  return orders
    .filter((order) => allowed.has(order.status))
    .reduce((sum, order) => sum + order.total_cents, 0);
}
