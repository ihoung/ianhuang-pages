import Link from "next/link";

type Props = {
  title: string;
  subtitle: string;
  href: string;
  aspect?: string;
};

export default function ProjectCard({
  title,
  subtitle,
  href,
  aspect = "aspect-[4/3]",
}: Props) {
  return (
    <Link
      href={href}
      className="project-card group block"
      aria-label={`View ${title}`}
    >
      <div className={`project-card-media ${aspect} relative`}>
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(168, 85, 247, 0.18) 50%, rgba(236, 72, 153, 0.2) 100%)",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 flex items-end justify-start p-5 md:p-6"
          aria-hidden
        >
          <span className="font-mono text-[10px] tracking-widest uppercase text-white/60 group-hover:text-white/90 transition-colors">
            Open →
          </span>
        </div>
      </div>

      <div className="px-5 md:px-6 py-5 md:py-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-sans font-semibold tracking-tight text-lg md:text-xl">
            {title}
          </h3>
          <span className="font-mono text-[10px] tracking-widest uppercase text-white/50">
            {subtitle}
          </span>
        </div>
      </div>
    </Link>
  );
}
