"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Wallet, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setIsError(false);

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      setLoading(true);

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setIsError(true);
        setMessage("Invalid email or password.");
        return;
      }

      setMessage("Login successful! Redirecting...");

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);

      setIsError(true);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-violet-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-violet-100 bg-white p-8 shadow-xl shadow-violet-100/60 sm:p-10">
        {/* Brand */}
        <Link href="/" className="mb-8 inline-flex items-center gap-2">
          <span className="rounded-xl bg-violet-600 p-2 text-white">
            <Wallet size={22} />
          </span>
          <span className="text-xl font-bold text-gray-900">
            Spend<span className="text-violet-600">Wise</span>
          </span>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>

        <p className="mt-2 text-sm text-gray-500">
          Sign in to continue managing your finances.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="w-full text-black rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="w-full text-black rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 py-3.5 font-semibold text-white transition hover:bg-violet-700"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {message && (
            <p
              role="status"
              className={`rounded-lg p-3 text-sm ${
                isError
                  ? "bg-red-50 text-red-700"
                  : "bg-violet-50 text-violet-700"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <p className="mt-7 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-violet-600 hover:text-violet-700"
          >
            Create account
          </Link>
        </p>

        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-violet-600"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </div>
    </main>
  );
}
