import api from "./axios";
import type { Budget, BudgetPayload } from "../types";

export const getBudget = (month: number, year: number) =>
  api
    .get("/budget", { params: { month, year } })
    .then((res) => res.data.budget as Budget);

export const createBudget = (data: BudgetPayload) =>
  api.post("/budget", data).then((res) => res.data.budget as Budget);

export const updateBudget = (id: string, data: Partial<BudgetPayload>) =>
  api.patch(`/budget/${id}`, data).then((res) => res.data.budget as Budget);

export const deleteBudget = (id: string) =>
  api.delete(`/budget/${id}`).then((res) => res.data);
