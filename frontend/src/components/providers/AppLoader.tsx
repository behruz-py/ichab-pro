"use client";

import { useState } from "react";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

export function AppLoader({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      <div style={{ visibility: loaded ? "visible" : "hidden" }}>{children}</div>
    </>
  );
}
