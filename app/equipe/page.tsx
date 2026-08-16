import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  FileCheck,
  Handshake,
  LifeBuoy,
  Palette,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "L'équipe",
  description:
    "Deux développeurs seniors et un designer qualifié : découvrez l'équipe CollabDev, notre méthode et nos valeurs.",
};

const teamRoles = [
  {
    icon: FileCheck,
    title: "Développeur senior",
    role: "Administration & facturation",
    description:
      "Pilotage administratif, devis, facturation, suivi client et coordination commerciale. Un interlocuteur unique tout au long du projet.",
  },
  {
    icon: Code2,
    title: "Développeur senior",
    role: "Technique",
    description:
      "Architecture, développement, intégrations, sécurité, performance et maintenance. Un code propre, durable et évolutif.",
  },
  {
    icon: Palette,
    title: "Designer qualifié",
    role: "UI/UX",
    description:
      "Identité visuelle, interfaces modernes et cohérence graphique sur l'ensemble du projet, du logo à la page de connexion.",
  },
];

const values = [
  {
    icon: Wrench,
    title: "Sur mesure",
    text: "Nous partons de votre activité et construisons la solution autour de vos besoins, pas l'inverse.",
  },
  {
    icon: ShieldCheck,
    title: "Propriété",
    text: "Vous ne louez pas votre site : le produit développé vous appartient, avec ses fichiers et accès.",
  },
  {
    icon: LifeBuoy,
    title: "12 mois",
    text: "Modifications et maintenance gratuites pendant la première année, selon l'offre choisie.",
  },
  {
    icon: FileCheck,
    title: "Transparence",
    text: "Hébergement et domaine offerts selon l'offre, devis détaillé et sans frais cachés.",
  },
];

export default function EquipePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <PageHero
          eyebrow="Notre équipe"
          title={
            <>
              Une collaboration{" "}
              <span className="text-primary">complémentaire</span>
            </>
          }
          description="Chaque projet réunit deux développeurs seniors et un designer qualifié. Une équipe resserrée et complémentaire qui livre un produit performant, beau et durable."
          image="/images/handshake.jpg"
          alt="Poignée de main entre un client et l'équipe CollabDev"
        />

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <SectionHeading
              eyebrow="Les profils"
              title="Trois expertises, un seul objectif : votre réussite"
              description="Pas de grande structure anonyme : une équipe resserrée qui connaît votre dossier et reste disponible."
            />
            <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {teamRoles.map((member) => (
                <StaggerItem key={member.role} className="h-full">
                  <Card className="h-full ring-1 ring-foreground/10">
                    <CardHeader>
                      <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <member.icon className="size-6" />
                      </div>
                      <Badge variant="secondary" className="w-fit">
                        {member.role}
                      </Badge>
                      <CardTitle>{member.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {member.description}
                      </p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <Reveal className="order-2 lg:order-1">
                <div className="overflow-hidden rounded-2xl ring-1 ring-foreground/10">
                  <Image
                    src="/images/office.jpg"
                    alt="Espace de travail de l'équipe CollabDev"
                    width={1800}
                    height={1200}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </Reveal>
              <div className="order-1 space-y-6 lg:order-2">
                <SectionHeading
                  eyebrow="Notre façon de travailler"
                  title="Une méthode qui vous implique à chaque étape"
                  description="Vous n'êtes jamais livré à vous-même : nous échangeons, validons et ajustons ensemble pour livrer exactement ce dont vous avez besoin."
                />
                <Stagger className="space-y-4">
                  {[
                    {
                      title: "Un interlocuteur dédié",
                      text: "Suivi régulier et réponses rapides : vous savez toujours où en est votre projet.",
                    },
                    {
                      title: "Points de validation réguliers",
                      text: "Design et fonctionnalités sont validés au fur et à mesure, pas seulement à la fin.",
                    },
                    {
                      title: "Livraison complète",
                      text: "Fichiers, accès, documentation et formation : vous êtes autonome dès la réception.",
                    },
                  ].map((item) => (
                    <StaggerItem key={item.title}>
                      <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Users className="size-5" />
                        </span>
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <SectionHeading
                  eyebrow="Nos valeurs"
                  title="Des principes simples, tenus à chaque projet"
                />
                <Stagger className="grid gap-4 sm:grid-cols-2">
                  {values.map((item) => (
                    <StaggerItem key={item.title} className="h-full">
                      <div className="h-full space-y-3 rounded-xl border border-border bg-card p-5">
                        <item.icon className="size-6 text-primary" />
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.text}
                        </p>
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
              <Reveal delay={0.1}>
                <div className="overflow-hidden rounded-2xl ring-1 ring-foreground/10">
                  <Image
                    src="/images/meeting.jpg"
                    alt="Réunion d'équipe CollabDev"
                    width={1800}
                    height={1200}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl bg-primary">
                <div className="relative mx-auto max-w-2xl px-6 py-16 text-center">
                  <Handshake className="mx-auto size-10 text-primary-foreground" />
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
                    Travaillons ensemble
                  </h2>
                  <p className="mt-4 leading-relaxed text-primary-foreground/80">
                    Présentez-nous votre projet : nous vous répondons sous 24h
                    ouvrées avec une solution adaptée et un devis clair.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Button
                      nativeButton={false}
                      render={<Link href="/contact" />}
                      size="lg"
                      className="h-12 bg-primary-foreground px-7 text-base text-primary hover:bg-primary-foreground/90"
                    >
                      Nous contacter
                      <ArrowRight />
                    </Button>
                    <Button
                      nativeButton={false}
                      render={<Link href="/services" />}
                      variant="outline"
                      size="lg"
                      className="h-12 border-primary-foreground/40 px-7 text-base text-primary-foreground bg-primary-foreground/10 hover:bg-[#349DFF] hover:text-primary-foreground"
                    >
                      Voir nos services
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
