import Link from "next/link";
import { SupraBaseMark } from "@/components/brand/supra-learn-logo";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { SITE } from "@/lib/site";
import { SITE_ROUTES } from "@/lib/site-routes";
import styles from "./landing.module.css";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "AI Mentor", href: SITE_ROUTES.mentor },
      { label: "System", href: SITE_ROUTES.platform },
      { label: "Certifications", href: SITE_ROUTES.certifications },
      { label: "Technologies", href: SITE_ROUTES.stack },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Most useful", href: SITE_ROUTES.journey },
      { label: "FAQ", href: SITE_ROUTES.faq },
      { label: "Sign in", href: AUTH_ROUTES.login },
      { label: "Reserve your seat", href: AUTH_ROUTES.reserveSeat },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: SITE_ROUTES.about },
      { label: "Manual", href: SITE_ROUTES.manual },
      { label: "Contact", href: SITE_ROUTES.contact },
    ],
  },
] as const;

export function LandingFooter() {
  return (
    <footer className={styles.footerBand}>
      <div className={styles.footerShell}>
        <div className={styles.footerDivider} />

        <div className="grid gap-8 pb-8 pt-10 sm:gap-10 sm:pb-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.85fr)] lg:gap-16">
          <div className="max-w-sm">
            <Link
              href={SITE_ROUTES.home}
              className="inline-flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-white"
            >
              <SupraBaseMark className="h-7 w-7" />
              {SITE.name}
            </Link>
            <p className="mt-3 text-[12.5px] leading-6 text-white/40 sm:mt-4">
              Helping developers become production-ready software engineers —
              real projects, AI mentoring, and verifiable certifications.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <p className="text-[11.5px] font-semibold tracking-wide text-white/80 sm:text-[12px]">
                  {column.title}
                </p>
                <ul className="mt-3 space-y-2 sm:mt-3.5 sm:space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[11.5px] leading-5 text-white/42 transition-colors hover:text-white sm:text-[12.5px]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2.5 py-5 text-center text-[11px] text-white/35 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-left sm:text-[11.5px]">
          <p className="shrink-0">
            Copyright © {new Date().getFullYear()} {SITE.name}. All rights
            reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end sm:gap-x-5">
            <Link
              href={SITE_ROUTES.terms}
              className="transition-colors hover:text-white/70"
            >
              Terms of Service
            </Link>
            <Link
              href={SITE_ROUTES.privacy}
              className="transition-colors hover:text-white/70"
            >
              Privacy Policy
            </Link>
            <a
              href={`mailto:${SITE.supportEmail}`}
              className="break-all transition-colors hover:text-white/70 sm:break-normal"
            >
              {SITE.supportEmail}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
