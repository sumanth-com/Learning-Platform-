import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import {
  SiteCard,
  SitePageHero,
  SitePageShell,
} from "@/components/site/site-page-shell";
import { SITE_ROUTES } from "@/lib/site-routes";
import { SITE } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  graphSchema,
  organizationSchema,
} from "@/lib/seo-schema";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact — Support & Partnerships",
  description: `Contact the ${SITE.name} team for product questions, account help, access requests, or partnership inquiries.`,
  path: SITE_ROUTES.contact,
});

export default function ContactPage() {
  return (
    <SitePageShell wide>
      <JsonLd
        data={graphSchema([
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", path: SITE_ROUTES.home },
            { name: "Contact", path: SITE_ROUTES.contact },
          ]),
        ])}
      />
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <SitePageHero
          eyebrow="Support"
          title="Contact"
          description={`Reach the ${SITE.name} team for product questions, account help, or partnership inquiries.`}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <SiteCard className="sm:p-8">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-[#f3b7ac]">
              <Mail className="h-4 w-4" />
            </span>
            <h2 className="mt-5 text-[17px] font-semibold tracking-tight text-white">
              Email support
            </h2>
            <p className="mt-2 text-[13.5px] leading-6 text-white/50">
              We typically respond within a few business days. Include your
              account email and clear steps when reporting an issue.
            </p>
            <a
              href={`mailto:${SITE.supportEmail}`}
              className="mt-5 inline-flex text-[14px] font-medium text-[#f3b7ac] transition hover:text-white"
            >
              {SITE.supportEmail}
            </a>
          </SiteCard>

          <SiteCard className="sm:p-8">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-[#f3b7ac]">
              <MessageSquare className="h-4 w-4" />
            </span>
            <h2 className="mt-5 text-[17px] font-semibold tracking-tight text-white">
              Before you write
            </h2>
            <ul className="mt-3 space-y-2 text-[13.5px] leading-6 text-white/50">
              <li>Check the <Link href={SITE_ROUTES.manual} className="text-[#f3b7ac] underline underline-offset-4 hover:text-white">Manual</Link> for how features work</li>
              <li>Browse <Link href={SITE_ROUTES.faq} className="text-[#f3b7ac] underline underline-offset-4 hover:text-white">FAQ</Link> for common questions</li>
              <li>For legal topics, see <Link href={SITE_ROUTES.terms} className="text-[#f3b7ac] underline underline-offset-4 hover:text-white">Terms</Link> and <Link href={SITE_ROUTES.privacy} className="text-[#f3b7ac] underline underline-offset-4 hover:text-white">Privacy</Link></li>
            </ul>
          </SiteCard>
        </div>
      </div>
    </SitePageShell>
  );
}
