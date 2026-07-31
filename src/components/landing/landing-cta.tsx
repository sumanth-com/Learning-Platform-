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

        <div className="relative mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={AUTH_ROUTES.signup}
            className={`${styles.shine} inline-flex h-12 items-center rounded-full bg-white px-8 text-[13px] font-semibold text-[#1b181a] shadow-[0_18px_45px_rgba(0,0,0,0.4)] transition hover:-translate-y-0.5 hover:bg-[#fff8f4]`}
          >
            Get started
          </Link>
          <Link
            href={AUTH_ROUTES.login}
            className="inline-flex h-12 items-center rounded-full bg-white/[0.06] px-7 text-[13px] font-medium text-white/75 transition hover:bg-white/[0.1] hover:text-white"
          >
            Already have an account?
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
