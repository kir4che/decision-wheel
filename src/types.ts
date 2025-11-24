import type { LucideIcon } from "lucide-react";

import type { MutableRefObject } from "react";

export interface WheelProps {
  options: Option[];
  rotation: number;
  isSpinning: boolean;
  onSpinEnd: () => void;
  pointerRef?: MutableRefObject<HTMLDivElement | null>;
}

export interface Option {
  id: string;
  label: string;
  weight: number;
  color?: string;
}

export interface OptionListProps {
  options: Option[];
  setOptions: React.Dispatch<React.SetStateAction<Option[]>>;
  disabled?: boolean;
}

interface PresetOption {
  label: string;
  weight?: number;
}

export interface PresetConfig {
  title: string;
  icon: LucideIcon;
  items?: string[];
  options?: PresetOption[];
}

export interface PresetsProps {
  onSelectPreset: (options: Option[]) => void;
  disabled: boolean;
}
