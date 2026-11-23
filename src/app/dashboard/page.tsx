export const instant = false;
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import AddTransactionForm from "@/components/AddTransactionForm";
import { prisma } from "@/lib/prisma";
import MonthlyOverview from "@/components/MonthlyOverview";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Receipt,
} from "lucide-react";
export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch transactions belonging to the logged-in user
  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      date: "desc",
    },
  });

  const formattedTransactions = transactions.map((transaction) => ({
    id: transaction.id,
    title: transaction.title,
    amount: transaction.amount.toString(),
    type: transaction.type,
    category: transaction.category,
    date: transaction.date.toISOString(),
  }));

  // Calculate total income
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  // Calculate total expenses
  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  // Calculate savings
  const totalSavings = totalIncome - totalExpenses;

  // Total number of transactions
  const totalTransactions = transactions.length;

  // Format amounts in Indian Rupees
  const formatCurrency = (amount: number) =>
    amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });

  const summaryCards = [
    {
      title: "Total Income",
      amount: formatCurrency(totalIncome),
      icon: TrendingUp,
      color: "text-green-600",
      background: "bg-green-50",
    },
    {
      title: "Total Expenses",
      amount: formatCurrency(totalExpenses),
      icon: TrendingDown,
      color: "text-red-600",
      background: "bg-red-50",
    },
    {
      title: "Total Savings",
      amount: formatCurrency(totalSavings),
      icon: PiggyBank,
      color: totalSavings >= 0 ? "text-violet-600" : "text-red-600",
      background: totalSavings >= 0 ? "bg-violet-50" : "bg-red-50",
    },
    {
      title: "Transactions",
      amount: totalTransactions.toString(),
      icon: Receipt,
      color: "text-blue-600",
      background: "bg-blue-50",
    },
  ];

  return (
    <main className="min-h-screen bg-violet-50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-violet-600 p-3 text-white">
              <Wallet size={24} />
            </span>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">SpendWise</h1>
              <p className="text-sm text-gray-500">Personal Finance Tracker</p>
            </div>
          </div>

          <LogoutButton />
        </header>

        {/* Welcome */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user.name}!
          </h2>

          <p className="mt-2 text-gray-500">Here is your financial overview.</p>
        </section>
        {/* Add Income or Expense */}
        <AddTransactionForm />

        {/* Monthly Summary and Transaction History */}
        <MonthlyOverview transactions={formattedTransactions} />
      </div>
    </main>
  );
}
