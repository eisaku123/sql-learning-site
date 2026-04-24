"use client";

import { useEffect } from "react";

export default function PageViewTracker() {
  useEffect(() => {
    fetch("/api/pageview", { method: "POST" }).catch(() => {});
  }, []);

  return null;
}
