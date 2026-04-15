import { useState } from "react";
import AddTransactionForm from "./AddTransactionForm";

const AddTransactionButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end m-2">
        <button
          type="submit"
          onClick={() => setIsModalOpen(!isModalOpen)}
          className=" py-2 px-4 bg-[#004D3A] hover:bg-[#003d2e] disabled:bg-[#004D3A]/50 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          + Add Transaction
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full mx-4">
            {/* Close button */}
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Your form goes here */}
            <AddTransactionForm onSuccess={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default AddTransactionButton;
