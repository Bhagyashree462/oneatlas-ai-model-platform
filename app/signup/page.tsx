
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.session) {
        router.push("/playground");
        router.refresh();
      } else {
        setMessage(
          "Account created successfully! Please check your email and click the verification link."
        );
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#080b14] px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-8 shadow-2xl">

        <h1 className="text-3xl font-bold text-center">
          Create Account
        </h1>

        <p className="mt-2 text-center text-gray-400">
          Join OneAtlas AI
        </p>

        <form onSubmit={handleSignup} className="mt-8 space-y-5">

          <div>
            <label className="mb-2 block text-sm">
              Full Name
            </label>

            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoComplete="name"
              className="w-full rounded-lg border border-white/10 bg-[#080b14] p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Email
            </label>

            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              className="w-full rounded-lg border border-white/10 bg-[#080b14] p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Password
            </label>

            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
              className="w-full rounded-lg border border-white/10 bg-[#080b14] p-3 outline-none focus:border-blue-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          {message && (
            <p className="text-sm text-green-400">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </main>
  );
}
