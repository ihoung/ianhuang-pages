"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const restImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const restImg = restImgRef.current;
    if (!section || !restImg) return;

    let rafId = 0;
    let pendingX = 0;
    let pendingY = 0;

    const apply = () => {
      rafId = 0;
      const rect = restImg.getBoundingClientRect();
      // Skip if the wrapper has no layout yet.
      if (rect.width === 0 || rect.height === 0) return;
      const mx = ((pendingX - rect.left) / rect.width) * 100;
      const my = ((pendingY - rect.top) / rect.height) * 100;
      restImg.style.setProperty("--mask-x", `${mx}%`);
      restImg.style.setProperty("--mask-y", `${my}%`);
      restImg.style.setProperty("--torch-radius", "var(--mask-spot)");
    };

    const onMove = (e: MouseEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      restImg.style.setProperty("--torch-radius", "0px");
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);

    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen overflow-hidden animate-fade-up snap-start snap-always"
      aria-label="Intro"
    >
      <div aria-hidden className="absolute inset-0 hero-dot-grid pointer-events-none" />
      <div className="relative z-10 hero-container min-h-screen flex flex-col lg:flex-row items-center justify-center pt-28 md:pt-36 lg:pt-44 pb-16 md:pb-24 lg:gap-x-2 xl:gap-x-4 2xl:gap-x-6">
        <div className="flex flex-col items-start justify-center order-1 lg:order-1 lg:max-w-[560px] xl:max-w-[680px] 2xl:max-w-[780px]">
          <div className="flex items-baseline w-full">
            <h1 className="display-heading whitespace-nowrap">
              Ian Huang
            </h1>
            <div className="possessive-s">&apos;s</div>
          </div>

          <p className="mt-4 md:mt-6 max-w-xl text-base md:text-lg text-white/60 leading-relaxed">
            Animation &amp; Game <br className="hidden sm:block" /> Pipeline Technical Director, Programmer &amp; Technical Animator
          </p>

          <div className="mt-8 md:mt-10 flex flex-col xs:flex-row items-start gap-4">
            <Link href="/gallery" className="btn btn-primary">
              View My Work
              <span aria-hidden>→</span>
            </Link>
            <a href="/#contact" className="btn btn-outline">
              Get in Touch
            </a>
          </div>

          <div className="mt-12 md:mt-20 font-mono text-[11px] tracking-widest uppercase text-white/30">
            Scroll to explore
          </div>
        </div>

        <div className="flex items-center justify-center lg:justify-start order-2 lg:order-2">
          <div className="word-cloud-wrapper word-cloud-align relative">
            {/* Lower layer: torchlight-revealed rest of the word-cloud */}
            <Image
              ref={restImgRef}
              src="/word-cloud-rest.png"
              alt=""
              aria-hidden
              fill
              unoptimized
              sizes="(max-width: 1024px) 50vw, 40vw"
              className="object-contain word-cloud-glow word-cloud-rest z-0"
              priority
            />
            {/* Top layer: BLOG text, always visible (same layer as name+brief) */}
            <Image
              src="/word-cloud-blog.png"
              alt="Decorative word cloud"
              fill
              unoptimized
              sizes="(max-width: 1024px) 50vw, 40vw"
              className="object-contain word-cloud-glow z-10"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
