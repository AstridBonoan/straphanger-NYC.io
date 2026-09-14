"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { buildDemoSession, setClientSession } from "@/lib/auth/client-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EDE6D6] px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-[#0A0A0A]/10 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#FF4D00] text-sm font-bold text-[#0A0A0A]">
              SH
            </span>
            <span className="text-base font-semibold">Straphanger NYC</span>
          </Link>
          <h1 className="mt-4 text-xl font-semibold">Create account</h1>
          <p className="mt-1 text-sm text-[#0A0A0A]/60">
            Demo signup creates a local browser session for this GitHub Pages demo.
          </p>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const email = String(data.get("email") ?? "").trim();
            const name = String(data.get("fullName") ?? "").trim();
            if (!email) return;
            setClientSession(buildDemoSession(email, name || undefined));
            router.push("/account/");
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" required autoComplete="name" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <Button type="submit">Create account</Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#0A0A0A]/60">
          Already have an account?{" "}
          <Link href="/login/" className="font-medium text-[#FF4D00] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
