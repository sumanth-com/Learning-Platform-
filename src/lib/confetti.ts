"use client";

import confetti from "canvas-confetti";

const PALETTE = ["#6366f1", "#8b5cf6", "#a78bfa", "#22d3ee", "#34d399", "#fbbf24", "#f472b6"];

export function triggerConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: PALETTE,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: PALETTE,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

/** Big celebratory burst when a full week is done across every section. */
export function celebrateWeekComplete(completedWeekId: number) {
  const burst = (opts: confetti.Options) => confetti({ ...opts, colors: PALETTE });

  burst({
    particleCount: 120,
    spread: 78,
    startVelocity: 42,
    origin: { x: 0.5, y: 0.55 },
    scalar: 1.1,
  });

  window.setTimeout(() => {
    burst({ particleCount: 70, angle: 60, spread: 62, origin: { x: 0, y: 0.65 } });
    burst({ particleCount: 70, angle: 120, spread: 62, origin: { x: 1, y: 0.65 } });
  }, 180);

  window.setTimeout(() => {
    burst({
      particleCount: 90,
      spread: 100,
      decay: 0.92,
      origin: { x: 0.5, y: 0.35 },
      shapes: ["star"],
      scalar: 1.2,
    });
  }, 360);

  const end = Date.now() + 4200;
  const frame = () => {
    burst({
      particleCount: 4,
      angle: 90,
      spread: 360,
      startVelocity: 22,
      origin: {
        x: Math.random() * 0.4 + 0.3,
        y: Math.random() * 0.2 + 0.1,
      },
      ticks: 80,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();

  void completedWeekId;
}
