import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { X } from "lucide-react";
import { createBudget, updateBudget } from "../../api/budgetApi";
import type { Budget, TransactionCategory } from "../../types";

interface BudgetFormProps {
  budget: Budget | null;
  editCategory: string | null;
  month: number;
  year: number;
  onClose: () => void;
}

const BudgetForm = ({
  budget,
  editCategory,
  month,
  year,
  onClose,
}: BudgetFormProps) => {
  const queryClient = useQueryClient();

  const [category, setCategory] = useState<TransactionCategory | "">("");
  const [limit, setLimit] = useState<string>("");

  return <div>BudgetForm</div>;
};

export default BudgetForm;
