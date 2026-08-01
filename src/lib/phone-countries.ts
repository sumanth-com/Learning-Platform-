/**
 * Country dial codes + national number length for seat-request phone validation.
 */
export type PhoneCountry = {
  iso: string;
  name: string;
  dial: string;
  /** National significant number length (digits only, no leading 0). */
  digits: number;
  flag: string;
};

export const PHONE_COUNTRIES: readonly PhoneCountry[] = [
  { iso: "IN", name: "India", dial: "91", digits: 10, flag: "🇮🇳" },
  { iso: "US", name: "United States", dial: "1", digits: 10, flag: "🇺🇸" },
  { iso: "GB", name: "United Kingdom", dial: "44", digits: 10, flag: "🇬🇧" },
  { iso: "AE", name: "United Arab Emirates", dial: "971", digits: 9, flag: "🇦🇪" },
  { iso: "AU", name: "Australia", dial: "61", digits: 9, flag: "🇦🇺" },
  { iso: "CA", name: "Canada", dial: "1", digits: 10, flag: "🇨🇦" },
  { iso: "SG", name: "Singapore", dial: "65", digits: 8, flag: "🇸🇬" },
  { iso: "DE", name: "Germany", dial: "49", digits: 11, flag: "🇩🇪" },
  { iso: "PK", name: "Pakistan", dial: "92", digits: 10, flag: "🇵🇰" },
  { iso: "BD", name: "Bangladesh", dial: "880", digits: 10, flag: "🇧🇩" },
  { iso: "NP", name: "Nepal", dial: "977", digits: 10, flag: "🇳🇵" },
  { iso: "LK", name: "Sri Lanka", dial: "94", digits: 9, flag: "🇱🇰" },
  { iso: "SA", name: "Saudi Arabia", dial: "966", digits: 9, flag: "🇸🇦" },
  { iso: "QA", name: "Qatar", dial: "974", digits: 8, flag: "🇶🇦" },
  { iso: "MY", name: "Malaysia", dial: "60", digits: 9, flag: "🇲🇾" },
  { iso: "PH", name: "Philippines", dial: "63", digits: 10, flag: "🇵🇭" },
  { iso: "ID", name: "Indonesia", dial: "62", digits: 11, flag: "🇮🇩" },
  { iso: "NG", name: "Nigeria", dial: "234", digits: 10, flag: "🇳🇬" },
  { iso: "ZA", name: "South Africa", dial: "27", digits: 9, flag: "🇿🇦" },
  { iso: "BR", name: "Brazil", dial: "55", digits: 11, flag: "🇧🇷" },
] as const;

export const DEFAULT_PHONE_COUNTRY_ISO = "IN";

export function getPhoneCountry(iso: string): PhoneCountry | undefined {
  return PHONE_COUNTRIES.find((c) => c.iso === iso);
}

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

/** Build E.164-style phone for storage: +{dial}{national} */
export function formatInternationalPhone(iso: string, national: string) {
  const country = getPhoneCountry(iso);
  const local = digitsOnly(national);
  if (!country) return `+${local}`;
  return `+${country.dial}${local}`;
}
