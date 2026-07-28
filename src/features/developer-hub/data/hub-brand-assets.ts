import type { HubBrandIconId } from "./cover-images";

export type HubBrandAsset = {
  /** Local SVG under /public/hub-brands */
  src: string;
  /** Soft glow tint behind the logo */
  glow: string;
};

export const HUB_BRAND_ASSETS: Record<HubBrandIconId, HubBrandAsset> = {
  docker: { src: "/hub-brands/docker.svg", glow: "bg-[#2496ED]/35" },
  aws: { src: "/hub-brands/aws.svg", glow: "bg-[#FF9900]/30" },
  nextjs: { src: "/hub-brands/nextjs.svg", glow: "bg-zinc-900/20" },
  postgres: { src: "/hub-brands/postgres.svg", glow: "bg-[#336791]/30" },
  redis: { src: "/hub-brands/redis.svg", glow: "bg-[#DC382D]/30" },
  react: { src: "/hub-brands/react.svg", glow: "bg-[#61DAFB]/35" },
  typescript: { src: "/hub-brands/typescript.svg", glow: "bg-[#3178C6]/30" },
  github: { src: "/hub-brands/github.svg", glow: "bg-zinc-900/20" },
  prisma: { src: "/hub-brands/prisma.svg", glow: "bg-zinc-900/18" },
  openai: { src: "/hub-brands/openai.svg", glow: "bg-emerald-600/25" },
  auth0: { src: "/hub-brands/auth0.svg", glow: "bg-[#EB5424]/30" },
  owasp: { src: "/hub-brands/owasp.svg", glow: "bg-rose-600/20" },
  kubernetes: { src: "/hub-brands/kubernetes.svg", glow: "bg-[#326CE5]/30" },
  vercel: { src: "/hub-brands/vercel.svg", glow: "bg-zinc-900/18" },
  stripe: { src: "/hub-brands/stripe.svg", glow: "bg-[#635BFF]/30" },
  figma: { src: "/hub-brands/figma.svg", glow: "bg-[#F24E1E]/25" },
  jwt: { src: "/hub-brands/jwt.svg", glow: "bg-rose-500/25" },
  architecture: { src: "/hub-brands/kubernetes.svg", glow: "bg-[#326CE5]/28" },
  patterns: { src: "/hub-brands/react.svg", glow: "bg-indigo-500/25" },
  career: { src: "/hub-brands/github.svg", glow: "bg-orange-500/25" },
  rag: { src: "/hub-brands/openai.svg", glow: "bg-violet-500/25" },
  prompts: { src: "/hub-brands/openai.svg", glow: "bg-indigo-500/25" },
  "clean-arch": { src: "/hub-brands/nodejs.svg", glow: "bg-amber-600/25" },
  drizzle: { src: "/hub-brands/drizzle.svg", glow: "bg-[#C5F74F]/30" },
  nodejs: { src: "/hub-brands/nodejs.svg", glow: "bg-[#339933]/30" },
};
