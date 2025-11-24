import type { Option } from "@/types";

// 建立一個圓弧 SVG path
export const describeArc = (
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  // 判斷圓弧是否大於 180 度，其需要 large-arc-flag。
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", // 移動到起始座標
    start.x,
    start.y,
    "A", // 畫弧線
    radius,
    radius,
    0, // x-axis-rotation（通常是 0）
    largeArcFlag,
    0, // sweep-flag（方向）
    end.x,
    end.y,
    "L", // 線段連到圓心
    x,
    y,
    "L", // 回起點形成扇形
    start.x,
    start.y,
  ].join(" ");
};

// 將極座標 (r, θ) 轉換為直角座標 (x, y)
const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

// 根據權重隨機挑選一個選項
export const selectWeightedWinner = (options: Option[]): Option | null => {
  // 計算所有選項的總權重，用來決定每一片選項的角度比例。
  const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
  if (totalWeight <= 0) return null;

  // 0 ~ totalWeight 隨機數
  const randomValue = Math.random() * totalWeight;

  let accumulatedWeight = 0;
  // 依序累加權重，當隨機數 <= 累加值則回傳該選項。
  for (const option of options) {
    accumulatedWeight += option.weight;
    if (randomValue <= accumulatedWeight) return option;
  }

  // 基本上不會走到這，但保險起見回傳最後一個選項。
  return options[options.length - 1];
};

// 取得某個選項權重對應的扇形角度
export const getOptionCenterAngle = (
  options: Option[],
  targetId: string
): number => {
  const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);

  let currentAngle = 0;
  for (const option of options) {
    const sliceAngle = (option.weight / totalWeight) * 360;

    if (option.id === targetId) return currentAngle + sliceAngle / 2;
    currentAngle += sliceAngle;
  }

  // 找不到 ID 則預設回傳 0 度
  return 0;
};

// normalize angle to [0, 360)
const normalizeAngle = (angle: number): number => {
  const remainder = angle % 360;
  return remainder < 0 ? remainder + 360 : remainder;
};

// 根據目前旋轉角度取得指針位置上的選項
export const getOptionByRotation = (
  options: Option[],
  rotation: number
): Option | null => {
  if (options.length === 0) return null;

  const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
  if (totalWeight <= 0) return null;

  const pointerAngle = normalizeAngle(-rotation);
  let currentAngle = 0;

  for (const option of options) {
    const sliceAngle = (option.weight / totalWeight) * 360;
    const nextAngle = currentAngle + sliceAngle;

    if (pointerAngle >= currentAngle && pointerAngle < nextAngle) {
      return option;
    }

    currentAngle = nextAngle;
  }

  return options[options.length - 1];
};
