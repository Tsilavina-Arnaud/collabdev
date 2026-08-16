"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";

const faqs = [
  {
    q: "Combien coûte un site web ?",
    a: "Nos sites vitrines démarrent à partir de 750 € et nos boutiques en ligne à partir de 5 000 €. Le prix exact dépend de vos besoins : vous recevez toujours un devis détaillé et sans engagement avant de commencer.",
  },
  {
    q: "Le site m'appartient-il vraiment ?",
    a: "Oui, à 100 %. Fichiers, code source, accès et domaines vous sont remis à la livraison. Vous ne louez rien : vous êtes propriétaire de votre solution et libre de la faire évoluer avec nous ou ailleurs.",
  },
  {
    q: "Combien de temps dure un projet ?",
    a: "Un site vitrine se livre en quelques semaines, une boutique en ligne ou une application en 1 à 3 mois selon la complexité. Un planning précis vous est communiqué dès le devis.",
  },
  {
    q: "Que comprend l'accompagnement de 12 mois ?",
    a: "Selon l'offre choisie : modifications, maintenance, mises à jour et assistance technique sont incluses pendant la première année, sans abonnement caché.",
  },
  {
    q: "Faut-il payer un abonnement mensuel ?",
    a: "Non. Notre modèle repose sur la réalisation du projet. Seuls l'hébergement et le nom de domaine peuvent occasionner des frais, offerts selon l'offre la première année.",
  },
  {
    q: "Pourquoi travailler avec une équipe de trois personnes ?",
    a: "Deux développeurs seniors et un designer qualifié se complètent pour livrer un produit performant techniquement et soigné visuellement, avec un interlocuteur dédié du début à la fin.",
  },
];

export function FaqSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-10">
          <Reveal className="mx-auto max-w-2xl space-y-3 text-center">
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">
              FAQ
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Questions fréquentes
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Tout ce que vous devez savoir avant de vous lancer. Une autre
              question ? Écrivez-nous, nous répondons sous 24h ouvrées.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion className="rounded-2xl border border-border bg-card px-6">
              {faqs.map((item) => (
                <AccordionItem key={item.q}>
                  <AccordionTrigger className="py-4 text-base">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-2 text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
