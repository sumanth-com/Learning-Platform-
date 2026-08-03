import { Suspense } from "react";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GaPageViews } from "@/components/analytics/ga-page-views";

/**
 * Production analytics loaders (GA4, Clarity, optional GTM, Vercel).
 * GA4 + Clarity + Vercel Analytics / Speed Insights only load in production.
 */
export function AnalyticsScripts() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID?.trim();
  const isProduction = process.env.NODE_ENV === "production";

  const enableGa = Boolean(gaId) && isProduction;
  const enableClarity = Boolean(clarityId) && isProduction;
  const enableGtm = Boolean(gtmId) && isProduction;

  return (
    <>
      {enableGa && gaId ? (
        <>
          <GoogleAnalytics gaId={gaId} />
          <Suspense fallback={null}>
            <GaPageViews />
          </Suspense>
        </>
      ) : null}

      {enableGtm && gtmId ? (
        <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}</Script>
      ) : null}

      {enableClarity && clarityId ? (
        <Script id="microsoft-clarity" strategy="afterInteractive">{`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${clarityId}");`}</Script>
      ) : null}

      {isProduction ? (
        <>
          <VercelAnalytics />
          <SpeedInsights />
        </>
      ) : null}
    </>
  );
}
