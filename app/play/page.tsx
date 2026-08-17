import { Suspense } from "react";
import { PlayScreen } from "@/components/game/PlayScreen";

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="p-8 text-fog">Loading arena…</div>}>
      <PlayScreen />
    </Suspense>
  );
}
