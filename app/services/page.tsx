import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Clock3 } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { Stagger, StaggerItem, Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { getServices } from "@/lib/data";
import { categoryContent, processSteps } from "@/lib/content";

export const metadata = {
  title: "Nos services",
  description:
    "Sites web, applications, IA & automatisation, design & marketing : découvrez toutes les prestations CollabDev et demandez votre devis.",
};

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const { services, categories } = await getServices();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <PageHero
          eyebrow="Nos services"
          title={
            <>
              Des services complets pour <span className="text-primary">votre digital</span>
            </>
          }
          description="Chaque prestation est réalisée sur mesure par deux développeurs seniors et un designer qualifié. Vous trouvez ici l'offre adaptée à votre besoin, avec un prix clair et un accompagnement de 12 mois."
          image={categoryContent["Sites web"].image}
          alt={categoryContent["Sites web"].alt}
        />

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:px-6 sm:py-20">
            {categories.map((category, idx) => {
              const content = categoryContent[category];
              const catServices = services.filter(
                (s) => s.category === category,
              );
              const reversed = idx % 2 === 1;
              return (
                <div key={category} className="space-y-6">
                  <SectionHeading
                    eyebrow={`0${idx + 1} · ${category}`}
                    title={category}
                    description={content.description}
                  />
                  <div
                    className={`grid items-center gap-8 lg:grid-cols-2 ${
                      reversed ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <Reveal>
                      <div className="overflow-hidden rounded-2xl ring-1 ring-foreground/10">
                        <Image
                          src={content.image}
                          alt={content.alt}
                          width={1800}
                          height={1200}
                          className="aspect-[4/3] w-full object-cover"
                        />
                      </div>
                    </Reveal>
                    <div>
                      <ul className="mb-6 grid gap-2">
                        {content.benefits.map((b) => (
                          <li
                            key={b}
                            className="flex items-start gap-2 text-sm"
                          >
                            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <Check className="size-3" />
                            </span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                      <Stagger className="grid gap-4 sm:grid-cols-2">
                        {catServices.map((s) => (
                          <StaggerItem key={s.id} className="h-full">
                            <Card className="flex h-full flex-col">
                              <CardHeader>
                                <CardTitle>{s.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  {s.description}
                                </p>
                              </CardHeader>
                              <CardContent className="mt-auto">
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-semibold text-primary">
                                    {formatCurrency(s.price)}
                                  </span>
                                  <Button
              nativeButton={false}
                                    render={<Link href="/contact" />}
                                    variant="outline"
                                    size="sm"
                                    className="h-9"
                                  >
                                    Devis
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </StaggerItem>
                        ))}
                      </Stagger>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <SectionHeading
              align="center"
              eyebrow="Comment ça se passe ?"
              title="Un accompagnement de bout en bout"
              description="Du premier échange à la livraison, vous savez toujours où en est votre projet."
            />
            <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step) => (
                <StaggerItem key={step.step} className="h-full">
                  <div className="h-full rounded-xl border border-border bg-card p-6">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                      {step.step}
                    </span>
                    <h3 className="mt-4 font-medium">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal className="mt-12">
              <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 text-center sm:flex-row sm:text-left">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Clock3 className="size-5" />
                  </span>
                  <div>
                    <p className="font-medium">
                      Vous ne savez pas par où commencer ?
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Décrivez votre besoin, nous vous conseillons l'offre la
                      plus adaptée.
                    </p>
                  </div>
                </div>
                <Button
              nativeButton={false}
                  render={<Link href="/contact" />}
                  className="h-10 shrink-0 px-5"
                >
                  Demander un devis gratuit
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
