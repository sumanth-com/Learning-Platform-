import { notFound } from "next/navigation";
import {
  CertBriefScreen,
  CertCertificateScreen,
  CertConfirmScreen,
  CertHonorScreen,
  CertLobbyScreen,
  CertPlanScreen,
  CertReadyScreen,
  CertResultsScreen,
} from "@/components/certifications/cert-flow-screens";

const CERT_STEPS = {
  brief: { title: "Brief", Screen: CertBriefScreen },
  plan: { title: "Plan", Screen: CertPlanScreen },
  confirm: { title: "Confirm details", Screen: CertConfirmScreen },
  honor: { title: "Honor code", Screen: CertHonorScreen },
  ready: { title: "Ready", Screen: CertReadyScreen },
  lobby: { title: "Lobby", Screen: CertLobbyScreen },
  results: { title: "Results", Screen: CertResultsScreen },
  certificate: { title: "Certificate", Screen: CertCertificateScreen },
} as const;

type CertStep = keyof typeof CERT_STEPS;

function isCertStep(value: string): value is CertStep {
  return value in CERT_STEPS;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = await params;
  return {
    title: isCertStep(step) ? CERT_STEPS[step].title : "Assessment",
  };
}

export default async function CertStepPage({
  params,
}: {
  params: Promise<{ certId: string; step: string }>;
}) {
  const { step } = await params;
  if (!isCertStep(step)) notFound();

  const { Screen } = CERT_STEPS[step];
  return <Screen />;
}
