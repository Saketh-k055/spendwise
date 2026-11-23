"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, PiggyBank, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";
import EditTransactionForm from "@/components/EditTransactionForm";

type Transaction = {
  id: string;
  title: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  date: string;
};

type MonthlyOverviewProps = {
  transactions: Transaction[];
};

export default function MonthlyOverview({
  transactions,
}: MonthlyOverviewProps) {
  // Get the current month as YYYY-MM
  const today = new Date();

  const currentMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}`;

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const router = useRouter();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState("");

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  // Filter transactions for the selected month
  const monthlyTransactions = transactions.filter(
    (transaction) => transaction.date.slice(0, 7) === selectedMonth,
  );

  // Calculate monthly income
  const totalIncome = monthlyTransactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  // Calculate monthly expenses
  const totalExpenses = monthlyTransactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  // Calculate monthly savings
  const totalSavings = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) =>
    amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });

  const summaryCards = [
    {
      title: "Monthly Income",
      amount: formatCurrency(totalIncome),
      icon: TrendingUp,
      color: "text-green-600",
      background: "bg-green-50",
    },
    {
      title: "Monthly Expenses",
      amount: formatCurrency(totalExpenses),
      icon: TrendingDown,
      color: "text-red-600",
      background: "bg-red-50",
    },
    {
      title: "Monthly Savings",
      amount: formatCurrency(totalSavings),
      icon: PiggyBank,
      color: totalSavings >= 0 ? "text-violet-600" : "text-red-600",
      background: totalSavings >= 0 ? "bg-violet-50" : "bg-red-50",
    },
    {
      title: "Transactions",
      amount: monthlyTransactions.length.toString(),
      icon: Receipt,
      color: "text-blue-600",
      background: "bg-blue-50",
    },
  ];

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setDeleteMessage("");

      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        setDeleteMessage(result.message || "Unable to delete transaction.");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      setDeleteMessage("Something went wrong. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }
  return (
    <>
      {/* Month Filter */}
      <section className="mb-6 rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
        <label
          htmlFor="month-filter"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Select Month
        </label>

        <input
          id="month-filter"
          type="month"
          value={selectedMonth}
          max={currentMonth}
          onChange={(event) => setSelectedMonth(event.target.value)}
          className="w-full max-w-xs rounded-xl border border-gray-200 px-4 py-3 text-black text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
        />
      </section>

      {/* Monthly Summary Cards */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <span className={`rounded-xl p-3 ${card.background}`}>
                  <Icon size={22} className={card.color} />
                </span>
              </div>

              <h3 className="mt-5 text-2xl font-bold text-gray-900">
                {card.amount}
              </h3>
            </div>
          );
        })}
      </section>

      {/* Monthly Transactions */}
      <section className="mt-8 rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">
          Monthly Transactions
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Income and expenses for the selected month.
        </p>

        {monthlyTransactions.length === 0 ? (
          <div className="py-12 text-center">
            <Receipt size={40} className="mx-auto text-violet-300" />

            <h3 className="mt-4 font-semibold text-gray-800">
              No transactions this month
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try another month or add a transaction.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {monthlyTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {transaction.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {transaction.category} ·{" "}
                    {new Date(transaction.date).toLocaleDateString("en-IN", {
                      timeZone: "UTC",
                    })}
                  </p>
                </div>

                <p
                  className={`font-bold ${
                    transaction.type === "INCOME"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "INCOME" ? "+" : "-"}
                  {formatCurrency(Number(transaction.amount))}
                </p>
                <button
                  type="button"
                  onClick={() => handleDelete(transaction.id)}
                  disabled={deletingId === transaction.id}
                  className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                  title="Delete transaction"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTransaction(transaction)}
                  className="rounded-lg p-2 text-violet-600 transition hover:bg-violet-50"
                  title="Edit transaction"
                >
                  <Pencil size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
        {editingTransaction && (
          <EditTransactionForm
            transaction={editingTransaction}
            onClose={() => setEditingTransaction(null)}
          />
        )}
      </section>
    </>
  );
}
