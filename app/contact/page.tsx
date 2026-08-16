import Image from "next/image";
import { ArrowRight, Clock3, FileCheck, Mail, Phone } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { ContactForm } from "@/components/contact-form";
import { Separator } from "@/components/ui/separator";
import { getServices } from "@/lib/data";

export const metadata = {
  title: "Contact",
  description:
    "Contactez CollabDev : réponse sous 24h ouvrées, devis détaillé sans engagement et accompagnement pendant 12 mois.",
};

const assurances = [
  "Réponse sous 24h ouvrées",
  "Devis détaillé sans engagement",
  "Accompagnement pendant 12 mois selon l'offre",
  "Livraison des fichiers et accès complets",
];

export default async function ContactPage() {
  const { services } = await getServices();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <PageHero
          eyebrow="Contact"
          title={
            <>
              Démarrons <span className="text-primary">ensemble</span>
            </>
          }
          description="Racontez-nous votre projet : objectifs, délais, budget. Nous revenons vers vous rapidement avec la solution adaptée et un devis clair, sans engagement."
          image="/images/analytics.jpg"
          alt="Tableau de bord et analyse de données CollabDev"
        />

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-6">
                <SectionHeading
                  eyebrow="Échangeons"
                  title="Votre projet commence par une conversation"
                  description="Plus vous nous en dites, plus notre proposition sera précise. Voici ce que vous pouvez attendre de nous."
                />

                <Stagger className="space-y-3">
                  {assurances.map((item) => (
                    <StaggerItem key={item}>
                      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <ArrowRight className="size-4" />
                        </span>
                        <span className="text-sm font-medium">{item}</span>
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Mail className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Email direct
                      </p>
                      <p className="font-medium">collab-dev@outlook.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Clock3 className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Disponibilité
                      </p>
                      <p className="font-medium">Lun - Ven, 9h - 18h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Phone className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        À distance, partout en France
                      </p>
                      <p className="font-medium">
                        Projets suivis en visio et par e-mail
                      </p>
                    </div>
                  </div>
                </div>

                <Reveal>
                  <div className="relative overflow-hidden rounded-2xl ring-1 ring-foreground/10">
                    <Image
                      src="/images/hero.jpg"
                      alt="L'équipe CollabDev"
                      width={1800}
                      height={1456}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                </Reveal>
              </div>

              <Reveal delay={0.1} className="lg:pt-2">
                <ContactForm
                  services={services.map((s) => ({ id: s.id, name: s.name }))}
                />
              </Reveal>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <SectionHeading
                  eyebrow="FAQ"
                  title="Les questions qu'on nous pose souvent"
                />
                <Stagger className="space-y-4">
                  {[
                    {
                      q: "Combien de temps dure un projet ?",
                      a: "Un site vitrine se livre en quelques semaines, une boutique en ligne ou une application en 1 à 3 mois selon la complexité. Vous recevez un planning précis dès le devis.",
                    },
                    {
                      q: "Le site m'appartient-il vraiment ?",
                      a: "Oui. Fichiers, code source, accès et domaines vous sont remis à la livraison. Vous ne louez rien et restez maître de votre solution.",
                    },
                    {
                      q: "Que comprend l'accompagnement de 12 mois ?",
                      a: "Selon l'offre : modifications, maintenance, mises à jour et assistance technique sont inclus pendant la première année.",
                    },
                    {
                      q: "Faut-il payer un abonnement mensuel ?",
                      a: "Non. Notre modèle repose sur la réalisation du projet. Seuls l'hébergement et le domaine peuvent occasionner des frais, offerts selon l'offre la première année.",
                    },
                  ].map((item) => (
                    <StaggerItem key={item.q}>
                      <div className="rounded-xl border border-border bg-card p-5">
                        <h3 className="flex items-start gap-3 font-medium">
                          <FileCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                          {item.q}
                        </h3>
                        <p className="mt-2 pl-8 text-sm leading-relaxed text-muted-foreground">
                          {item.a}
                        </p>
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
              <Reveal delay={0.1}>
                <div className="overflow-hidden rounded-2xl ring-1 ring-foreground/10">
                  <Image
                    src="/images/ecommerce.jpg"
                    alt="Boutique en ligne réalisée par CollabDev"
                    width={1800}
                    height={1014}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
