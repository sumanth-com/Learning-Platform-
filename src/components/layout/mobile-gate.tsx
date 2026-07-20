"use client";

import { useState } from "react";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import { Laptop, X } from "lucide-react";

import mobileImage from "@/assets/Mobile.jpg";

const MOBILE_REVEAL_IMAGE = "/mobile-reveal.jfif";

const gateFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export function MobileGate() {
  const [showReveal, setShowReveal] = useState(false);

  if (showReveal) {
    return (
      <div className="fixed inset-0 z-50 h-[100dvh] w-screen overflow-hidden bg-black">
        <Image
          src={MOBILE_REVEAL_IMAGE}
          alt="Surprise for Prathyu"
          fill
          unoptimized
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 via-black/35 to-transparent" />

        <p className="absolute inset-x-0 bottom-[max(2rem,env(safe-area-inset-bottom))] z-10 px-5 text-center text-xl font-bold leading-tight tracking-wide text-white drop-shadow-md sm:text-2xl">
          Laptop lo Open Chey eheyy... 😂😂
        </p>

        <button
          type="button"
          onClick={() => setShowReveal(false)}
          className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 h-[100dvh] w-screen overflow-hidden bg-[#d8cfc4]">
      <Image
        src={mobileImage}
        alt="A surprise for Prathyu"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#d8cfc4]/95 via-[#d8cfc4]/55 to-transparent"
        aria-hidden
      />

      <div className="absolute inset-x-0 top-0 z-10 px-5 pt-[max(2.5rem,env(safe-area-inset-top))]">
        <p
          className={`${gateFont.className} text-center text-[1.15rem] font-medium italic leading-none tracking-normal text-[#2f2820] sm:text-[1.3rem]`}
        >
          Hey Prathyu...❤️
          <br />
          <br />
          Too good for a phone screen.
          <br />
          I built something for you — open it on your laptop. 🚀
        </p>

        <button
          type="button"
          onClick={() => setShowReveal(true)}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2f2820] px-4 py-3.5 text-sm font-semibold tracking-wide text-[#f4f1ea] shadow-lg shadow-black/15 transition active:scale-[0.98]"
        >
          <Laptop className="h-4 w-4 shrink-0" />
          Open in Laptop
        </button>
      </div>
    </div>
  );
}
