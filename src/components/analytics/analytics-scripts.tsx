import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";

/**
 * Optional analytics loaders — enabled only when env vars are set.
 * GA4 uses the official @next/third-parties GoogleAnalytics component
 * (automatic page_view on load + App Router client navigations).
 *
 * Env:
 * - NEXT_PUBLIC_GA_MEASUREMENT_ID (GA4) — production only
 * - NEXT_PUBLIC_GTM_ID (Google Tag Manager)
 * - NEXT_PUBLIC_CLARITY_ID (Microsoft Clarity)
 */
export function AnalyticsScripts() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID?.trim();
  const isProduction = process.env.NODE_ENV === "production";

  const enableGa = Boolean(gaId) && isProduction;
  if (!enableGa && !gtmId && !clarityId) return null;

  return (
    <>
      {enableGa && gaId ? <GoogleAnalytics gaId={gaId} /> : null}

      {gtmId ? (
        <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}</Script>
      ) : null}

      {clarityId ? (
        <Script id="clarity" strategy="afterInteractive">{`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${clarityId}");`}</Script>
      ) : null}
    </>
  );
}
