"use client";

import { Blocks, Calculator, FileCheck2, LayoutDashboard, Upload, Wallet2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const DASHBOARD_ICONS = {
  Dashboard: LayoutDashboard,
  Certificates: Upload,
  "Upload Certificate": Upload,
  "GPA Calculator": Calculator,
  "CGPA Calculator": FileCheck2,
  Verification: Wallet2,
  "Blockchain Verification": Wallet2
};

export type SidebarNavItem = {
  href: string;
  label: keyof typeof DASHBOARD_ICONS;
};

export default function SidebarNav({
  navItems
}: {
  navItems: SidebarNavItem[];
}) {
  return (
    <aside className="surface-panel hidden h-[calc(100vh-2rem)] w-[250px] shrink-0 flex-col justify-between p-5 xl:flex">
      <div className="space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-300">
            VIT Portal
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-serif)] text-2xl leading-tight text-slate-950 dark:text-white">
            Verified academics, without wallet friction.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Upload records, calculate grades, and anchor certificate hashes on
            Sepolia through secure server-side signing.
          </p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = DASHBOARD_ICONS[item.label];

            return (
              <a
                className={cn(
                  "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                )}
                href={item.href}
                key={item.href}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-sky-100 group-hover:text-sky-700 dark:bg-slate-900 dark:text-slate-300 dark:group-hover:bg-sky-500/10 dark:group-hover:text-sky-300">
                  <Icon className="h-5 w-5" />
                </span>
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>

      <div className="rounded-[1.75rem] bg-slate-950 p-4 text-white dark:bg-slate-900">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/15">
            <Blocks className="h-5 w-5 text-sky-300" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-300">
              Backend Signing
            </p>
            <p className="mt-1 text-sm text-slate-200">
              Private key stays on the server. Users never touch MetaMask.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
