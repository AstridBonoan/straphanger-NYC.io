import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  accent?: "default" | "teal" | "warning";
}

const accentClasses: Record<NonNullable<StatCardProps["accent"]>, string> = {
  default: "bg-[#0A0A0A]/8 text-[#0A0A0A]",
  teal: "bg-[#FF4D00]/12 text-[#FF4D00]",
  warning: "bg-amber-500/12 text-amber-700",
};

export function StatCard({ label, value, hint, icon: Icon, accent = "default" }: StatCardProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-[#0A0A0A]/10 bg-white p-5 shadow-sm">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#0A0A0A]/60">{label}</p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-[#0A0A0A]">
          {value}
        </p>
        {hint ? <p className="mt-1 text-xs text-[#0A0A0A]/50">{hint}</p> : null}
      </div>
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", accentClasses[accent])}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
    </div>
  );
}
