export const categoryContent: Record<
  string,
  {
    image: string;
    alt: string;
    description: string;
    benefits: string[];
  }
> = {
  "Sites web": {
    image: "/images/code.jpg",
    alt: "Développement de site web par l'équipe CollabDev",
    description:
      "Une présence en ligne professionnelle, rapide et adaptée à votre activité : vitrine, boutique, refonte ou site complet multi-pages.",
    benefits: [
      "Design sur mesure et responsive mobile",
      "Référencement SEO dès la livraison",
      "Hébergement, domaine et e-mail pro selon l'offre",
      "Modifications et maintenance 12 mois incluses",
    ],
  },
  Applications: {
    image: "/images/mobile.jpg",
    alt: "Application web et mobile CollabDev",
    description:
      "Des logiciels métier et applications qui centralisent vos données, simplifient vos processus et font gagner du temps à vos équipes.",
    benefits: [
      "CRM, ERP et applications web sur mesure",
      "Applications mobiles Android et iOS",
      "Interfaces claires et simples à utiliser",
      "Évolution et intégrations possibles",
    ],
  },
  "IA & Automatisation": {
    image: "/images/ai.jpg",
    alt: "Solution d'intelligence artificielle CollabDev",
    description:
      "Assistants intelligents, chatbots et automatisations qui répondent à vos clients et exécutent vos tâches répétitives 24h/24.",
    benefits: [
      "Chatbots IA et classiques",
      "Assistants basés sur votre contenu",
      "Automatisation des devis, e-mails et factures",
      "Traitement avancé avec intelligence artificielle",
    ],
  },
  "Design & Marketing": {
    image: "/images/design.jpg",
    alt: "Travail de design graphique CollabDev",
    description:
      "Une identité visuelle forte et des supports soignés qui rendent votre marque reconnaissable et professionnelle.",
    benefits: [
      "Logo et identité visuelle complète",
      "Cartes de visite et supports imprimés",
      "Cohérence graphique sur tous vos canaux",
      "Optimisation SEO pour la visibilité",
    ],
  },
};

export const packContent: Record<
  string,
  { image: string; alt: string }
> = {
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

export const processSteps = [
  {
    step: "01",
    title: "Échange & cadrage",
    description:
      "Nous analysons votre activité, vos objectifs et vos contraintes pour définir précisément le périmètre du projet.",
  },
  {
    step: "02",
    title: "Proposition claire",
    description:
      "Vous recevez un devis détaillé, sans engagement : prestations, planning et prix transparents.",
  },
  {
    step: "03",
    title: "Réalisation & suivi",
    description:
      "L'équipe développe et conçoit votre solution avec des points de suivi réguliers jusqu'à validation.",
  },
  {
    step: "04",
    title: "Livraison & accompagnement",
    description:
      "Vous recevez votre produit avec tous les accès et fichiers, et restez accompagné 12 mois.",
  },
];

export const engagements = [
  {
    title: "Produit qui vous appartient",
    description:
      "Le produit développé vous est remis avec ses accès et fichiers : vous gardez la maîtrise totale de votre solution.",
  },
  {
    title: "Aucun abonnement caché",
    description:
      "Notre modèle repose sur la réalisation du projet. Pas de location ni de frais récurrents sur la prestation initiale.",
  },
  {
    title: "12 mois d'accompagnement",
    description:
      "Modifications et maintenance comprises pendant la première année selon les conditions de l'offre choisie.",
  },
  {
    title: "Équipe complémentaire",
    description:
      "Deux développeurs seniors et un designer travaillent ensemble pour livrer un produit performant et professionnel.",
  },
];
