import React from "react";

import type { WheelProps } from "@/types";
import { describeArc } from "@/utils/mathUtils";

const Wheel: React.FC<WheelProps> = ({
  options,
  rotation,
  isSpinning,
  onSpinEnd,
  pointerRef,
}) => {
  const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);

  const size = 300;
  const center = size / 2;
  const radius = size / 2 - 10;

  let currentAngle = 0;
  const slices = options.map((option) => {
    const sliceAngle =
      totalWeight > 0 ? (option.weight / totalWeight) * 360 : 0;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    const midAngle = startAngle + sliceAngle / 2; // 扇形中心角度

    // 計算文字在圓上的 X/Y 座標
    const textRadius = radius * 0.65;
    const textX =
      center + textRadius * Math.cos(((midAngle - 90) * Math.PI) / 180);
    const textY =
      center + textRadius * Math.sin(((midAngle - 90) * Math.PI) / 180);

    currentAngle += sliceAngle; // 目前累積的角度

    return {
      ...option,
      path: describeArc(center, center, radius, startAngle, endAngle),
      textX,
      textY,
      rotation: midAngle,
    };
  });

  return (
    <div className="relative size-75">
      {/* 輪盤上的指針 */}
      <div
        ref={pointerRef}
        className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="size-0 border-l-15 border-l-transparent border-r-15 border-r-transparent border-t-25 border-t-pink-700 filter drop-shadow" />
      </div>
      {/* 輪盤內容 */}
      <div
        className="size-full"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning
            ? "transform 4s cubic-bezier(0.2, 0.8, 0.1, 1)"
            : "none",
        }}
        onTransitionEnd={onSpinEnd}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform drop-shadow rounded-full"
        >
          {/* 底部 */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            className="fill-pink-300"
          />
          {/* 當選項只有一個時，畫滿整個圓 */}
          {options.length === 1 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill={options[0].color}
            />
          )}
          {/* 各選項扇形切片 */}
          {options.length > 0 &&
            slices.map((slice) => (
              <g key={slice.id}>
                {options.length > 1 && (
                  <path
                    d={slice.path}
                    fill={slice.color}
                    stroke="white"
                    strokeWidth={2}
                  />
                )}
                <text
                  x={slice.textX}
                  y={slice.textY}
                  fill="white"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={12}
                  fontWeight="600"
                  style={{
                    textShadow: "0px 1px 2px rgba(0,0,0,0.25)",
                    transformBox: "fill-box",
                    transformOrigin: "center",
                    transform:
                      options.length > 2
                        ? `rotate(${slice.rotation}deg)`
                        : "none",
                  }}
                >
                  {slice.label.length > 10
                    ? `${slice.label.substring(0, 10)}..`
                    : slice.label}
                </text>
              </g>
            ))}
        </svg>
      </div>
      {/* 輪盤中間的圓點 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-4 bg-pink-700 rounded-full shadow-md z-10 border-2 border-pink-100" />
    </div>
  );
};

export default Wheel;
