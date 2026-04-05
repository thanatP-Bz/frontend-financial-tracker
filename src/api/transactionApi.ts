import api from "./axios";
import type {
  Transaction,
  TransactionFilters,
  TransactionPayload,
} from "../types";

export const getTransactions = (filters?: TransactionFilters) =>
  api
    .get("/transactions", { params: filters })
    .then((res) => res.data.transactions as Transaction[]);

export const getTransaction = (id: string) =>
  api.get(`/transactions/${id}`).then((res) => res.data.transaction as Transaction);

export const createTransaction = (data: TransactionPayload) =>
  api.post("/transactions", data).then((res) => res.data.transaction as Transaction);

export const updateTransaction = (
  id: string,
  data: Partial<TransactionPayload>,
) =>
  api.patch(`/transactions/${id}`, data).then((res) => res.data.transaction as Transaction);

export const deleteTransaction = (id: string) =>
  api.delete(`/transactions/${id}`).then((res) => res.data);
