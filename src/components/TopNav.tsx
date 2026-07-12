"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";

type Item = { href: string; label: string };

const items: Item[] = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Works" },
  { href: "/#contact", label: "Contact" },
];

type Props = {
  active?: string;
};

export function LangToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className="inline-flex items-center rounded-full border border-white/10 text-[11px] font-mono"
      role="group"
      aria-label="Language switch"
    >
      <button
        type="button"
        onClick={() => setLocale("cn")}
        className={`px-2.5 py-1.5 rounded-l-full transition-colors ${
          locale === "cn"
            ? "text-white"
            : "text-white/40 hover:text-white/70"
        }`}
        aria-pressed={locale === "cn"}
      >
        中
      </button>
      <span aria-hidden className="w-px h-3.5 bg-white/10" />
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`px-2.5 py-1.5 rounded-r-full transition-colors ${
          locale === "en"
            ? "text-white"
            : "text-white/40 hover:text-white/70"
        }`}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}

export default function TopNav({ active = "/" }: Props) {
  const { locale } = useLocale();

  const localizedItems: Item[] =
    locale === "cn"
      ? [
          { href: "/", label: "首页" },
          { href: "/gallery", label: "作品" },
          { href: "/#contact", label: "联系" },
        ]
      : items;

  const localizedActive =
    locale === "cn"
      ? (active === "/" ? "/" : active.startsWith("/gallery") ? "/gallery" : "/#contact")
      : active;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-black/50 border-b border-white/5">
      <div className="site-container flex items-center justify-between h-16">
        <Link
          href={`/${locale}/`}
          className="font-mono tracking-widest text-sm font-semibold"
          aria-label="Home"
        >
          IH
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {localizedItems.map((item) => {
              const isActive =
                (item.href === "/" && localizedActive === "/") ||
                (item.href === "/gallery" && localizedActive === "/gallery");
              return (
                <li key={item.href}>
                  <Link
                    href={`/${locale}${item.href}`}
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
