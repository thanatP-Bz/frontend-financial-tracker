import api from './axios';
import type { Transaction, TransactionPayload } from '../types';

export const getTransactions = () =>
  api.get<Transaction[]>('/transactions').then((res) => res.data);

export const getTransaction = (id: number) =>
  api.get<Transaction>(`/transactions/${id}`).then((res) => res.data);

export const createTransaction = (data: TransactionPayload) =>
  api.post<Transaction>('/transactions', data).then((res) => res.data);

export const updateTransaction = (id: number, data: TransactionPayload) =>
  api.put<Transaction>(`/transactions/${id}`, data).then((res) => res.data);

export const deleteTransaction = (id: number) =>
  api.delete(`/transactions/${id}`);
