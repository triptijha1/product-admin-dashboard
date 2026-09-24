"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    if (!username.trim() || !password) {
      setError("Please enter username and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        username: username.trim(),
        password,
      });

      localStorage.setItem("token", response.data.accessToken);

      router.push("/");
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid md:grid-cols-2">

        {/* LEFT */}
        <div className="hidden md:flex bg-blue-600 p-10 text-white flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                PA
              </div>

              <span className="text-lg font-semibold">
                Product Admin
              </span>
            </div>

            <div className="mt-20">
              <h1 className="text-4xl font-bold leading-tight">
                Manage your products
                <br />
                smarter.
              </h1>

              <p className="mt-5 max-w-md text-blue-100 leading-7">
                Search, filter, edit and manage your inventory
                from one simple dashboard.
              </p>
            </div>
          </div>

          <p className="text-sm text-blue-100">
            Product Admin Dashboard
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-center p-6 sm:p-10 md:p-12">
          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="mb-8 md:hidden">
              <div className="h-11 w-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                PA
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm font-semibold text-blue-600">
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Sign in
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Enter your credentials to continue.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">

              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Username
                </label>

                <input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  autoComplete="username"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

            </form>

            <p className="mt-8 text-center text-xs text-slate-400">
              Secure access to your product dashboard
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}