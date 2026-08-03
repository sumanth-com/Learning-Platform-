import Link from "next/link";
import { SITE_ROUTES } from "@/lib/site-routes";
import { Reveal } from "./reveal";
import styles from "./landing.module.css";

/**
 * Indexable path narrative — prose + contextual internal links.
 * Keeps the premium layout (no cards) while strengthening crawl signals.
 */
export function LandingPathNarrative() {
  return (
    <section
      aria-labelledby="path-narrative-heading"
      className="relative py-16 sm:py-20"
    >
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <h2
            id="path-narrative-heading"
            className={`${styles.sectionHeading} text-balance`}
          >
            How the engineering path works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-[14px] leading-7 text-white/55 sm:text-[15px] sm:leading-7">
            Start with a structured{" "}
            <Link
              href={SITE_ROUTES.platform}
              className="text-white/85 underline decoration-white/20 underline-offset-4 transition hover:decoration-white/50"
            >
              learning platform
            </Link>{" "}
            that connects modules, practice, and projects. Get unstuck with an{" "}
            <Link
              href={SITE_ROUTES.mentor}
              className="text-white/85 underline decoration-white/20 underline-offset-4 transition hover:decoration-white/50"
            >
              AI mentor
            </Link>{" "}
            grounded in your progress, then prove skill with{" "}
            <Link
              href={SITE_ROUTES.certifications}
              className="text-white/85 underline decoration-white/20 underline-offset-4 transition hover:decoration-white/50"
            >
              verifiable certifications
            </Link>
            . Explore the{" "}
            <Link
              href={SITE_ROUTES.stack}
              className="text-white/85 underline decoration-white/20 underline-offset-4 transition hover:decoration-white/50"
            >
              tech stack paths
            </Link>{" "}
            or read{" "}
            <Link
              href={SITE_ROUTES.about}
              className="text-white/85 underline decoration-white/20 underline-offset-4 transition hover:decoration-white/50"
            >
              why we built Suprabase
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
