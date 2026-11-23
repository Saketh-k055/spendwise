
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

type Transaction = {
  id: string;
  title: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  date: string;
};

type EditTransactionFormProps = {
  transaction: Transaction;
  onClose: () => void;
};

export default function EditTransactionForm({
  transaction,
  onClose,
}: EditTransactionFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(transaction.title);
  const [amount, setAmount] = useState(transaction.amount);
  const [type, setType] = useState<"INCOME" | "EXPENSE">(
    transaction.type
  );
  const [category, setCategory] = useState(transaction.category);
  const [date, setDate] = useState(
    transaction.date.slice(0, 10)
  );

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

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      const response = await fetch(
        `/api/transactions/${transaction.id}`,
        {
          method: "PUT",
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
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage(
          result.message || "Unable to update transaction."
        );
        return;
      }

      onClose();
      router.refresh();
    } catch (error) {
      console.error("Update transaction error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Edit Transaction
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
            aria-label="Close edit form"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Transaction Type
            </label>

            <select
              value={type}
              onChange={(event) => {
                setType(event.target.value as "INCOME" | "EXPENSE");
                setCategory("");
              }}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-black outline-none focus:border-violet-500"
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-black outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Amount (₹)
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-black outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Category
            </label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-black outline-none focus:border-violet-500"
            >
              <option value="">Select category</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-black outline-none focus:border-violet-500"
            />
          </div>

          {message && (
            <p role="alert" className="text-sm text-red-600">
              {message}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-gray-200 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
