import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { getDemoCustomersWithStats } from "@/lib/customers/demo-customers";
import { formatPrice } from "@/lib/products/pricing";
import { PageHeader } from "@/components/admin/page-header";

export const metadata: Metadata = {
  title: "Customers | Admin",
};

export default function AdminCustomersPage() {
  const customers = getDemoCustomersWithStats();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Customers"
        description={`${customers.length} customers in the demo store`}
      />

      <div className="overflow-x-auto rounded-lg border border-[#0A0A0A]/10 bg-white">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#0A0A0A]/10 text-xs uppercase tracking-wide text-[#0A0A0A]/50">
              <th scope="col" className="px-4 py-3 font-medium">Customer</th>
              <th scope="col" className="px-4 py-3 font-medium">Location</th>
              <th scope="col" className="px-4 py-3 font-medium">Customer since</th>
              <th scope="col" className="px-4 py-3 font-medium">Orders</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Total spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0A0A0A]/8">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="font-medium text-[#FF4D00] hover:underline"
                  >
                    {customer.fullName}
                  </Link>
                  <p className="text-xs text-[#0A0A0A]/50">{customer.email}</p>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-[#0A0A0A]/70">
                  {customer.location}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-[#0A0A0A]/70">
                  {format(new Date(customer.createdAt), "MMM d, yyyy")}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-[#0A0A0A]/70">
                  {customer.orderCount}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-[#0A0A0A]">
                  {formatPrice(customer.totalSpentCents)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
