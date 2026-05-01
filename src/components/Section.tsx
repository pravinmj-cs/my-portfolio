import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  copy?: string;
  leftSlot?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

function WordReveal({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: i * 0.055, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-block"
          style={{ marginRight: "0.26em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export function Section({ id, eyebrow, title, copy, leftSlot, children, className }: SectionProps) {
  return (
    <section id={id} className={cn("section-shell relative z-10", className)}>
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="font-display text-sm font-semibold uppercase tracking-[0.28em] text-reef"
          >
            {eyebrow}
          </motion.p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[0.98] text-white md:text-6xl">
            <WordReveal text={title} />
          </h2>
          {copy ? (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="mt-6 max-w-xl text-base leading-7 text-starlight/74"
            >
              {copy}
            </motion.p>
          ) : null}
          {leftSlot}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}
