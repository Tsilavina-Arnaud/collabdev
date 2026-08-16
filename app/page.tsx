import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Check,
  FileCheck,
  LifeBuoy,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FaqSection } from "@/components/faq-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { getServices, getPacks } from "@/lib/data";
import { categoryContent, engagements, processSteps } from "@/lib/content";

const engagementIcons = [ShieldCheck, FileCheck, LifeBuoy, Award];

export const dynamic = "force-dynamic";

export default async function Home() {
  const { services, categories } = await getServices();
  const packs = await getPacks();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <Hero />

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <SectionHeading
                  eyebrow="Pourquoi CollabDev"
                  title="Des engagements clairs, une équipe qui travaille pour vous"
                  description="Nous construisons des solutions que vous possédez vraiment, avec un accompagnement complet et sans surprise sur la facture."
                />
                <Stagger className="grid gap-4 sm:grid-cols-2">
                  {engagements.map((item, i) => {
                    const Icon = engagementIcons[i];
                    return (
                      <StaggerItem key={item.title}>
                        <div className="h-full space-y-3 rounded-xl border border-border bg-card p-5">
                          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="size-5" />
                          </span>
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </StaggerItem>
                    );
                  })}
                </Stagger>
              </div>

              <Reveal delay={0.1} className="relative">
                <div className="overflow-hidden rounded-2xl ring-1 ring-foreground/10">
                  <Image
                    src="/images/meeting.jpg"
                    alt="Réunion de travail avec l'équipe CollabDev"
                    width={1800}
                    height={1200}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 left-6 hidden items-center gap-3 rounded-xl border border-border bg-background/95 p-4 backdrop-blur sm:flex">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">Solutions sur mesure</p>
                    <p className="text-xs text-muted-foreground">
                      Pensées autour de votre métier
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                eyebrow="Nos services"
                title="Des prestations claires et sur mesure"
                description="Sites web, applications, intelligence artificielle et design : chaque service est pensé pour répondre réellement à votre besoin."
              />
              <Button
                nativeButton={false}
                render={<Link href="/services" />}
                variant="outline"
                className="h-10 shrink-0 px-5"
              >
                Tous les services
                <ArrowRight />
              </Button>
            </div>

            <Stagger className="space-y-8">
              {categories.map((category) => {
                const content = categoryContent[category];
                const catServices = services.filter(
                  (s) => s.category === category,
                );
                return (
                  <StaggerItem key={category}>
                    <div className="grid overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[0.9fr_1.1fr]">
                      <div className="relative min-h-56">
                        <Image
                          src={content.image}
                          alt={content.alt}
                          width={1800}
                          height={1200}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-6 sm:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h3 className="text-xl font-semibold">{category}</h3>
                          <Badge variant="secondary">
                            {catServices.length}{" "}
                            {catServices.length > 1
                              ? "prestations"
                              : "prestation"}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {content.description}
                        </p>
                        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                          {content.benefits.map((b) => (
                            <li
                              key={b}
                              className="flex items-start gap-2 text-sm"
                            >
                              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6 flex flex-wrap gap-2">
                          {catServices.slice(0, 3).map((s) => (
                            <Badge key={s.id} variant="outline" className="h-6">
                              {s.name} · {formatCurrency(s.price)}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          nativeButton={false}
                          render={<Link href="/contact" />}
                          variant="outline"
                          size="sm"
                          className="mt-6 h-9"
                        >
                          Demander un devis
                          <ArrowRight />
                        </Button>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                eyebrow="Packs clé en main"
                title="Un résultat global, sans choix compliqué"
                description="Présence professionnelle, visibilité, e-commerce ou IA : choisissez le pack qui couvre l'ensemble de vos besoins."
              />
              <Button
                nativeButton={false}
                render={<Link href="/packs" />}
                variant="outline"
                className="h-10 shrink-0 px-5"
              >
                Tous les packs
                <ArrowRight />
              </Button>
            </div>

            <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {packs.slice(0, 3).map((p) => (
                <StaggerItem key={p.id} className="h-full">
                  <Card className="group h-full ring-1 ring-foreground/10">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={packContent(p.name).image}
                        alt={packContent(p.name).alt}
                        width={1800}
                        height={1200}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <Badge className="absolute left-4 top-4">Pack</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle>{p.name}</CardTitle>
                      <CardDescription>{p.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between gap-3">
                      <span className="text-xl font-semibold text-primary">
                        {formatCurrency(p.price)}
                      </span>
                      <Button
                        nativeButton={false}
                        render={<Link href="/contact" />}
                        size="sm"
                        className="h-9"
                      >
                        Demander ce pack
                      </Button>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <TestimonialsSection />

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <SectionHeading
              align="center"
              eyebrow="Notre méthode"
              title="Quatre étapes vers votre solution"
              description="Un processus simple et transparent, du premier échange à l'accompagnement après livraison."
            />
            <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step) => (
                <StaggerItem key={step.step} className="h-full">
                  <div className="relative h-full rounded-xl border border-border bg-card p-6">
                    <span className="text-4xl font-semibold text-primary/20">
                      {step.step}
                    </span>
                    <h3 className="mt-3 font-medium">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <FaqSection />

        <section>
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl bg-primary">
                <Image
                  src="/images/office.jpg"
                  alt="Équipe CollabDev en plein travail"
                  width={1800}
                  height={1200}
                  className="absolute inset-0 h-full w-full object-cover opacity-20"
                />
                <div className="relative mx-auto max-w-2xl px-6 py-16 text-center sm:py-20">
                  <Badge className="bg-primary-foreground text-primary">
                    Prêt à commencer ?
                  </Badge>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
                    Racontez-nous votre projet
                  </h2>
                  <p className="mt-4 leading-relaxed text-primary-foreground/80">
                    Nous vous proposons la solution adaptée et un devis clair,
                    sans engagement. Réponse sous 24h ouvrées.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Button
                      nativeButton={false}
                      render={<Link href="/contact" />}
                      size="lg"
                      className="h-12 bg-primary-foreground px-7 text-base text-primary hover:bg-primary-foreground/90"
                    >
                      Demander un devis
                      <ArrowRight />
                    </Button>
                    <Button
                      nativeButton={false}
                      render={<Link href="/packs" />}
                      variant="outline"
                      size="lg"
                      className="h-12 border-primary-foreground/40 px-7 text-base text-primary-foreground bg-primary-foreground/10 hover:bg-[#349DFF] hover:text-primary-foreground"
                    >
                      Voir les packs
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function packContent(name: string) {
  const map: Record<string, { image: string; alt: string }> = {
    "Pack Start": { image: "/images/office.jpg", alt: "Pack Start CollabDev" },
    "Pack Business": {
      image: "/images/analytics.jpg",
      alt: "Pack Business CollabDev",
    },
    "Pack E-commerce": {
      image: "/images/ecommerce.jpg",
      alt: "Pack E-commerce CollabDev",
    },
    "Pack IA": { image: "/images/ai.jpg", alt: "Pack IA CollabDev" },
    "Pack Automatisation": {
      image: "/images/code.jpg",
      alt: "Pack Automatisation CollabDev",
    },
    "Pack CRM": { image: "/images/meeting.jpg", alt: "Pack CRM CollabDev" },
    "Pack ERP": { image: "/images/handshake.jpg", alt: "Pack ERP CollabDev" },
  };
  return map[name] ?? { image: "/images/office.jpg", alt: name };
}
