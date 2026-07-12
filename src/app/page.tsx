"use client";

import { useEffect } from "react";

export default function RootPage() {
  useEffect(() => {
    const stored = localStorage.getItem("preferred_locale");
    const target = stored === "en" ? "/en" : "/cn";
    window.location.replace(target);
  }, []);

  return null;
}