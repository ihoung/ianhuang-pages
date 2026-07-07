export default function ContactSection() {
  const socials = [
    { label: "in", href: "#", full: "LinkedIn" },
    { label: "X", href: "#", full: "X / Twitter" },
    { label: "gh", href: "#", full: "GitHub" },
    { label: "dr", href: "#", full: "Dribbble" },
  ];

  return (
    <section
      id="contact"
      className="site-container min-h-screen flex flex-col items-center text-center py-24 md:py-32 snap-start snap-always"
      aria-label="Contact"
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <h2 className="display-heading">Let&apos;s Create Together</h2>

        <p className="mt-6 max-w-xl text-base md:text-lg text-white/70">
          Have a project in mind? I&apos;d love to hear about it. Let&apos;s
          bring your vision to life.
        </p>

        <a
          href="mailto:hello@example.com"
          className="mt-10 inline-flex items-center gap-3 text-lg md:text-xl font-medium hover:text-accent transition-colors"
        >
          <span aria-hidden className="text-accent">✉</span>
          hello@example.com
        </a>

        <ul className="mt-12 flex items-center justify-center gap-6">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                aria-label={s.full}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[12px] font-mono uppercase text-white/70 hover:text-white hover:border-white/40 transition-colors"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer className="w-full mt-16 pt-8 border-t border-white/5 text-[11px] font-mono uppercase tracking-widest text-white/40 flex items-center justify-between">
        <span>© {new Date().getFullYear()} Ian Huang</span>
        <span>Built with Next.js</span>
      </footer>
    </section>
  );
}
