import { Suspense } from "react";
import AccountOrderViewClient from "./view-client";

export default function AccountOrderViewPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-[#0A0A0A]/55">
          Loading order…
        </div>
      }
    >
      <AccountOrderViewClient />
    </Suspense>
  );
}
