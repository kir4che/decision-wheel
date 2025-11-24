import {
  X,
  Plus,
  AlertCircle,
  Copy,
  Shuffle,
  RefreshCw,
  Trash2,
} from "lucide-react";

import type { Option, OptionListProps } from "@/types";
import { generateId, getNextColor } from "@/utils/colors";

const OptionList = ({ options, setOptions, disabled }: OptionListProps) => {
  const handleAdd = () =>
    setOptions((prev) => {
      const newOption: Option = {
        id: generateId(),
        label: `Option ${prev.length + 1}`,
        weight: 1,
        color: getNextColor(prev.length),
      };

      return [...prev, newOption];
    });

  const handleRemove = (id: string) =>
    setOptions((prev) => prev.filter((o) => o.id !== id));

  const handleCopy = (option: Option) =>
    setOptions((prev) => {
      const newOption: Option = {
        ...option,
        id: generateId(),
      };

      const index = prev.findIndex((o) => o.id === option.id);
      if (index === -1) return [...prev, newOption];

      const updated = [...prev];
      updated.splice(index + 1, 0, newOption);
      return updated;
    });

  const handleShuffle = () =>
    setOptions((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });

  const handleResetWeights = () =>
    setOptions((prev) => prev.map((opt) => ({ ...opt, weight: 1 })));

  const handleClear = () => {
    if (
      typeof window === "undefined" ||
      window.confirm("Clear all options? This cannot be undone.")
    )
      setOptions([]);
  };

  const handleChange = <K extends keyof Option>(
    id: string,
    field: K,
    value: Option[K]
  ) =>
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt))
    );

  return (
    <div className="bg-white rounded-xl shadow-xl shadow-pink-100/50 p-4 sm:p-6 flex flex-col h-full border border-pink-100 transition-colors">
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            Option List
          </h2>
          <button
            onClick={handleAdd}
            disabled={disabled}
            className="flex justify-center items-center gap-1 bg-pink-100 hover:bg-pink-200/65 text-pink-700 size-7 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium border border-transparent"
            aria-label="Add option"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
        <p className="text-xs opacity-50">
          You can set weights from 0 to 10 for each option.
        </p>
      </div>
      {options.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-8 text-pink-500 border-2 border-dashed border-pink-200 rounded-xl">
          <AlertCircle size={32} />
          <p>No options yet. Add one to get started.</p>
        </div>
      )}
      <div className="flex-1 overflow-y-auto max-h-80 pr-2 space-y-2">
        {options.map((opt) => (
          <div
            key={opt.id}
            className="flex items-center gap-3 bg-pink-50/50 p-3 rounded-lg border border-pink-100 transition-all hover:border-primary/50 hover:bg-pink-50"
          >
            <div
              className="w-4 h-12 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: opt.color }}
              title={`Color: ${opt.color}`}
            />
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={opt.label}
                onChange={(e) => handleChange(opt.id, "label", e.target.value)}
                disabled={disabled}
                className="w-full bg-transparent font-medium text-gray-800 placeholder-pink-300 focus:outline-none border-b border-transparent focus:border-primary/50 px-1 transition-colors"
                placeholder="Enter option label"
              />
            </div>
            <div className="ml-auto flex items-end">
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={opt.weight}
                onChange={(e) => {
                  const raw = e.target.value;

                  if (raw === "") {
                    handleChange(opt.id, "weight", 1);
                    return;
                  }

                  const parsed = Number.parseFloat(raw);
                  if (Number.isNaN(parsed)) return;

                  const clamped = Math.min(10, Math.max(0, parsed));
                  handleChange(opt.id, "weight", clamped);
                }}
                disabled={disabled}
                className="w-12 bg-white border border-pink-200 rounded pl-2 py-1 text-sm text-left focus:ring-2 focus:ring-primary/50 outline-none text-gray-700 transition-colors"
              />
            </div>
            <button
              onClick={() => handleCopy(opt)}
              disabled={disabled}
              className="text-pink-400 hover:text-pink-500"
              aria-label="Copy option"
            >
              <Copy size={15} />
            </button>
            <button
              onClick={() => handleRemove(opt.id)}
              disabled={disabled}
              className="text-pink-400 hover:text-pink-500"
              aria-label="Remove option"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 sm:gap-3 ml-auto">
        <button
          type="button"
          onClick={handleShuffle}
          disabled={disabled || options.length <= 1}
          className="flex items-center gap-2 bg-pink-100 hover:bg-pink-200 text-pink-700 px-3 py-2 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-transparent"
        >
          <Shuffle size={16} />
          Shuffle Options
        </button>
        <button
          type="button"
          onClick={handleResetWeights}
          disabled={disabled || options.length === 0}
          className="flex items-center gap-2 bg-pink-100 hover:bg-pink-200 text-pink-700 px-3 py-2 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-transparent"
        >
          <RefreshCw size={16} />
          Reset Weights
        </button>
        <button
          type="button"
          onClick={handleClear}
          disabled={disabled || options.length === 0}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-transparent"
        >
          <Trash2 size={16} />
          Clear Options
        </button>
      </div>
    </div>
  );
};

export default OptionList;
