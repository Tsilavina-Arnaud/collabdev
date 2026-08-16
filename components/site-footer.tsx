"use client";

import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { href: "/services", label: "Services" },
  { href: "/packs", label: "Packs" },
  { href: "/equipe", label: "Équipe" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <Link href="/" aria-label="CollabDev - Accueil" className="flex items-center">
          <Image
            src="/logo.png"
            alt="CollabDev"
            width={96}
            height={64}
            className="h-auto w-auto"
          />
        </Link>
        <p className="text-sm text-muted-foreground">
          Créons ensemble, réalisons vos idées.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-2 sm:flex-row sm:px-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CollabDev. Tous droits réservés.
          </p>
        </div>
    </footer>
  );
}
