import Link from "next/link";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { Reveal } from "./reveal";
import styles from "./landing.module.css";

export function LandingCta() {
  return (
    <section className={styles.closeBand}>
      <Reveal className={`${styles.closeCta} relative overflow-hidden px-7 py-16 text-center sm:px-16 sm:py-20`}>
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#e56b68]/18 blur-3xl"
        />

        <h2 className={`${styles.sectionHeading} relative sm:whitespace-nowrap`}>
          Build software you&apos;ll be proud to ship.
        </h2>
        <p className="relative mx-auto mt-5 max-w-xl text-balance text-[13.5px] leading-6 text-white/55">
          Join developers building Full Stack Development, AI Engineering,
          System Design, and modern software engineering skills through real
          projects, AI guidance, and production-focused practice.
        </p>

        <div className="relative mx-auto mt-8 grid w-full max-w-md grid-cols-2 gap-2.5 sm:mt-10 sm:flex sm:max-w-none sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
          <Link
            href={AUTH_ROUTES.signup}
            className={`${styles.shine} inline-flex h-11 w-full items-center justify-center rounded-full bg-white px-3 text-[12.5px] font-semibold text-[#1b181a] shadow-[0_18px_45px_rgba(0,0,0,0.4)] transition hover:-translate-y-0.5 hover:bg-[#fff8f4] sm:h-12 sm:w-auto sm:px-8 sm:text-[13px]`}
          >
            Get started
          </Link>
          <Link
            href={AUTH_ROUTES.login}
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-white/12 bg-white/[0.06] px-3 text-[12.5px] font-semibold text-white/80 transition hover:bg-white/[0.1] hover:text-white sm:h-12 sm:w-auto sm:border-0 sm:px-7 sm:text-[13px] sm:font-medium sm:text-white/75"
          >
            <span className="truncate sm:hidden">Have an account?</span>
            <span className="hidden sm:inline">Already have an account?</span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
