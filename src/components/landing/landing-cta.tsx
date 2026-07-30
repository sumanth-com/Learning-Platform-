import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { Reveal } from "./reveal";
import styles from "./landing.module.css";

export function LandingCta() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 pb-28 sm:px-8">
      <Reveal className="relative overflow-hidden rounded-[2rem] border border-white/[0.09] bg-gradient-to-br from-[#231c1e] via-[#151415] to-[#101011] px-7 py-16 text-center sm:px-16 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#e56b68]/18 blur-3xl"
        />
        <div
          aria-hidden
          className={`${styles.orbitReverse} pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-dashed border-white/[0.07]`}
        />

        <h2 className="relative mx-auto max-w-2xl text-balance text-[2.1rem] font-medium leading-[1.08] tracking-[-0.045em] text-white sm:text-[3rem]">
          Start the path today. Ship something by the weekend.
        </h2>
        <p className="relative mx-auto mt-5 max-w-lg text-balance text-[13.5px] leading-6 text-white/52">
          Create an account, pick a track, and the first module is open in under
          a minute.
        </p>

        <div className="relative mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={AUTH_ROUTES.signup}
            className={`${styles.shine} inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-[13px] font-semibold text-[#1b181a] shadow-[0_18px_45px_rgba(0,0,0,0.4)] transition hover:-translate-y-0.5 hover:bg-[#fff8f4]`}
          >
            Create free account
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={AUTH_ROUTES.login}
            className="inline-flex h-12 items-center rounded-full border border-white/12 px-7 text-[13px] font-medium text-white/75 transition hover:border-white/25 hover:bg-white/[0.04] hover:text-white"
          >
            I already have an account
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
