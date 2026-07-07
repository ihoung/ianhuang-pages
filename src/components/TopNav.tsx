"use client";

import Link from "next/link";
import { useState } from "react";

type Item = { href: string; label: string };

const items: Item[] = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Works" },
  { href: "/content", label: "About" },
  { href: "/#contact", label: "Contact" },
];

type Props = {
  active?: string;
};

export function LangToggle() {
  const [lang, setLang] = useState<"EN" | "中">("EN");

  return (
    <div
      className="inline-flex items-center rounded-full border border-white/10 text-[11px] font-mono"
      role="group"
      aria-label="Language switch"
    >
      <button
        type="button"
        onClick={() => setLang("中")}
        className={`px-2.5 py-1.5 rounded-l-full transition-colors ${
          lang === "中"
            ? "text-white"
            : "text-white/40 hover:text-white/70"
        }`}
        aria-pressed={lang === "中"}
      >
        中
      </button>
      <span aria-hidden className="w-px h-3.5 bg-white/10" />
      <button
        type="button"
        onClick={() => setLang("EN")}
        className={`px-2.5 py-1.5 rounded-r-full transition-colors ${
          lang === "EN"
            ? "text-white"
            : "text-white/40 hover:text-white/70"
        }`}
        aria-pressed={lang === "EN"}
      >
        EN
      </button>
    </div>
  );
}

export default function TopNav({ active = "/" }: Props) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-black/50 border-b border-white/5">
      <div className="site-container flex items-center justify-between h-16">
        <Link
          href="/"
          className="font-mono tracking-widest text-sm font-semibold"
          aria-label="Home"
        >
          IH
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {items.map((item) => {
              const isActive =
                (item.href === "/" && active === "/") ||
                (item.href === "/gallery" && active === "/gallery") ||
                (item.href === "/content" && active === "/content");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`nav-link ${
                      isActive ? "nav-link-active" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <LangToggle />
      </div>
    </header>
  );
}
