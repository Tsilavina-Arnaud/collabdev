import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";

type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  image: string;
  alt: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  alt,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <Reveal>
              <Badge variant="outline" className="px-3 py-1">
                {eyebrow}
              </Badge>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                {title}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                {description}
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="hidden lg:block">
            <div className="overflow-hidden rounded-2xl ring-1 ring-foreground/10">
              <Image
                src={image}
                alt={alt}
                width={1800}
                height={1200}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
