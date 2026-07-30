import Link from "next/link";
import { SupraBaseMark } from "@/components/brand/supra-learn-logo";
import { AUTH_ROUTES } from "@/features/auth/constants";

const SUPPORT_EMAIL = "support.suprabase@gmail.com";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Overview", href: "#platform" },
      { label: "AI mentor", href: "#mentor" },
      { label: "Certifications", href: "#certifications" },
      { label: "How it works", href: "#journey" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: AUTH_ROUTES.login },
      { label: "Create account", href: AUTH_ROUTES.signup },
      { label: "Reset password", href: AUTH_ROUTES.forgotPassword },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="relative border-t border-white/[0.07] bg-[#0a0b0c]/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Link
            href={AUTH_ROUTES.public}
            className="inline-flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-white"
          >
            <SupraBaseMark className="h-8 w-8" />
            Suprabase
          </Link>
          <p className="mt-4 max-w-xs text-[12.5px] leading-6 text-white/42">
            A structured path from first line of code to a credential you can
            put in front of an employer.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/32">
              {column.title}
            </p>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[12.5px] text-white/55 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-white/[0.06] px-5 py-6 text-[11.5px] text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} Suprabase. All rights reserved.</p>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="transition hover:text-white/70"
        >
          {SUPPORT_EMAIL}
        </a>
      </div>
    </footer>
  );
}
