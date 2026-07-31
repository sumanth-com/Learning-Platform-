"use client";

import { useEffect, useRef, useState } from "react";

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function useInViewOnce(threshold = 0.35) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, threshold]);

  return { ref: setNode, inView };
}

export function useDemoClock({
  durationMs,
  active,
  reducedMotion,
}: {
  durationMs: number;
  active: boolean;
  reducedMotion: boolean;
}) {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [generation, setGeneration] = useState(0);
  const progressRef = useRef(0);
  const durationRef = useRef(durationMs);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (durationRef.current !== durationMs) {
      durationRef.current = durationMs;
      progressRef.current = 0;
      setProgress(0);
      setPlaying(true);
    }
  }, [durationMs]);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      progressRef.current = 0;
      setPlaying(true);
      return;
    }

    if (reducedMotion) {
      setProgress(1);
      progressRef.current = 1;
      setPlaying(false);
      return;
    }

    if (!playing) return;

    let frame = 0;
    const startedAt = performance.now();
    const startProgress = progressRef.current >= 1 ? 0 : progressRef.current;
    if (startProgress === 0) {
      setProgress(0);
      progressRef.current = 0;
    }
    const origin = startedAt - startProgress * durationMs;

    const tick = (now: number) => {
      const next = Math.min(1, (now - origin) / durationMs);
      progressRef.current = next;
      setProgress(next);
      if (next < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setPlaying(false);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, durationMs, playing, reducedMotion, generation]);

  const replay = () => {
    progressRef.current = 0;
    setProgress(0);
    setPlaying(true);
    setGeneration((g) => g + 1);
  };

  const toggle = () => {
    if (progressRef.current >= 1) {
      replay();
      return;
    }
    setPlaying((p) => !p);
  };

  return { progress, playing, replay, toggle, setPlaying };
}

export function stageFromProgress(progress: number, stages: number) {
  if (stages <= 1) return 0;
  return Math.min(stages - 1, Math.floor(progress * stages));
}
