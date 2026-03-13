import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";

type DashboardLayoutProps = {
  email?: string;
  children: ReactNode;
};

export default function DashboardLayout({
  email,
  children
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      <Navbar email={email} />
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="glass-panel overflow-hidden p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
                Student Workspace
              </span>
              <div className="space-y-3">
                <h2 className="font-[family-name:var(--font-serif)] text-3xl text-slate-900 sm:text-4xl">
                  Manage certificates and track academic performance in one place.
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  This dashboard is structured for the current student workflow
                  and ready for future additions like blockchain-backed
                  verification, employer access, and administrator review.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[1.75rem] bg-slate-900 p-5 text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-200">
                  Current Module
                </p>
                <p className="mt-2 text-xl font-semibold">
                  Certificate upload + GPA tools
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-blue-100 bg-blue-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-700">
                  Next-ready Architecture
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Swap browser-only uploads with Supabase Storage when the
                  document pipeline is ready.
                </p>
              </div>
            </div>
          </div>
        </section>

        {children}
      </main>
    </div>
  );
}
