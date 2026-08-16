import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Gift, ShieldCheck, Sparkles } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { getPacks } from "@/lib/data";
import { packContent } from "@/lib/content";

const packDetails: Record<
  string,
  { tagline: string; features: string[]; highlight?: boolean }
> = {
  "Pack Start": {
    tagline: "Idéal pour lancer votre présence en ligne simplement.",
    features: [
      "Site vitrine One Page",
      "Optimisation SEO",
      "Domaine + e-mail professionnel",
      "Hébergement et maintenance 12 mois",
      "Livraison des fichiers et accès complets",
    ],
  },
  "Pack Business": {
    tagline: "La vitrine complète pour développer votre visibilité.",
    features: [
      "Site vitrine Multi-pages",
      "Blog + galerie photos",
      "Optimisation SEO",
      "Domaine + e-mail professionnel",
      "Hébergement et maintenance 12 mois",
      "Livraison des fichiers et accès complets",
    ],
  },
  "Pack E-commerce": {
    tagline: "Vendez en ligne avec une boutique professionnelle.",
    features: [
      "Boutique en ligne complète",
      "Paiement sécurisé",
      "Gestion des commandes et produits",
      "Optimisation SEO",
      "Hébergement et maintenance 12 mois",
      "Livraison des fichiers et accès complets",
    ],
  },
  "Pack IA": {
    tagline: "Un site qui parle et répond pour vous, grâce à l'IA.",
    features: [
      "Site vitrine professionnel",
      "Assistant IA sur mesure",
      "Chatbot IA pour vos visiteurs",
      "Optimisation SEO",
      "Domaine + e-mail professionnel",
      "Hébergement et maintenance 12 mois",
    ],
  },
  "Pack Automatisation": {
    tagline: "Gagnez un temps précieux en automatisant votre activité.",
    features: [
      "Site vitrine professionnel",
      "Automatisations IA de votre métier",
      "Devis, e-mails et factures automatisés",
      "Domaine + e-mail professionnel",
      "Hébergement et maintenance 12 mois",
      "Livraison des fichiers et accès complets",
    ],
  },
  "Pack CRM": {
    tagline: "Centralisez clients, prospects et suivi commercial.",
    features: [
      "CRM entièrement sur mesure",
      "Gestion des clients et prospects",
      "Suivi commercial et relances",
      "Accès et fichiers livrés en totalité",
      "Accompagnement 12 mois",
    ],
  },
  "Pack ERP": {
    tagline: "Ventes, stocks et facturation réunis sur une seule plateforme.",
    features: [
      "ERP entièrement sur mesure",
      "Gestion des ventes et des stocks",
      "Facturation et reporting",
      "Accès et fichiers livrés en totalité",
      "Accompagnement 12 mois",
    ],
  },
};

export const metadata = {
  title: "Packs clé en main",
  description:
    "Packs clé en main CollabDev : présence professionnelle, e-commerce, IA ou automatisation, avec hébergement et maintenance 12 mois inclus.",
};

export const dynamic = 'force-dynamic';

export default async function PacksPage() {
  const packs = await getPacks();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <PageHero
          eyebrow="Packs clé en main"
          title={
            <>
              Tout compris, <span className="text-primary">sans mauvaise surprise</span>
            </>
          }
          description="Domaine, e-mail professionnel, hébergement, SEO et 12 mois de maintenance : nos packs rassemblent tout ce qu'il faut pour lancer votre projet sans multiplier les choix et les fournisseurs."
          image={packContent["Pack Business"].image}
          alt={packContent["Pack Business"].alt}
        />

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {packs.map((p) => {
                const details = packDetails[p.name] ?? {
                  tagline: p.description,
                  features: [],
                };
                const content = packContent[p.name];
                return (
                  <StaggerItem key={p.id} className="h-full">
                    <div
                      className={`relative flex h-full flex-col overflow-hidden rounded-2xl ring-1 ring-foreground/10 ${
                        details.highlight
                          ? "border-2 border-primary"
                          : "border-border"
                      }`}
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={content.image}
                          alt={content.alt}
                          width={1800}
                          height={1200}
                          className="h-full w-full object-cover"
                        />
                        <Badge className="absolute left-4 top-4">Pack</Badge>
                        <span className="absolute bottom-4 left-4 rounded-full bg-background/90 px-3 py-1 text-sm font-semibold text-primary backdrop-blur">
                          {formatCurrency(p.price)}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h2 className="text-xl font-semibold">{p.name}</h2>
                        <p className="mt-1 text-sm font-medium text-primary">
                          {details.tagline}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {p.description}
                        </p>
                        {details.features.length > 0 ? (
                          <ul className="mt-5 space-y-2">
                            {details.features.map((f) => (
                              <li
                                key={f}
                                className="flex items-start gap-2 text-sm"
                              >
                                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        <div className="mt-auto pt-6">
                          <Button
              nativeButton={false}
                            render={<Link href="/contact" />}
                            className="h-10 w-full"
                          >
                            Demander ce pack
                            <ArrowRight />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <SectionHeading
              align="center"
              eyebrow="Inclus dans chaque pack"
              title="Ce qui est toujours garanti"
            />
            <Stagger className="mt-12 grid gap-5 sm:grid-cols-3">
              {[
                {
                  icon: Gift,
                  title: "Hébergement & domaine",
                  text: "Offerts selon l'offre, avec e-mail professionnel à votre nom.",
                },
                {
                  icon: ShieldCheck,
                  title: "Propriété totale",
                  text: "Vous êtes propriétaire de votre site, avec tous les accès et fichiers.",
                },
                {
                  icon: Sparkles,
                  title: "12 mois d'accompagnement",
                  text: "Modifications et maintenance incluses pendant la première année.",
                },
              ].map((item) => (
                <StaggerItem key={item.title} className="h-full">
                  <div className="h-full rounded-xl border border-border bg-card p-6 text-center">
                    <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <item.icon className="size-6" />
                    </span>
                    <h3 className="mt-4 font-medium">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <Reveal>
              <div className="flex flex-col items-center gap-4 rounded-2xl bg-primary px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
                <div>
                  <h2 className="text-2xl font-semibold text-primary-foreground">
                    Un besoin spécifique ?
                  </h2>
                  <p className="mt-1 text-primary-foreground/80">
                    Nous construisons aussi des solutions 100% sur mesure.
                    Parlons-en !
                  </p>
                </div>
                <Button
              nativeButton={false}
                  render={<Link href="/contact" />}
                  size="lg"
                  className="h-12 shrink-0 bg-primary-foreground px-7 text-base text-primary hover:bg-primary-foreground/90"
                >
                  Discuter de mon projet
                  <ArrowRight />
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
