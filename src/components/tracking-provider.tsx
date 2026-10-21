"use client";

import { useEffect } from "react";
import { captureClickIds, CONVERSIONS, reportConversion } from "@/lib/tracking";

// Site-wide tracking: saves ad click IDs and reports taps on phone links.
export function TrackingProvider() {
  useEffect(() => {
    captureClickIds();

    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href^="tel:"]');
      if (link) reportConversion(CONVERSIONS.phoneTap);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
