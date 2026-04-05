import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import SidebarNav, { type SidebarNavItem } from "@/components/SidebarNav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardLayoutProps = {
  email?: string;
  eyebrow: string;
  title: string;
  description: string;
  navItems: SidebarNavItem[];
  highlights?: {
    label: string;
    title: string;
    description: string;
  }[];
  children: ReactNode;
};

export default function DashboardLayout({
  email,
  eyebrow,
  title,
  description,
  navItems,
  highlights = [
    {
      label: "Certificate Layer",
      title: "SHA-256 + Sepolia",
      description:
        "Upload a file, generate a cryptographic hash in the browser, and store it from secure API routes signed by a backend wallet."
    },
    {
      label: "Student Tools",
      title: "GPA + CGPA preserved",
      description:
        "Existing VIT calculators stay intact while the UI shifts to a cleaner, more product-like control surface."
    }
  ],
  children
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1440px] gap-6 xl:items-start">
        <SidebarNav navItems={navItems} />

        <main className="min-w-0 flex-1 space-y-6">
          <Navbar email={email} />

          <section className="overview-grid" id="overview">
            <Card className="min-w-0 overflow-hidden border-sky-100/70 bg-gradient-to-br from-white via-white to-sky-50/70">
              <CardHeader className="space-y-4 p-7 sm:p-8">
                <Badge className="w-fit" variant="default">
                  {eyebrow}
                </Badge>
                <CardTitle className="max-w-3xl font-[family-name:var(--font-serif)] text-3xl leading-tight text-slate-950 sm:text-[3.25rem]">
                  {title}
                </CardTitle>
                <p className="max-w-3xl text-base leading-8 text-slate-600">
                  {description}
                </p>
              </CardHeader>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              {highlights.map((highlight) => (
                <Card
                  className="min-w-0 border-slate-200/80 bg-white/92 transition-transform duration-300 hover:-translate-y-1"
                  key={highlight.title}
                >
                  <CardHeader className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
                      {highlight.label}
                    </p>
                    <CardTitle className="text-[1.8rem] leading-tight text-slate-900">
                      {highlight.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 text-sm leading-7 text-slate-600">
                    {highlight.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {children}
        </main>
      </div>
    </div>
  );
}
