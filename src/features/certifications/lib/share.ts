import type { EarnedCertificate } from "@/features/certifications/types";
import { absoluteUrl } from "@/lib/site";

export function certificateVerifyUrl(id: string) {
  return absoluteUrl(`/verify/${encodeURIComponent(id)}`);
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
