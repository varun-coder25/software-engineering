"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, GraduationCap, BriefcaseBusiness } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import { useAuth } from "@/components/AuthProvider";
import {
  getDashboardRoute,
  getRoleEyebrow,
  getRoleLoginSubtitle,
  getRoleLoginTitle,
  getRoleLabel,
  normalizeRole,
  type AppRole
} from "@/lib/roles";
import { supabase } from "@/lib/supabaseClient";

const loginRoles: {
  role: AppRole;
  description: string;
  icon: typeof GraduationCap;
}[] = [
  {
    role: "student",
    description: "Upload certificates, track approvals, and use GPA tools.",
    icon: GraduationCap
  },
  {
    role: "admin",
    description: "Review records, approve submissions, and push verified hashes on-chain.",
    icon: ShieldCheck
  },
  {
    role: "employer",
    description: "Inspect verified academic records and blockchain proof links.",
    icon: BriefcaseBusiness
  }
];

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, isLoading, dashboardRoute } = useAuth();
  const requestedRole = normalizeRole(searchParams.get("role"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<AppRole>(requestedRole);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSelectedRole(requestedRole);
  }, [requestedRole]);

  useEffect(() => {
    if (!isLoading && session) {
      router.replace(dashboardRoute);
    }
  }, [dashboardRoute, isLoading, router, session]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    const actualRole = normalizeRole(data.user?.user_metadata?.role);

    if (actualRole !== selectedRole) {
      await supabase.auth.signOut();
      setError(
        `This account is registered as ${getRoleLabel(actualRole)}. Please use the matching portal card to continue.`
      );
      return;
    }

    setSuccess("Login successful. Redirecting to your dashboard...");
    router.replace(getDashboardRoute(actualRole));
  };

  return (
    <AuthShell
      eyebrow={getRoleEyebrow(selectedRole)}
      title={getRoleLoginTitle(selectedRole)}
      subtitle={getRoleLoginSubtitle(selectedRole)}
      footerLabel="Create an account"
      footerLink="/signup"
      footerText="New to the portal?"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-3">
          {loginRoles.map(({ role, description, icon: Icon }) => (
            <button
              key={role}
              className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${
                selectedRole === role
                  ? "border-blue-500 bg-blue-50 shadow-[0_18px_32px_-24px_rgba(37,99,235,0.45)]"
                  : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
              }`}
              type="button"
              onClick={() => setSelectedRole(role)}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                  selectedRole === role
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-4 text-sm font-semibold text-slate-900">
                {getRoleLabel(role)}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-600">{description}</p>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            className="field"
            type="email"
            placeholder="student@vit.ac.in"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700" htmlFor="password">
              Password
            </label>
            {selectedRole === "admin" ? (
              <span className="text-xs font-medium text-slate-500">
                Admin accounts are provisioned manually
              </span>
            ) : (
              <Link className="text-xs font-medium text-blue-700 hover:text-blue-800" href={`/signup?role=${selectedRole}`}>
                Need an account?
              </Link>
            )}
          </div>
          <input
            id="password"
            className="field"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </p>
        ) : null}

        <button className="button-primary w-full" disabled={submitting} type="submit">
          {submitting ? "Signing in..." : `Login as ${getRoleLabel(selectedRole)}`}
        </button>
      </form>
    </AuthShell>
  );
}
