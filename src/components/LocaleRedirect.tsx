"use client";

import { useEffect } from "react";
import { useLocale } from "@/lib/i18n";

export default function LocaleRedirect() {
  const { setLocale } = useLocale();

  useEffect(() => {
    const segments = window.location.pathname.split("/").filter(Boolean);
    const urlLocale = segments.length > 0 ? segments[0] : null;

    if (!urlLocale || (urlLocale !== "en" && urlLocale !== "cn")) {
      const newPath = "/en" + window.location.pathname;
      window.location.replace(newPath);
      return;
    }

    setLocale(urlLocale as "en" | "cn");
  }, [setLocale]);

  return null;
}
