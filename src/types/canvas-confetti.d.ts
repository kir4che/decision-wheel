declare module "canvas-confetti" {
  // Minimal declaration to satisfy TypeScript; accepts options used by the library.
  interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    ticks?: number;
    origin?: { x?: number; y?: number };
    gravity?: number;
    scalar?: number;
  }

  const confetti: (options?: ConfettiOptions) => void;
  export default confetti;
}
