import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  copy?: string;
  children: React.ReactNode;
  className?: string;
};

export function Section({ id, eyebrow, title, copy, children, className }: SectionProps) {
  return (
    <section id={id} className={cn("section-shell relative z-10", className)}>
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.28em] text-reef">
            {eyebrow}
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[0.98] text-white md:text-6xl">
            {title}
          </h2>
          {copy ? <p className="mt-6 max-w-xl text-base leading-7 text-starlight/74">{copy}</p> : null}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}
