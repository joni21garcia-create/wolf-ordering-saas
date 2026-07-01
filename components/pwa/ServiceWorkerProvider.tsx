"use client";

import { useEffect } from "react";
import { registerSW } from "@/lib/pwa/registerSW";

export default function ServiceWorkerProvider() {
  useEffect(() => {
    registerSW("/sw.js");
  }, []);

  return null;
}