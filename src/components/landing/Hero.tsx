import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesCombined,
  Wallet,
  TrendingUp,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-100 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:py-32">
        {/* Left: Main introduction */}
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
            <TrendingUp size={16} />
            Take control of your finances
          </div>

          <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Manage your money.
            <span className="block text-violet-600">Build your future.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-gray-500">
            Track your income, manage your expenses, and understand your savings
            — all in one simple place.
          </p>

          {/* Call to action */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
            >
              Start Tracking
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-gray-200 px-6 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Sign In
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-400">
            Simple. Personal. Easy to manage.
          </p>
        </div>

        {/* Right: Dashboard preview */}
        <div className="relative">
          <div className="rounded-3xl border border-violet-100 bg-white p-6 shadow-2xl shadow-violet-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Your total savings</p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  ₹26,700
                </h2>
              </div>

              <div className="rounded-2xl bg-violet-100 p-3 text-violet-600">
                <Wallet size={26} />
              </div>
            </div>

            {/* Income and expenses */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-green-50 p-4">
                <p className="text-sm text-gray-500">Income</p>
                <p className="mt-2 text-xl font-bold text-green-700">₹42,000</p>
              </div>

              <div className="rounded-2xl bg-red-50 p-4">
                <p className="text-sm text-gray-500">Expenses</p>
                <p className="mt-2 text-xl font-bold text-red-600">₹15,300</p>
              </div>
            </div>

            {/* Monthly progress preview */}
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">
                  Monthly savings
                </p>

                <span className="text-sm font-semibold text-violet-600">
                  63.6%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-[63.6%] rounded-full bg-violet-600" />
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 border-t border-gray-100 pt-5">
              <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
                <ChartNoAxesCombined size={22} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Your finances, simplified
                </p>
                <p className="text-xs text-gray-500">
                  Track every rupee you earn and spend.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
