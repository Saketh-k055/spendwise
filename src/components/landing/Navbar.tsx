import Link from "next/link";
import { Wallet } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-xl bg-violet-600 p-2 text-white">
            <Wallet size={22} />
          </div>

          <span className="text-xl font-bold tracking-tight text-gray-900">
            Spend<span className="text-violet-600">Wise</span>
          </span>
        </Link>

        {/* Navigation links */}
        <div className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
          <a href="#features" className="hover:text-violet-600">
            Features
          </a>

          <a href="#about" className="hover:text-violet-600">
            About
          </a>
        </div>

        {/* Authentication buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-violet-50 sm:block"
          >
            Sign In
          </Link>

          <Link
            href="/signup"
            className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
