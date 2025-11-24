import { useState, useEffect, useCallback, useRef } from "react";
import { Info, Sparkles } from "lucide-react";

import type { Option } from "@/types";
import { getOptionByRotation } from "@/utils/mathUtils";
import { getNextColor, generateId } from "@/utils/colors";
import Wheel from "@/components/Wheel";
import OptionList from "@/components/OptionList";
import Presets from "@/components/Presets";
import confetti from "canvas-confetti";

// 預設選項清單
const createDefaultOptions = (): Option[] => [
  { id: generateId(), label: "Option A", weight: 1, color: getNextColor(0) },
  { id: generateId(), label: "Option B", weight: 1, color: getNextColor(1) },
  { id: generateId(), label: "Option C", weight: 1, color: getNextColor(2) },
];

// 從 localStorage 取得初始選項清單
const getInitialOptions = (): Option[] => {
  if (typeof window === "undefined") return createDefaultOptions();

  const saved = window.localStorage.getItem("wheelOptions");
  if (!saved) return createDefaultOptions();

  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) return parsed as Option[];
    return createDefaultOptions();
  } catch (err: unknown) {
    console.error("Unable to parse stored options:", err);
    return createDefaultOptions();
  }
};

const App = () => {
  const [options, setOptions] = useState<Option[]>(getInitialOptions);

  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);

  const [result, setResult] = useState<Option | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const lastCelebrationRef = useRef<string | null>(null);
  const pointerRef = useRef<HTMLDivElement | null>(null);

  const getPointerOrigin = useCallback(() => {
    if (typeof window === "undefined") return { x: 0.5, y: 0.25 };
    const rect = pointerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0.5, y: 0.25 };
    return {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    };
  }, []);

  // 當 options 改變就同步存進 localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("wheelOptions", JSON.stringify(options));
  }, [options]);

  // 尚未啟動正式轉動時讓輪盤續慢慢轉動，增加等待預期
  useEffect(() => {
    if (isSpinning || hasSpun) return;

    let frameId: number | null = null;

    const animateIdleRotation = () => {
      setRotation((prev) => prev + 0.15);
      frameId = requestAnimationFrame(animateIdleRotation);
    };

    frameId = requestAnimationFrame(animateIdleRotation);

    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [hasSpun, isSpinning]);

  // 開始旋轉
  const handleSpin = useCallback(() => {
    if (isSpinning) return;

    const totalWeight = options.reduce((sum, o) => sum + o.weight, 0);

    if (options.length < 1 || totalWeight <= 0) {
      setErrMsg(
        "Please add at least one option with a weight greater than zero."
      );
      return;
    }

    setIsSpinning(true);
    setHasSpun(true);
    setResult(null);
    lastCelebrationRef.current = null;
    setErrMsg(null);

    const spinAngle = 5 * 360 + Math.random() * 360;

    setRotation((prev) => prev + spinAngle);
  }, [isSpinning, options]);

  const handleSpinEnd = useCallback(() => {
    setIsSpinning(false);
    const winner = getOptionByRotation(options, rotation);
    setResult(winner);
  }, [options, rotation]);

  useEffect(() => {
    if (!result || isSpinning) return;
    if (lastCelebrationRef.current === result.id) return;

    lastCelebrationRef.current = result.id;

    confetti({
      particleCount: 140,
      spread: 160,
      startVelocity: 30,
      ticks: 200,
      origin: getPointerOrigin(),
    });
  }, [result, isSpinning, getPointerOrigin]);

  return (
    <div className="max-w-6xl mx-auto w-full min-h-screen flex flex-col pt-8 lg:pt-20 px-4 md:px-8">
      <h1 className="mb-8 lg:mb-12 text-3xl font-bold text-gray-800">
        Decision Wheel
      </h1>
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-5 flex flex-col items-center justify-start pt-4">
          <Wheel
            options={options}
            rotation={rotation}
            isSpinning={isSpinning}
            onSpinEnd={handleSpinEnd}
            pointerRef={pointerRef}
          />
          <div className="pt-8 pb-4 w-full flex justify-center items-center">
            {result && !isSpinning ? (
              <div className="animate-bounce-short bg-white shadow-lg shadow-pink-200 border-2 border-primary rounded-xl px-6 py-3 flex items-center gap-2">
                <Sparkles size={24} className="text-primary" />
                <span className="text-lg font-bold text-gray-800">
                  <span className="text-pink-700">{result.label}</span>
                </span>
              </div>
            ) : (
              errMsg && (
                <div className="text-red-600 bg-red-50 border border-red-100 px-4 py-2 rounded-lg flex items-center gap-2">
                  <Info size={16} />
                  {errMsg}
                </div>
              )
            )}
          </div>
          <button
            onClick={handleSpin}
            disabled={isSpinning || options.length === 0}
            className={`
              group relative w-full max-w-72 py-4 rounded-full font-bold text-xl shadow-lg
              ${
                isSpinning || options.length === 0
                  ? "bg-gray-300"
                  : "bg-linear-to-r from-primary to-secondary transition-all transform hover:-translate-y-1 active:translate-y-0 hover:shadow-pink-400/50 text-white"
              }
            `}
          >
            {isSpinning
              ? "Spinning..."
              : options.length === 0
              ? "Add options"
              : "Spin"}
          </button>
        </div>
        <div className="lg:col-span-7 flex flex-col gap-8">
          <OptionList
            options={options}
            setOptions={setOptions}
            disabled={isSpinning}
          />
          <Presets
            onSelectPreset={(newOptions) => setOptions(newOptions)}
            disabled={isSpinning}
          />
        </div>
      </main>
      <footer className="mt-auto py-2 text-pink-300 text-xs border-t border-pink-100">
        <p className="text-center">
          © 2025 by{" "}
          <a
            href="https://github.com/kir4che"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="kir4che GitHub"
          >
            kir4che
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
