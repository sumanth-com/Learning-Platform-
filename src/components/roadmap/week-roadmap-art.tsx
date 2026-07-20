import Image, { type StaticImageData } from "next/image";

interface WeekRoadmapArtProps {
  src: StaticImageData;
}

/** Fixed art slot so every week image aligns like Week 1 — bottom-anchored, scaled to fill. */
export function WeekRoadmapArt({ src }: WeekRoadmapArtProps) {
  return (
    <div className="pointer-events-none absolute bottom-0 right-3 z-10 h-40 w-36 sm:right-4 sm:h-[13rem] sm:w-44">
      <div className="relative h-[118%] w-full origin-bottom">
        <Image
          src={src}
          alt=""
          aria-hidden
          fill
          draggable={false}
          className="object-contain object-bottom mix-blend-lighten drop-shadow-[0_8px_24px_rgba(99,102,241,0.15)]"
          sizes="176px"
          priority={false}
        />
      </div>
    </div>
  );
}

export const WEEK_CARD_ART_MIN_HEIGHT = "min-h-[11rem] sm:min-h-[13.5rem]";
export const WEEK_CARD_ART_PADDING = "pr-[9.5rem] sm:pr-[11.5rem]";
