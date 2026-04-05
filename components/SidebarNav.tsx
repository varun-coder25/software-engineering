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
    <aside className="surface-panel hidden h-[calc(100vh-2rem)] w-[280px] shrink-0 flex-col justify-between overflow-hidden p-6 xl:flex">
      <div className="space-y-8">
        <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 px-6 py-7 text-white shadow-[0_30px_60px_-40px_rgba(2,6,23,0.8)]">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-sky-200/90">
            Student Workspace
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-serif)] text-[2rem] leading-tight text-white">
            Verify records with a cleaner workflow.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-200/88">
            Keep uploads, grade tools, and blockchain status in one calm,
            student-friendly control panel.
          </p>
        </div>

        <nav className="space-y-2.5">
          {navItems.map((item) => {
            const Icon = DASHBOARD_ICONS[item.label];

            return (
              <a
                className={cn(
                  "group flex items-center gap-3 rounded-2xl px-3 py-3.5 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950 hover:shadow-[0_16px_30px_-24px_rgba(15,23,42,0.4)] dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                )}
                href={item.href}
                key={item.href}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-hover:bg-sky-100 group-hover:text-sky-700 dark:bg-slate-900 dark:text-slate-300 dark:group-hover:bg-sky-500/10 dark:group-hover:text-sky-300">
                  <Icon className="h-5 w-5" />
                </span>
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>

      <div className="rounded-[1.75rem] border border-sky-100 bg-gradient-to-br from-white to-sky-50/80 p-4 text-slate-900 shadow-[0_20px_36px_-30px_rgba(14,165,233,0.45)] dark:border-slate-800 dark:from-slate-950 dark:to-slate-900 dark:text-white">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/12">
            <Blocks className="h-5 w-5 text-sky-600 dark:text-sky-300" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">
              Backend Signing
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Private key stays on the server. Users never touch MetaMask.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
