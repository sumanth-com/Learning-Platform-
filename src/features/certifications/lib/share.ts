import type { EarnedCertificate } from "@/features/certifications/types";

const PRODUCTION_ORIGIN = "https://suprabase.vercel.app";

export function certificateVerifyUrl(id: string) {
  if (typeof window !== "undefined") {
    const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL?.trim();
    const configuredIsLocal =
      configuredOrigin?.includes("localhost") ||
      configuredOrigin?.includes("127.0.0.1");
    const origin =
      (configuredOrigin && !configuredIsLocal ? configuredOrigin : undefined) ||
      (window.location.hostname === "localhost"
        ? PRODUCTION_ORIGIN
        : window.location.origin);
    return `${origin.replace(/\/+$/, "")}/verify/${encodeURIComponent(id)}`;
  }
  return `${PRODUCTION_ORIGIN}/verify/${encodeURIComponent(id)}`;
}

export function qrImageUrl(data: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(data)}`;
}

export function linkedInShareUrl(cert: EarnedCertificate) {
  const url = certificateVerifyUrl(cert.id);
  return `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.title)}&organizationName=${encodeURIComponent("SupraBase")}&issueYear=${new Date(cert.issuedAt).getFullYear()}&issueMonth=${new Date(cert.issuedAt).getMonth() + 1}&certUrl=${encodeURIComponent(url)}&certId=${encodeURIComponent(cert.id)}`;
}

export function xShareUrl(cert: EarnedCertificate) {
  const text = `I earned the ${cert.title} from SupraBase — verify: ${certificateVerifyUrl(cert.id)}`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export function emailShareUrl(cert: EarnedCertificate) {
  return `mailto:?subject=${encodeURIComponent(`SupraBase Certificate — ${cert.title}`)}&body=${encodeURIComponent(`I earned ${cert.title}.\nVerify: ${certificateVerifyUrl(cert.id)}`)}`;
}
