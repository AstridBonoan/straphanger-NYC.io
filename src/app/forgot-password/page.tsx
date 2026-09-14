import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Reset password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EDE6D6] px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-[#0A0A0A]/10 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold">Reset password</h1>
          <p className="mt-1 text-sm text-[#0A0A0A]/60">
            In demo mode, password reset is simulated. With Supabase Auth enabled,
            this sends a recovery email.
          </p>
        </div>
        <form className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <Button type="submit">Send reset link</Button>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link href="/login" className="text-[#FF4D00] hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
