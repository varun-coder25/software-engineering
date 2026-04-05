"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BriefcaseBusiness, GraduationCap } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import { useAuth } from "@/components/AuthProvider";
import {
  PUBLIC_SIGNUP_ROLES,
  getDashboardRoute,
  getRoleEyebrow,
  getRoleLabel,
  normalizeRole,
  type PublicSignupRole
} from "@/lib/roles";
import { supabase } from "@/lib/supabaseClient";

const signupRoles: {
  role: PublicSignupRole;
  description: string;
  icon: typeof GraduationCap;
}[] = [
  {
    role: "student",
    description: "For students submitting certificates and using GPA tools.",
    icon: GraduationCap
  },
  {
    role: "employer",
    description: "For recruiters viewing institution-verified student records.",
    icon: BriefcaseBusiness
  }
];

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, isLoading, dashboardRoute } = useAuth();
  const requestedRole = normalizeRole(searchParams.get("role"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<PublicSignupRole>(
    requestedRole === "employer" ? "employer" : "student"
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setRole(requestedRole === "employer" ? "employer" : "student");
  }, [requestedRole]);

  useEffect(() => {
    if (!isLoading && session) {
      router.replace(dashboardRoute);
    }
  }, [dashboardRoute, isLoading, router, session]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role
        }
      }
    });

    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      router.replace(getDashboardRoute(normalizeRole(data.user?.user_metadata?.role)));
      return;
    }

    setSuccess(
      "Account created successfully. If email confirmation is enabled in Supabase, please verify your inbox before logging in."
    );
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <AuthShell
      eyebrow={getRoleEyebrow(role)}
      title="Create your account"
      subtitle="Public signup is available for students and employers. Admin access is provisioned manually by the institution."
      footerLabel="Back to login"
      footerLink="/login"
      footerText="Already registered?"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          {signupRoles.map(({ role: roleOption, description, icon: Icon }) => (
            <button
              key={roleOption}
              className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${
                role === roleOption
                  ? "border-blue-500 bg-blue-50 shadow-[0_18px_32px_-24px_rgba(37,99,235,0.45)]"
                  : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
              }`}
              type="button"
              onClick={() => setRole(roleOption)}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                  role === roleOption
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-4 text-sm font-semibold text-slate-900">
                {getRoleLabel(roleOption)}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-600">{description}</p>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Admin signup is disabled here. Create admin users directly in Supabase so only authorized college staff can access the admin dashboard.
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
          <label className="text-sm font-semibold text-slate-700" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            className="field"
            value={role}
            onChange={(event) => setRole(event.target.value as PublicSignupRole)}
          >
            {PUBLIC_SIGNUP_ROLES.map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {getRoleLabel(roleOption)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="field"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="confirm-password">
            Confirm password
          </label>
          <input
            id="confirm-password"
            className="field"
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={6}
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
          {submitting ? "Creating account..." : "Sign up"}
        </button>
      </form>
    </AuthShell>
  );
}
