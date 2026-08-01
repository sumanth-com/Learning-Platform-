"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "./reveal";
import styles from "./landing.module.css";

const DEVICON =
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

/**
 * `soon` = no dedicated portal path yet (academy / weeks / hub guide).
 */
const TECHNOLOGIES = [
  { name: "HTML5", src: `${DEVICON}/html5/html5-original.svg` },
  { name: "CSS3", src: `${DEVICON}/css3/css3-original.svg` },
  { name: "JavaScript", src: `${DEVICON}/javascript/javascript-original.svg` },
  { name: "TypeScript", src: `${DEVICON}/typescript/typescript-original.svg` },
  { name: "React", src: `${DEVICON}/react/react-original.svg` },
  { name: "Next.js", src: `${DEVICON}/nextjs/nextjs-original.svg` },
  { name: "Node.js", src: `${DEVICON}/nodejs/nodejs-original.svg`, soon: true },
  { name: "Python", src: `${DEVICON}/python/python-original.svg`, soon: true },
  { name: "Java", src: `${DEVICON}/java/java-original.svg` },
  { name: "PostgreSQL", src: `${DEVICON}/postgresql/postgresql-original.svg` },
  { name: "MongoDB", src: `${DEVICON}/mongodb/mongodb-original.svg` },
  { name: "Docker", src: `${DEVICON}/docker/docker-original.svg` },
  { name: "Git", src: `${DEVICON}/git/git-original.svg` },
  { name: "GitHub", src: `${DEVICON}/github/github-original.svg` },
  { name: "Linux", src: `${DEVICON}/linux/linux-original.svg`, soon: true },
  {
    name: "AWS",
    src: `${DEVICON}/amazonwebservices/amazonwebservices-original-wordmark.svg`,
  },
  { name: "AI Engineering", src: `${DEVICON}/tensorflow/tensorflow-original.svg` },
  { name: "LangChain", src: `${DEVICON}/python/python-original.svg`, soon: true },
  { name: "Supabase", src: `${DEVICON}/supabase/supabase-original.svg`, soon: true },
  {
    name: "System Design",
    src: `${DEVICON}/graphql/graphql-plain.svg`,
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function LandingTechnologies() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="technologies"
      className={`${styles.techSection} relative mx-auto flex min-h-[min(100svh,56rem)] max-w-6xl flex-col justify-center px-5 py-16 sm:px-8 sm:py-20`}
    >
      <div aria-hidden className={styles.techAura}>
        <span className={styles.techOrbitA} />
        <span className={styles.techOrbitB} />
        <span className={styles.techPulse} />
      </div>

      <Reveal className="relative z-10 text-center">
        <span className={styles.sectionPill}>Stack coverage</span>
        <h2 className={`${styles.sectionHeading} sm:whitespace-nowrap`}>
          Technologies you&apos;ll master
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-balance text-[13px] leading-5 text-white/45">
          Frontend to AI Engineering and System Design — the stack production
          engineers ship with.
        </p>
      </Reveal>

      <motion.div
        className="relative z-10 mt-8 grid grid-cols-4 gap-2 sm:mt-10 sm:grid-cols-5 sm:gap-2.5 lg:gap-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: reduceMotion ? 0 : 0.035,
              delayChildren: reduceMotion ? 0 : 0.08,
            },
          },
        }}
      >
        {TECHNOLOGIES.map((tech, index) => {
          const soon = "soon" in tech && tech.soon;
          const col = index % 5;
          const row = Math.floor(index / 5);

          return (
            <motion.div
              key={tech.name}
              variants={{
                hidden: reduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: 28 + row * 6,
                      scale: 0.82,
                      filter: "blur(8px)",
                      rotateX: 18,
                    },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  rotateX: 0,
                  transition: {
                    duration: 0.7,
                    ease: EASE,
                  },
                },
              }}
              style={{
                transformPerspective: 900,
                ["--float-delay" as string]: `${(col * 0.35 + row * 0.55).toFixed(2)}s`,
              }}
              className={styles.techCardWrap}
            >
              <div
                className={`${styles.techCard} ${soon ? styles.techCardSoon : ""}`}
              >
                {soon ? (
                  <span className={styles.techSoon}>Soon</span>
                ) : null}
                <span aria-hidden className={styles.techCardGlow} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tech.src}
                  alt={`${tech.name} logo`}
                  width={32}
                  height={32}
                  draggable={false}
                  className={`${styles.techLogo} ${soon ? styles.techLogoSoon : ""}`}
                />
                <p className={styles.techName}>{tech.name}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
