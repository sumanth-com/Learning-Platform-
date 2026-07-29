/** SupraBase brand colors — same muted brick used on the profile ID card. */
export const BRAND = {
  /** Deep accent for text, icons, borders */
  deep: "#5f3435",
  /** Primary CTA / bright fills */
  bright: "#a7423d",
  /** Hover lift on bright fills */
  hover: "#b8504a",
  /** Dark end of brand gradients */
  ink: "#222328",
  /** Mid gradient stop */
  mid: "#5f3435",
  /** Soft wash backgrounds */
  soft: "rgba(167, 66, 61, 0.12)",
  /** Dark text on bright CTAs */
  onBright: "#fafafa",
} as const;

export const BRAND_GRADIENT =
  "linear-gradient(135deg, #222328 0%, #5f3435 55%, #a7423d 100%)";
