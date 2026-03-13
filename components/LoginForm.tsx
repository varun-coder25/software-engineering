"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabaseClient";

export default function LoginForm() {
  const router = useRouter();
  const { session, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && session) {
      router.replace("/dashboard");
    }
  }, [isLoading, router, session]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    setSuccess("Login successful. Redirecting to your dashboard...");
    router.replace("/dashboard");
  };

  return (
    <AuthShell
      title="Login to continue"
      subtitle="Access your academic dashboard, certificate upload workspace, and grade calculators."
      footerLabel="Create an account"
      footerLink="/signup"
      footerText="New to the portal?"
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
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700" htmlFor="password">
              Password
            </label>
            <Link className="text-xs font-medium text-blue-700 hover:text-blue-800" href="/signup">
              Need an account?
            </Link>
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
          {submitting ? "Signing in..." : "Login"}
        </button>
      </form>
    </AuthShell>
  );
}
