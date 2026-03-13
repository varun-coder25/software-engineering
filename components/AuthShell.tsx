import type { ReactNode } from "react";
import Link from "next/link";

type AuthShellProps = {
  title: string;
  subtitle: string;
  footerLabel: string;
  footerLink: string;
  footerText: string;
  children: ReactNode;
};

export default function AuthShell({
  title,
  subtitle,
  footerLabel,
  footerLink,
  footerText,
  children
}: AuthShellProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 bg-hero-grid" />
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden rounded-[2rem] border border-white/60 bg-slate-900/90 p-10 text-white shadow-2xl lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-blue-200">
              Academic Verification System
            </p>
            <div className="space-y-4">
              <h1 className="max-w-xl font-[family-name:var(--font-serif)] text-5xl leading-tight">
                VIT Academic Certificate & GPA Portal
              </h1>
              <p className="max-w-lg text-base leading-7 text-slate-300">
                A polished student-facing entry point for secure academic
                workflows, built to grow into blockchain verification, employer
                access, and admin review modules.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-blue-200">
                Deployable
              </p>
              <p className="mt-3 text-sm text-slate-200">
                Ready for Vercel with environment-based Supabase setup.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-blue-200">
                Modular
              </p>
              <p className="mt-3 text-sm text-slate-200">
                Clear component boundaries for future verification features.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-blue-200">
                Student-first
              </p>
              <p className="mt-3 text-sm text-slate-200">
                Quick upload flows and automated academic calculations.
              </p>
            </div>
          </div>
        </section>

        <section className="glass-panel relative overflow-hidden p-6 sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400" />
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
              Student Access
            </p>
            <h2 className="font-[family-name:var(--font-serif)] text-3xl text-slate-900">
              {title}
            </h2>
            <p className="text-sm leading-6 text-slate-600">{subtitle}</p>
          </div>

          <div className="mt-8">{children}</div>

          <p className="mt-6 text-sm text-slate-600">
            {footerText}{" "}
            <Link className="font-semibold text-blue-700 hover:text-blue-800" href={footerLink}>
              {footerLabel}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
