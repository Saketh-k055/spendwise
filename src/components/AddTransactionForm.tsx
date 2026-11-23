"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TransactionType = "INCOME" | "EXPENSE";

export default function AddTransactionForm() {
  const router = useRouter();

  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    const localDate = new Date(
      today.getTime() - today.getTimezoneOffset() * 60000,
    );
    return localDate.toISOString().slice(0, 10);
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const categories =
    type === "INCOME"
      ? ["Salary", "Freelance", "Business", "Investment", "Other"]
      : [
          "Food",
          "Transport",
          "Shopping",
          "Bills",
          "Entertainment",
          "Health",
          "Education",
          "Other",
        ];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          amount,
          type,
          category,
          date,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Unable to add transaction.");
        return;
      }

      setMessage("Transaction added successfully!");

      // Clear the form
      setTitle("");
      setAmount("");
      setCategory("");

      // Refresh dashboard data
      router.refresh();
    } catch (error) {
      console.error("Transaction error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">Add a Transaction</h2>

      <p className="mt-1 text-sm text-gray-500">
        Record your income or expenses.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Transaction Type */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Transaction Type
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setType("INCOME");
                setCategory("");
              }}
              className={`rounded-xl border py-3 font-semibold transition ${
                type === "INCOME"
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-gray-200 text-gray-500"
              }`}
            >
              Income
            </button>

            <button
              type="button"
              onClick={() => {
                setType("EXPENSE");
                setCategory("");
              }}
              className={`rounded-xl border py-3 font-semibold transition ${
                type === "EXPENSE"
                  ? "border-violet-600 bg-violet-50 text-violet-700"
                  : "border-gray-200 text-gray-500"
              }`}
            >
              Expense
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="transaction-title"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Transaction Title
          </label>

          <input
            id="transaction-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Monthly Salary or Groceries"
            required
            maxLength={100}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-black text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
          />
        </div>

        {/* Amount */}
        <div>
          <label
            htmlFor="transaction-amount"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Amount (₹)
          </label>

          <input
            id="transaction-amount"
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Enter amount"
            min="0.01"
            step="0.01"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-black text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="transaction-category"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Category
          </label>

          <select
            id="transaction-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-black text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
          >
            <option value="">Select category</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="transaction-date"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Date
          </label>

          <input
            id="transaction-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-black text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-violet-600 py-3.5 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : "Add Transaction"}
        </button>

        {/* Message */}
        {message && (
          <p
            role="status"
            className="rounded-lg bg-violet-50 p-3 text-sm text-violet-700"
          >
            {message}
          </p>
        )}
      </form>
    </section>
  );
}
