"use client";

import { RequireAuth } from "@/components/auth/require-auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth role="admin" nextPath="/admin/">
      {(session) => (
        <div className="flex min-h-screen w-full flex-col bg-[#EDE6D6] lg:flex-row">
          <AdminSidebar session={session} />
          <div className="flex min-w-0 flex-1 flex-col">
            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      )}
    </RequireAuth>
  );
}
