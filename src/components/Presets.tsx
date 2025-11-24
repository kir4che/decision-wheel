import React from "react";

import type { Option, PresetConfig, PresetsProps } from "@/types";
import { PRESET_DATA } from "@/data/presets";
import { getNextColor, generateId } from "@/utils/colors";

const Presets: React.FC<PresetsProps> = ({ onSelectPreset, disabled }) => {
  const loadPreset = (preset: PresetConfig) => {
    const newOptions: Option[] =
      preset.options?.map((opt, i) => ({
        id: generateId(),
        label: opt.label,
        weight: opt.weight ?? 1,
        color: getNextColor(i),
      })) ?? [];

    onSelectPreset(newOptions);
  };

  return (
    <section>
      <h3 className="text-sm font-medium text-pink-500 uppercase tracking-wider mb-3">
        Quick Presets
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PRESET_DATA.map((preset) => {
          const Icon = preset.icon;

          return (
            <button
              key={preset.title}
              onClick={() => loadPreset(preset)}
              disabled={disabled}
              className="flex flex-col items-center justify-center gap-2 p-3 bg-white border border-pink-100 rounded-md hover:border-primary hover:shadow-md hover:shadow-pink-100 transition-all text-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="bg-pink-50 p-2 rounded-full">
                <Icon size={16} className="text-primary" />
              </span>
              {preset.title}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Presets;
