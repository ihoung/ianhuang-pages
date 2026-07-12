"use client";

import { useEffect } from "react";
import { pathWithBase } from "@/lib/asset";

export default function RootPage() {
  useEffect(() => {
    const stored = localStorage.getItem("preferred_locale");
    const target = stored === "cn" ? "/cn" : "/en";
    window.location.replace(pathWithBase(target));
  }, []);

  return null;
}