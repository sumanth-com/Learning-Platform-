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
      { label: "Create account", href: AUTH_ROUTES.signup },
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

        <div className="grid gap-10 pb-10 pt-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)] lg:gap-16">
          <div>
            <Link
              href={SITE_ROUTES.home}
              className="inline-flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-white"
            >
              <SupraBaseMark className="h-7 w-7" />
              {SITE.name}
            </Link>
            <p className="mt-4 max-w-[20rem] text-[12.5px] leading-6 text-white/40">
              Helping developers become production-ready software engineers —
              real projects, AI mentoring, and verifiable certifications.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
            {COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <p className="text-[12px] font-semibold tracking-wide text-white/80">
                  {column.title}
                </p>
                <ul className="mt-3.5 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[12.5px] text-white/42 transition hover:text-white"
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

        <div className="flex flex-col gap-3 py-5 text-[11.5px] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright © {new Date().getFullYear()} {SITE.name}. All rights
            reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href={SITE_ROUTES.terms}
              className="transition hover:text-white/70"
            >
              Terms of Service
            </Link>
            <Link
              href={SITE_ROUTES.privacy}
              className="transition hover:text-white/70"
            >
              Privacy Policy
            </Link>
            <a
              href={`mailto:${SITE.supportEmail}`}
              className="transition hover:text-white/70"
            >
              {SITE.supportEmail}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
