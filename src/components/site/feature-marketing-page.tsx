import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { SITE_ROUTES } from "@/lib/site-routes";
import {
  SiteCard,
  SitePageHero,
  SitePageShell,
} from "@/components/site/site-page-shell";

const RELATED = [
  { label: "AI Mentor", href: SITE_ROUTES.mentor },
  { label: "Platform", href: SITE_ROUTES.platform },
  { label: "Certifications", href: SITE_ROUTES.certifications },
  { label: "Tech stack", href: SITE_ROUTES.stack },
  { label: "FAQ", href: SITE_ROUTES.faq },
] as const;

export function FeatureMarketingPage({
  eyebrow,
  title,
  description,
  cards,
  ctaLabel = "Request access",
}: {
  eyebrow: string;
  title: string;
  description: string;
  cards: { title: string; body: string }[];
  ctaLabel?: string;
}) {
  return (
    <SitePageShell wide>
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <SitePageHero
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <SiteCard key={card.title} className="sm:p-7">
              <h2 className="text-[16px] font-semibold tracking-tight text-white">
                {card.title}
              </h2>
              <p className="mt-3 text-[13.5px] leading-6 text-white/50">
                {card.body}
              </p>
            </SiteCard>
          ))}
        </div>

        <div className="mt-8">
          <SiteCard className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-[17px] font-semibold tracking-tight text-white">
                Ready to build?
              </h2>
              <p className="mt-1.5 text-[13.5px] text-white/45">
                Request invite-only access and put this into practice on real
                work.
              </p>
            </div>
            <Link
              href={AUTH_ROUTES.reserveSeat}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-[13px] font-semibold text-[#181719] transition hover:bg-[#fff8f4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {ctaLabel}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </SiteCard>
        </div>

        <nav
          aria-label="Related pages"
          className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] text-white/40"
        >
          {RELATED.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-white focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </SitePageShell>
  );
}
