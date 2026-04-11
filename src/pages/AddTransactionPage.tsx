import { useState } from "react";

interface TransactionForm {
  type: "income" | "expense";
  amount: string;
  description: string;
  category: string;
}

const AddTransactionPage = () => {
  const [formData, setFormData] = useState<TransactionForm>({
    type: "expense",
    amount: "",
    description: "",
    category: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    console.log("form data", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Type toggle */}
      <div>
        <button
          type="button"
          onClick={() => setFormData((prev) => ({ ...prev, type: "income" }))}
        >
          Income
        </button>
        <button
          type="button"
          onClick={() => setFormData((prev) => ({ ...prev, type: "expense" }))}
        >
          Expense
        </button>
      </div>

      {/* Amount */}
      <div>
        <input
          type="number"
          name="amount"
          placeholder="amount"
          value={formData.amount}
          onChange={handleChange}
        />
      </div>

      {/* Description */}
      <div>
        <input
          type="text"
          name="description"
          placeholder="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      {/* Category */}
      <select name="category" value={formData.category} onChange={handleChange}>
        <option value="">Select category</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Housing">Housing</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Salary">Salary</option>
        <option value="Other">Other</option>
      </select>

      <button type="submit">+ Add Transaction</button>
    </form>
  );
};

export default AddTransactionPage;
