import type { BudgetProgress } from "../../hooks/useBudgetProgress";

interface BudgetCardProps {
  progress: BudgetProgress;
  onEdit: (category: string) => void;
  onDelete: (category: string) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  Food: "🍔",
  Transport: "🚗",
  Housing: "🏠",
  Entertainment: "🎬",
  Salary: "💰",
  Other: "📦",
};

const STATUS_CONFIG = {
  ok: {
    bar: "bg-[#5DBFC0]",
    text: "text-[#0F6E56]",
    badge: "bg-[#E1F5EE] text-[#0F6E56]",
    label: "On track",
  },
  warn: {
    bar: "bg-[#EF9F27]",
    text: "text-[#BA7517]",
    badge: "bg-[#FAEEDA] text-[#854F0B]",
    label: "Nearing limit",
  },
  over: {
    bar: "bg-[#E24B4A]",
    text: "text-[#A32D2D]",
    badge: "bg-[#FCEBEB] text-[#A32D2D]",
    label: "Over budget",
  },
};

const BudgetCard = ({ progress, onEdit, onDelete }: BudgetCardProps) => {
  const { category, limit, spent, remaining, percent, status } = progress;
  const config = STATUS_CONFIG[status];
  const clampedPercent = Math.min(percent, 100);

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm flex flex-col gap-3">
      {/* Top row — icon, name, actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{CATEGORY_ICONS[category]}</span>
          <span className="text-sm font-medium text-gray-800">{category}</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(category)}
            className="text-xs text-gray-400 hover:text-[#0892a5] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md transition-colors cursor-pointer"
          >
            edit
          </button>
          <button
            onClick={() => onDelete(category)}
            className="text-xs text-gray-400 hover:text-[#e6748e] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md transition-colors cursor-pointer"
          >
            del
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${config.bar}`}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>

      {/* Amounts row */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-gray-800">
            ${spent.toFixed(2)}
          </span>
          <span className="text-xs text-gray-400"> spent</span>
        </div>
        <span className={`text-xs font-semibold ${config.text}`}>
          {percent.toFixed(0)}%
        </span>
      </div>

      {/* Limit + remaining */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          limit: ${limit.toFixed(2)}
        </span>
        <span className={`text-xs ${config.text}`}>
          {remaining >= 0
            ? `$${remaining.toFixed(2)} left`
            : `over by $${Math.abs(remaining).toFixed(2)}`}
        </span>
      </div>

      {/* Status badge */}
      <span
        className={`text-xs px-2 py-0.5 rounded-full w-fit ${config.badge}`}
      >
        {config.label}
      </span>
    </div>
  );
};

export default BudgetCard;
