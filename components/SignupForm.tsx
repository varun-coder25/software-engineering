"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import { useAuth } from "@/components/AuthProvider";
import { APP_ROLES, getDashboardRoute, getRoleLabel, normalizeRole, type AppRole } from "@/lib/roles";
import { supabase } from "@/lib/supabaseClient";

export default function SignupForm() {
  const router = useRouter();
  const { session, isLoading, dashboardRoute } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<AppRole>("student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      title="Create your account"
      subtitle="Set up secure access for certificate uploads and academic performance tools."
      footerLabel="Back to login"
      footerLink="/login"
      footerText="Already registered?"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
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
            onChange={(event) => setRole(event.target.value as AppRole)}
          >
            {APP_ROLES.map((roleOption) => (
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
