export type LandingStat = {
  /** Numeric value for count-up animation. Omit when using `display`. */
  value?: number;
  suffix?: string;
  /** Static headline when a number does not fit (e.g. "AI Mentor"). */
  display?: string;
  label: string;
  detail: string;
};
