import { Star } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

type Testimonial = {
  name: string;
  role: string;
  rating: number;
  text: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Hery R.",
    role: "Gérant, société de services",
    rating: 5,
    text: "Équipe réactive et sérieuse. Notre site vitrine a été livré en avance, conforme à ce qui avait été annoncé, et nous sommes très satisfaits du résultat.",
  },
  {
    name: "Miora A.",
    role: "Fondatrice, boutique en ligne",
    rating: 5,
    text: "La boutique a été développée sur mesure et le suivi a été exemplaire. Un an après, l'accompagnement et la maintenance sont toujours au rendez-vous.",
  },
  {
    name: "Tojo N.",
    role: "Directeur, PME",
    rating: 4,
    text: "Un vrai travail d'équipe : le site est rapide, clair et bien référencé. Nous avons juste eu besoin de quelques ajustements après la livraison, effectués rapidement.",
  },
  {
    name: "Lova R.",
    role: "Responsable commerciale",
    rating: 5,
    text: "Le CRM sur mesure a changé notre façon de travailler. Les fichiers et accès nous ont été remis intégralement : nous sommes totalement propriétaires de la solution.",
  },
  {
    name: "Sitraka M.",
    role: "Auto-entrepreneur",
    rating: 4,
    text: "Un accompagnement transparent et sans frais cachés, exactement comme annoncé. Je recommande pour qui veut un site sérieux à prix clair.",
  },
  {
    name: "Naina T.",
    role: "Gérante, agence de voyage",
    rating: 5,
    text: "L'assistant IA répond à nos clients en dehors des heures d'ouverture, et l'automatisation nous fait gagner un temps précieux. Merci pour votre disponibilité !",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} étoiles sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${
            i < rating
              ? "fill-primary text-primary"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const average =
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Avis des utilisateurs"
            title="Ils nous ont fait confiance"
            description="Sites vitrines, boutiques en ligne, CRM ou solutions IA : la satisfaction de nos clients est notre meilleure publicité."
          />
          <Reveal delay={0.1} className="flex shrink-0 items-center gap-3">
            <span className="text-4xl font-semibold text-primary">
              {average.toFixed(1)}
            </span>
            <div>
              <Stars rating={5} />
              <p className="mt-1 text-sm text-muted-foreground">
                note moyenne sur 5
              </p>
            </div>
          </Reveal>
        </div>

        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.name} className="h-full">
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <Stars rating={t.rating} />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  « {t.text} »
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {t.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
