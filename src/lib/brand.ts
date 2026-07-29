/** SupraBase brand colors resolved from the active theme. */
export const BRAND = {
  /** Deep accent for text, icons, borders */
  deep: "var(--color-brand)",
  /** Primary CTA / bright fills */
  bright: "var(--color-brand)",
  /** Hover lift on bright fills */
  hover: "color-mix(in srgb, var(--color-brand) 88%, white)",
  /** Dark end of brand gradients */
  ink: "#242328",
  /** Mid gradient stop */
  mid: "color-mix(in srgb, var(--color-brand) 62%, #242328)",
  /** Soft wash backgrounds */
  soft: "color-mix(in srgb, var(--color-brand) 10%, transparent)",
  /** Dark text on bright CTAs */
  onBright: "var(--color-primary-foreground)",
} as const;

export const BRAND_GRADIENT =
  "linear-gradient(135deg, #242328 0%, #37343a 55%, var(--color-brand) 100%)";
