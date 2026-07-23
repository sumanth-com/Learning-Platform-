import { Suspense } from "react";
import { MentorWorkspace } from "@/components/ai-mentor/mentor-workspace";

export const metadata = {
  title: "AI Mentor",
};

export default function AiMentorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Loading AI Mentor…
        </div>
      }
    >
      <MentorWorkspace />
    </Suspense>
  );
}
