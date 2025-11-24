export const WHEEL_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#F1948A",
  "#82E0AA",
  "#85C1E9",
];

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const getNextColor = (i: number): string => {
  return WHEEL_COLORS[i % WHEEL_COLORS.length];
};
