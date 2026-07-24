import type { CertCategoryId } from "@/features/certifications/types";
import { cn } from "@/lib/utils";

const DEVICON =
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

/** Maps each cert category to an official Devicon asset. */
const LOGO_SRC: Record<CertCategoryId, string> = {
  javascript: `${DEVICON}/javascript/javascript-original.svg`,
  typescript: `${DEVICON}/typescript/typescript-original.svg`,
  react: `${DEVICON}/react/react-original.svg`,
  nextjs: `${DEVICON}/nextjs/nextjs-original.svg`,
  nodejs: `${DEVICON}/nodejs/nodejs-original.svg`,
  python: `${DEVICON}/python/python-original.svg`,
  java: `${DEVICON}/java/java-original.svg`,
  sql: `${DEVICON}/mysql/mysql-original.svg`,
  postgresql: `${DEVICON}/postgresql/postgresql-original.svg`,
  mongodb: `${DEVICON}/mongodb/mongodb-original.svg`,
  docker: `${DEVICON}/docker/docker-original.svg`,
  git: `${DEVICON}/git/git-original.svg`,
  frontend: `${DEVICON}/html5/html5-original.svg`,
  backend: `${DEVICON}/nestjs/nestjs-original.svg`,
  devops: `${DEVICON}/kubernetes/kubernetes-original.svg`,
  algorithms: `${DEVICON}/cplusplus/cplusplus-original.svg`,
  "data-structures": `${DEVICON}/csharp/csharp-original.svg`,
  "system-design": `${DEVICON}/amazonwebservices/amazonwebservices-original-wordmark.svg`,
  "ai-engineering": `${DEVICON}/tensorflow/tensorflow-original.svg`,
  "prompt-engineering": `${DEVICON}/jupyter/jupyter-original.svg`,
  rag: `${DEVICON}/pytorch/pytorch-original.svg`,
  langchain: `${DEVICON}/python/python-original.svg`,
  langgraph: `${DEVICON}/graphql/graphql-plain.svg`,
};

export function CertTechLogo({
  id,
  className,
  size = 40,
}: {
  id: CertCategoryId;
  className?: string;
  size?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC[id]}
      alt=""
      width={size}
      height={size}
      draggable={false}
      className={cn("object-contain", className)}
    />
  );
}

export { LOGO_SRC };
