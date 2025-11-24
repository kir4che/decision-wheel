import { MapPin, Utensils, CheckSquare, Briefcase } from "lucide-react";
import type { PresetConfig } from "@/types";

export const PRESET_DATA: PresetConfig[] = [
  {
    title: "Choose Restaurant",
    icon: Utensils,
    options: [
      { label: "Japanese Cuisine" },
      { label: "Korean BBQ" },
      { label: "Pasta" },
      { label: "Hot Pot" },
      { label: "Thai Food" },
      { label: "American Burger" },
      { label: "Buffet" },
    ],
  },
  {
    title: "Task Priority",
    icon: CheckSquare,
    options: [
      { label: "Fix Critical Bug", weight: 5 },
      { label: "Write Documentation", weight: 1 },
      { label: "Develop New Feature", weight: 3 },
      { label: "Refactor Code", weight: 2 },
    ],
  },
  {
    title: "Travel Destinations",
    icon: MapPin,
    options: [
      { label: "Tokyo" },
      { label: "Kyoto" },
      { label: "Seoul" },
      { label: "Bangkok" },
      { label: "Singapore" },
      { label: "London" },
      { label: "New York" },
    ],
  },
  {
    title: "Work Allocation",
    icon: Briefcase,
    options: [
      { label: "Frontend UI" },
      { label: "Backend API" },
      { label: "Database Optimization" },
      { label: "Test Cases" },
      { label: "Deployment Process" },
    ],
  },
];
