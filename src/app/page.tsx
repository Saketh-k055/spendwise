
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* Landing page navigation */}
      <Navbar />

      {/* Main introduction section */}
      <Hero />

      {/* Features section */}
      <section id="features" className="bg-violet-50/50 px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything you need to manage money
            </h2>

            <p className="mt-4 text-gray-500">
              Simple tools to help you understand your financial habits.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">

            <Feature
              title="Track Income"
              description="Record your salary, freelance earnings, and other income sources."
            />

            <Feature
              title="Manage Expenses"
              description="Manually record your daily expenses and organize them by category."
            />

            <Feature
              title="Calculate Savings"
              description="Automatically calculate your monthly savings from income and expenses."
            />

          </div>
        </div>
      </section>

      {/* About section */}
      <section id="about" className="px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Take control of your money with SpendWise.
        </h2>

        <p className="mt-3 text-gray-500">
          A simple personal finance tracker designed for everyday life.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        © 2026 SpendWise. Personal finance made simple.
      </footer>

    </main>
  );
}

// Reusable feature card
function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-100">
      <div className="mb-5 h-2 w-12 rounded-full bg-violet-500" />

      <h3 className="text-lg font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-gray-500">
        {description}
      </p>
    </div>
  );
}
