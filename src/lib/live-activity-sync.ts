import type { ResumePosition } from "@/lib/module-progress";

export const LIVE_ACTIVITY_CHANNEL = "supracodez-live-activity";

export interface LiveActivitySnapshot extends ResumePosition {
  learnerName: string;
}

let lastSnapshot: LiveActivitySnapshot | null = null;

export function publishLiveActivity(snapshot: LiveActivitySnapshot): void {
  if (typeof window === "undefined") return;
  lastSnapshot = snapshot;
  try {
    const channel = new BroadcastChannel(LIVE_ACTIVITY_CHANNEL);
    channel.postMessage(snapshot);
    channel.close();
  } catch {
    /* ignore */
  }
}

export function readLiveActivity(): LiveActivitySnapshot | null {
  return lastSnapshot;
}

export function subscribeLiveActivity(
  onUpdate: (snapshot: LiveActivitySnapshot | null) => void
): () => void {
  if (typeof window === "undefined") return () => undefined;

  const channel = new BroadcastChannel(LIVE_ACTIVITY_CHANNEL);
  channel.onmessage = (event) => {
    const data = event.data as LiveActivitySnapshot;
    lastSnapshot = data;
    onUpdate(data);
  };

  onUpdate(lastSnapshot);

  return () => channel.close();
}

export function getLiveViewUrl(): string {
  if (typeof window === "undefined") return "/live";
  return `${window.location.origin}/live`;
}
