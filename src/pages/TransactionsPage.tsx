import { toast } from "sonner";
import { deleteTransaction, getTransactions } from "../api/transactionApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { SquarePen } from "lucide-react";
import { X } from "lucide-react";
import type { Transaction } from "../types";
import EditTransactionForm from "../components/forms/EditTransactionForm";
import AddTransactionButton from "../components/AddTransactionButton";

const TransactionsPage = () => {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  /* filter options */
  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Income", value: "income" },
    { label: "Expenses", value: "expense" },
  ] as const;

  /* category options */
  const categoryOptions = [
    { label: "Food", value: "Food", icon: "🍔" },
    { label: "Transport", value: "Transport", icon: "🚗" },
    { label: "Housing", value: "Housing", icon: "🏠" },
    { label: "Entertainment", value: "Entertainment", icon: "🎬" },
    { label: "Salary", value: "Salary", icon: "💰" },
    { label: "Other", value: "Other", icon: "📦" },
  ] as const;

  const queryClient = useQueryClient();

  //fetch data
  const {
    data: transaction,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(),
  });

  /* filter */
  const filteredTransactions = transaction?.filter((t) => {
    const matchesType = filter === "all" || t.type === filter;
    const matchesSearch = t.description
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || t.category === categoryFilter;
    return matchesType && matchesSearch && matchesCategory;
  });

  /* delete function */
  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`transactions`] });
      toast.success("Transaction deleted");
    },
    onError: () => toast.error("Failed to delete transaction"),
  });

  /* delete handle */
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  //show toast message
  useEffect(() => {
    if (error) {
      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response?.data?.message || "Failed to load transactions";
      toast.error(message);
    }
  }, [error]);

  return (
    <div>
      {isLoading && <p>is loading...</p>}

      {!isLoading && (
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Transactions</h1>
            <AddTransactionButton />
          </div>
          <div className="bg-white p-2 rounded-lg">
            {/* Search Bar */}
            <div className="relative mx-2 mt-2 mb-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search transactions..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-[#fdf6f0] border border-[#edd5c0] rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e6748e]/40 focus:border-[#e6748e] transition-all"
              />
            </div>

            {/* transactions filter */}
            <div className="flex m-2 p-2 gap-x-2 border-b border-gray-200">
              {filterOptions.map((option) => {
                console.log(option);
                return (
                  <div key={option.value}>
                    <button
                      onClick={() => {
                        setFilter(option.value);
                        if (option.value === "all") {
                          setCategoryFilter("all");
                        }
                      }}
                      className={`px-3 py-2 text-sm font-medium  rounded-lg cursor-pointer ${
                        option.value === "all"
                          ? "bg-[#e6748e] text-white"
                          : option.value === "income"
                            ? "bg-[#92ada4] text-white"
                            : "bg-[#f1a805]/40 text-[#84572f]"
                      }`}
                    >
                      {option.label}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Category filter - Mobile: Dropdown, Desktop: Buttons */}
            <div className="m-2 p-2 border-b border-gray-200">
              {/* Mobile dropdown */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="md:hidden w-full px-3 py-2 text-sm bg-[#fdf6f0] border border-[#edd5c0] rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#e6748e]/40 focus:border-[#e6748e]"
              >
                <option value="all">All Categories</option>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>

              {/* Desktop buttons */}
              <div className="hidden md:flex gap-x-2">
                {categoryOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setCategoryFilter(option.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      categoryFilter === option.value
                        ? "bg-[#e6748e] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option.icon && <span>{option.icon}</span>}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredTransactions?.length === 0 ? (
              <div className="bg-white rounded-lg p-8 shadow text-center m-4">
                <p className="text-gray-500">
                  {query
                    ? `No results for "${query}"`
                    : filter === "all"
                      ? "No transactions yet"
                      : filter === "income"
                        ? "No income transactions yet"
                        : "No expense transactions yet"}
                </p>
                {!query && (
                  <p className="text-sm text-gray-400 mt-1">
                    Add your first {filter === "all" ? "transaction" : filter}{" "}
                    to get started
                  </p>
                )}
              </div>
            ) : (
              /* transaction lists */
              <ul className="space-y-3 m-4">
                {filteredTransactions?.map((transaction) => (
                  <li key={transaction._id}>
                    <div
                      className={`flex items-center justify-between rounded-lg p-3 ${
                        transaction.type === "income"
                          ? "bg-[#92ada4]/50"
                          : "bg-[#edd5c0]"
                      }`}
                    >
                      {/* Left side - icon and details */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Category icon */}
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-base md:text-lg bg-white shrink-0">
                          {transaction.category === "Food" && "🍔"}
                          {transaction.category === "Transport" && "🚗"}
                          {transaction.category === "Housing" && "🏠"}
                          {transaction.category === "Entertainment" && "🎬"}
                          {transaction.category === "Salary" && "💰"}
                          {transaction.category === "Other" && "📦"}
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm text-gray-800 truncate">
                            {transaction.description &&
                            transaction.description !== transaction.category
                              ? transaction.description
                              : transaction.category}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Right side - amount and actions */}
                      <div className="flex items-center gap-2 md:gap-3 shrink-0">
                        <p
                          className={`font-bold text-sm md:text-base ${
                            transaction.type === "income"
                              ? "text-[#84572f]"
                              : "text-white"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}$
                          {transaction.amount.toFixed(2)}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-0.5 md:gap-1">
                          <button
                            aria-label="Edit transaction"
                            className="p-1.5 md:p-2 text-gray-400 hover:text-[#004D3A] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            onClick={() => setEditingTransaction(transaction)}
                          >
                            <SquarePen size={18} className="md:w-6 md:h-6" />
                          </button>
                          <button
                            aria-label="Delete transaction"
                            className="p-1.5 md:p-2 text-gray-400 hover:text-[#d64a17] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            onClick={() => handleDelete(transaction._id)}
                          >
                            <Trash2 size={18} className="md:w-6 md:h-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* edit form */}
      {editingTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full mx-4">
            <div className="flex justify-end">
              <button
                onClick={() => setEditingTransaction(null)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <EditTransactionForm
              transaction={editingTransaction}
              onSuccess={() => setEditingTransaction(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
