export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export type TransactionType = "income" | "expense";
export type TransactionCategory =
  | "Food"
  | "Transport"
  | "Housing"
  | "Entertainment"
  | "Salary"
  | "Other";

export interface Transaction {
  _id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  date: string;
  createdAt: string;
}

export interface TransactionPayload {
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description?: string;
  date: string;
}

export interface TransactionFilters {
  type?: TransactionType;
  category?: TransactionCategory;
  startDate?: string;
  endDate?: string;
}

export interface BudgetCategory {
  _id?: string;
  category: TransactionCategory;
  limit: number;
}

export interface Budget {
  _id: string;
  userId: string;
  month: number;
  year: number;
  totalLimit?: number;
  categories: BudgetCategory[];
}

export interface BudgetPayload {
  month: number;
  year: number;
  totalLimit?: number;
  categories: BudgetCategory[];
}
