import { Suspense } from "react";
import AdminOrderViewClient from "./view-client";

export default function AdminOrderViewPage() {
  return (
    <Suspense
      fallback={
        <div className="py-10 text-sm text-[#0A0A0A]/55">Loading order…</div>
      }
    >
      <AdminOrderViewClient />
    </Suspense>
  );
}
