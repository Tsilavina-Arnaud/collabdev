"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Award, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "2", label: "développeurs seniors" },
  { value: "12", label: "mois d'accompagnement" },
  { value: "100%", label: "propriété de votre solution" },
];

export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-item]",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
        },
      );

      gsap.fromTo(
        "[data-hero-img]",
        { scale: 1.18, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" },
      );

      gsap.fromTo(
        "[data-float-card]",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          delay: 0.6,
          ease: "power3.out",
        },
      );

      gsap.to("[data-float-card]", {
        y: -12,
        duration: 2.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.4,
        delay: 1,
      });

      gsap.to("[data-hero-img]",
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-hidden border-b border-border"
    >
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
        <div className="max-w-2xl space-y-6">
          <Badge variant="outline" data-hero-item className="px-3 py-1">
            <Award className="size-3.5 text-primary" />
            Deux développeurs seniors et un designer
          </Badge>
          <h1
            data-hero-item
            className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            Créons ensemble,{" "}
            <span className="text-primary">réalisons vos idées</span>
          </h1>
          <p
            data-hero-item
            className="max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            CollabDev conçoit des solutions digitales sur mesure pour
            développer votre présence en ligne et automatiser votre activité :
            sites web, e-commerce, applications, CRM et solutions IA.
          </p>
          <div
            data-hero-item
            className="flex flex-wrap gap-3"
          >
            <Button
              nativeButton={false}
              render={<Link href="/contact" />}
              size="lg"
              className="h-12 px-7 text-base"
            >
              Demander un devis
              <ArrowRight />
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/services" />}
              variant="outline"
              size="lg"
              className="h-12 px-7 text-base"
            >
              Découvrir nos services
            </Button>
          </div>
        </div>

        <div className="relative mt-14 lg:mt-0">
          <div className="relative overflow-hidden rounded-2xl ring-1 ring-foreground/10">
            <Image
              src="/images/hero.jpg"
              alt="Équipe CollabDev au travail"
              width={1800}
              height={1456}
              priority
              data-hero-img
              className="aspect-[10/9] w-full object-cover"
            />
          </div>

          <div
            data-float-card
            className="absolute -left-4 bottom-10 hidden items-center gap-3 rounded-xl border border-border bg-background/95 p-4 backdrop-blur sm:flex"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <p className="text-sm font-medium">Produit 100% à vous</p>
              <p className="text-xs text-muted-foreground">
                Fichiers et accès remis à la livraison
              </p>
            </div>
          </div>

          <div
            data-float-card
            className="absolute -right-4 top-8 hidden items-center gap-3 rounded-xl border border-border bg-background/95 p-4 backdrop-blur sm:flex"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="size-5" />
            </span>
            <div>
              <p className="text-sm font-medium">Équipe complémentaire</p>
              <p className="text-xs text-muted-foreground">
                Code, design et suivi commercial
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
          {stats.map((s, i) => (
            <div
              key={s.label}
              data-hero-item
              className="flex items-baseline gap-3 py-5 sm:justify-center sm:py-6"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className="text-3xl font-semibold text-primary sm:text-4xl">
                {s.value}
              </span>
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
