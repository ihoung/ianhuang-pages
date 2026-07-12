"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Locale = "en" | "cn";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: "en",
  setLocale: () => {},
});

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function getLocaleFromUrl(): Locale {
  const pathname = window.location.pathname;
  const path = BASE_PATH ? pathname.slice(BASE_PATH.length) : pathname;
  const segments = path.split("/").filter(Boolean);
  if (segments.length > 0 && (segments[0] === "en" || segments[0] === "cn")) {
    return segments[0] as Locale;
  }
  return "en";
}

function getLocaleFromStorage(): Locale | null {
  if (typeof window !== "undefined") {
    return (localStorage.getItem("preferred_locale") as Locale) || null;
  }
  return null;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const urlLocale = getLocaleFromUrl();
    const storageLocale = getLocaleFromStorage();
    const initialLocale = urlLocale !== "en" ? urlLocale : storageLocale || "en";
    setLocaleState(initialLocale);
    document.documentElement.lang = initialLocale === "cn" ? "zh-CN" : "en";
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      document.documentElement.lang = newLocale === "cn" ? "zh-CN" : "en";
      localStorage.setItem("preferred_locale", newLocale);
      const currentPath = window.location.pathname;
      const path = BASE_PATH ? currentPath.slice(BASE_PATH.length) : currentPath;
      const segments = path.split("/").filter(Boolean);
      let newPath: string;
      if (segments.length > 0 && (segments[0] === "en" || segments[0] === "cn")) {
        newPath = "/" + newLocale + path.substring(segments[0].length + 1);
      } else {
        newPath = "/" + newLocale + path;
      }
      window.history.replaceState(null, "", BASE_PATH + newPath);
    }
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextType {
  return useContext(LocaleContext);
}