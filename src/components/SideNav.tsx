"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n";

type Item = { id: string; label: string };

const items: Item[] = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Works" },
  { id: "contact", label: "Contact" },
];

export default function SideNav() {
  const { locale } = useLocale();
  const [active, setActive] = useState("home");

  const localizedItems: Item[] =
    locale === "cn"
      ? [
          { id: "home", label: "首页" },
          { id: "projects", label: "作品" },
          { id: "contact", label: "联系" },
        ]
      : items;

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(item.id);
          }
        });
      }, observerOptions);
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav
      aria-label="Section"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-6"
    >
      <ul className="flex flex-col items-end gap-6">
        {localizedItems.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id} className="flex items-center gap-3">
              <span
                className={`text-xs font-mono uppercase tracking-widest transition-colors duration-300 ${
                  isActive
                    ? "text-white"
                    : "text-[#6b6b6b] hover:text-white"
                }`}
              >
                <a href={`#${item.id}`}>{item.label}</a>
              </span>
              <span
                aria-hidden
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-accent shadow-glow"
                    : "bg-white/10"
                }`}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
