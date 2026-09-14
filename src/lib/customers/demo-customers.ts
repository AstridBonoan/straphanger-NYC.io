import type { Order } from "@/types";
import { getDemoOrdersByEmail, getDemoOrders } from "@/lib/orders/demo-orders";

export interface DemoCustomer {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  location: string;
  createdAt: string;
}

export interface DemoCustomerWithStats extends DemoCustomer {
  orderCount: number;
  totalSpentCents: number;
  lastOrderAt: string | null;
}

const customers: DemoCustomer[] = [
  {
    id: "cust-jordan-blake",
    fullName: "Jordan Blake",
    email: "jordan.blake@example.com",
    phone: "303-555-0148",
    location: "Denver, CO",
    createdAt: "2026-03-11T10:00:00.000Z",
  },
  {
    id: "cust-priya-natarajan",
    fullName: "Priya Natarajan",
    email: "priya.n@example.com",
    phone: "206-555-0122",
    location: "Seattle, WA",
    createdAt: "2026-02-24T10:00:00.000Z",
  },
  {
    id: "cust-marcus-webb",
    fullName: "Marcus Webb",
    email: "marcus.webb@example.com",
    phone: "312-555-0187",
    location: "Chicago, IL",
    createdAt: "2026-05-02T10:00:00.000Z",
  },
  {
    id: "cust-elena-ruiz",
    fullName: "Elena Ruiz",
    email: "elena.ruiz@example.com",
    phone: "213-555-0104",
    location: "Los Angeles, CA",
    createdAt: "2026-04-18T10:00:00.000Z",
  },
  {
    id: "cust-sam-oconnell",
    fullName: "Sam O'Connell",
    email: "sam.oconnell@example.com",
    phone: "503-555-0173",
    location: "Ridgewood, NY",
    createdAt: "2026-06-30T10:00:00.000Z",
  },
  {
    id: "cust-taylor-kim",
    fullName: "Taylor Kim",
    email: "taylor.kim@example.com",
    phone: "612-555-0136",
    location: "Minneapolis, MN",
    createdAt: "2026-01-29T10:00:00.000Z",
  },
];

function statsFor(customer: DemoCustomer, orders: Order[]): DemoCustomerWithStats {
  const nonCancelled = orders.filter(
    (order) => order.status !== "cancelled" && order.status !== "refunded",
  );
  const totalSpentCents = nonCancelled.reduce((sum, order) => sum + order.total_cents, 0);
  const lastOrderAt =
    orders.length > 0
      ? orders.reduce((latest, order) =>
          new Date(order.created_at) > new Date(latest) ? order.created_at : latest,
        orders[0].created_at)
      : null;

  return {
    ...customer,
    orderCount: orders.length,
    totalSpentCents,
    lastOrderAt,
  };
}

export function getDemoCustomers(): DemoCustomer[] {
  return customers;
}

export function getDemoCustomerById(id: string): DemoCustomer | undefined {
  return customers.find((customer) => customer.id === id);
}

export function getDemoCustomerByEmail(email: string): DemoCustomer | undefined {
  const normalized = email.trim().toLowerCase();
  return customers.find((customer) => customer.email.toLowerCase() === normalized);
}

export function getCustomerOrders(email: string): Order[] {
  return getDemoOrdersByEmail(email);
}

export function getDemoCustomersWithStats(): DemoCustomerWithStats[] {
  return customers
    .map((customer) => statsFor(customer, getCustomerOrders(customer.email)))
    .sort((a, b) => b.totalSpentCents - a.totalSpentCents);
}

export function getDemoCustomerWithStatsById(
  id: string,
): DemoCustomerWithStats | undefined {
  const customer = getDemoCustomerById(id);
  if (!customer) return undefined;
  return statsFor(customer, getCustomerOrders(customer.email));
}

/** Sanity helper — every order email should resolve to a known demo customer. */
export function getOrphanedOrderEmails(): string[] {
  const knownEmails = new Set(customers.map((c) => c.email.toLowerCase()));
  const emails = new Set(
    getDemoOrders()
      .map((order) => order.email.toLowerCase())
      .filter((email) => !knownEmails.has(email)),
  );
  return Array.from(emails);
}
