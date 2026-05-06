import { ChevronDown, Pencil, Trash2, Plus, X } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const BudgetPage = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Budget</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-[#0892a5] text-white rounded-lg hover:bg-[#0892a5]/90 transition-colors cursor-pointer">
            <Pencil size={14} />
            Edit
          </button>
          <button type="button" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>

      {/* Month / Year selectors */}
      <div className="flex gap-3 mb-6">
        <div className="relative">
          <select className="px-4 py-2 pr-8 text-sm font-medium bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0892a5]/50 appearance-none">
            {MONTHS.map((m, i) => (
              <option key={i + 1} value={i + 1}>{m}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
        <div className="relative">
          <select className="px-4 py-2 pr-8 text-sm font-medium bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0892a5]/50 appearance-none">
            <option>2025</option>
            <option>2026</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Budget content */}
      <div className="space-y-4">
        {/* Total progress card */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-700">Total Budget</span>
            <span className="text-sm text-gray-500">$0.00 / $0.00</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-300 bg-[#0892a5]"
              style={{ width: "0%" }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1 text-right">$0.00 remaining</p>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" />
      </div>

      {/* No budget */}
      <div className="bg-white rounded-lg p-8 shadow text-center">
        <p className="text-gray-500 mb-1">No budget</p>
        <p className="text-sm text-gray-400 mb-4">Set a budget to track your spending</p>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#0892a5] text-white text-sm font-medium rounded-lg hover:bg-[#0892a5]/90 transition-colors cursor-pointer">
          <Plus size={16} />
          Create Budget
        </button>
      </div>

      {/* Modal */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-sm w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-end p-3 pb-0">
            <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
