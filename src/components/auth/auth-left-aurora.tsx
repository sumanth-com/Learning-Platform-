"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import styles from "./auth-shell.module.css";

type AuthAuroraProps = {
  /** Softer wash for copy-heavy panels; fuller glow behind the form. */
  intensity?: "soft" | "full";
};

/**
 * Soft flowing brand aurora for auth panels.
 * Blobs drift continuously; a spotlight gently follows the pointer.
 */
export function AuthLeftAurora({ intensity = "full" }: AuthAuroraProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const spot = spotRef.current;
    if (!layer || !spot) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    let targetX = layer.clientWidth * 0.55;
    let targetY = layer.clientHeight * 0.4;
    let currentX = targetX;
    let currentY = targetY;

    const onMove = (event: PointerEvent) => {
      const rect = layer.getBoundingClientRect();
      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      spot.style.left = `${currentX}px`;
      spot.style.top = `${currentY}px`;
      raf = requestAnimationFrame(tick);
    };

    const host = layer.parentElement;
    host?.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      host?.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      className={cn(
        styles.auroraLayer,
        intensity === "soft" && styles.auroraSoft
      )}
      aria-hidden
    >
      <div className={`${styles.blob} ${styles.blobCoral}`} />
      <div className={`${styles.blob} ${styles.blobRose}`} />
      <div className={`${styles.blob} ${styles.blobViolet}`} />
      <div className={`${styles.blob} ${styles.blobWarm}`} />
      <div ref={spotRef} className={styles.spotlight} />
      <div className={styles.sheen} />
      <div className={styles.grain} />
    </div>
  );
}
