import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in | Straphanger NYC",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EDE6D6] px-4 py-12">
      <Suspense
        fallback={
          <div className="text-sm text-[#0A0A0A]/55">Loading sign in…</div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
