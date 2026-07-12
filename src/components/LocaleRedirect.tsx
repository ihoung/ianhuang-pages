"use client";

import { useEffect } from "react";
import { useLocale } from "@/lib/i18n";
import { pathWithBase } from "@/lib/asset";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function LocaleRedirect() {
  const { setLocale } = useLocale();

  useEffect(() => {
    const pathname = window.location.pathname;
    const path = BASE_PATH ? pathname.slice(BASE_PATH.length) : pathname;
    const segments = path.split("/").filter(Boolean);
    const urlLocale = segments.length > 0 ? segments[0] : null;

    if (!urlLocale || (urlLocale !== "en" && urlLocale !== "cn")) {
      const newPath = pathWithBase("/en") + path;
      window.location.replace(newPath);
      return;
    }

    setLocale(urlLocale as "en" | "cn");
  }, [setLocale]);

  return null;
}