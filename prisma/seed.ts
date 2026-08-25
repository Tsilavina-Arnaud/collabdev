import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const services = [
  { name: "Site vitrine One Page", description: "Un site sur une seule page pour présenter l'activité, ses services et ses coordonnées.", price: 750, category: "Sites web" },
  { name: "Site vitrine Multi-pages", description: "Un site complet : accueil, l'activité, services, réalisations, blog, contact.", price: 1500, category: "Sites web" },
  { name: "Refonte de site vitrine", description: "Modernisation d'un site existant : design, structure, expérience utilisateur.", price: 1500, category: "Sites web" },
  { name: "Site e-commerce", description: "Boutique en ligne avec produits, commandes, paiements et parcours d'achat.", price: 5000, category: "Sites web" },
  { name: "CRM sur mesure", description: "Centralisation des clients, prospects, historiques et suivis commerciaux.", price: 20000, category: "Applications" },
  { name: "ERP sur mesure", description: "Plateforme réunissant ventes, stocks, facturation, ressources et reporting.", price: 30000, category: "Applications" },
  { name: "Application Web sur mesure", description: "Logiciel métier accessible depuis un navigateur pour un processus précis.", price: 15000, category: "Applications" },
  { name: "Application Mobile Android/iOS", description: "Application mobile avec compte client, commandes, notifications et suivi.", price: 20000, category: "Applications" },
  { name: "Assistant IA", description: "Assistant utilisant l'IA pour répondre, rechercher des informations ou guider.", price: 2500, category: "IA & Automatisation" },
  { name: "Chatbot IA", description: "Agent conversationnel capable de dialoguer avec les visiteurs.", price: 3000, category: "IA & Automatisation" },
  { name: "Chatbot classique", description: "Chatbot basé sur des scénarios et réponses prédéfinis.", price: 900, category: "IA & Automatisation" },
  { name: "Automatisation", description: "Automatisation de tâches répétitives : e-mails, devis, factures, notifications.", price: 2500, category: "IA & Automatisation" },
  { name: "Automatisation avancée avec IA", description: "Automatisations complexes combinant règles métier et intelligence artificielle.", price: 5000, category: "IA & Automatisation" },
  { name: "Optimisation SEO", description: "Amélioration de la visibilité sur les moteurs de recherche.", price: 250, category: "Design & Marketing" },
  { name: "Carte de visite basique", description: "Carte de visite professionnelle avec les informations essentielles.", price: 100, category: "Design & Marketing" },
  { name: "Carte de visite premium", description: "Version travaillée avec direction graphique poussée et identité forte.", price: 250, category: "Design & Marketing" },
  { name: "Logo professionnel", description: "Logo adapté à l'activité, reconnaissable sur tous les supports.", price: 800, category: "Design & Marketing" },
  { name: "Identité visuelle complète", description: "Univers graphique de la marque : logo, couleurs, typographies, règles.", price: 2000, category: "Design & Marketing" },
];

const packs = [
  { name: "Pack Start", description: "Site One Page, SEO, domaine + e-mail pro, hébergement et maintenance 12 mois.", price: 1000 },
  { name: "Pack Business", description: "Site Multi-pages, SEO, blog + galerie, domaine + e-mail pro, hébergement et maintenance 12 mois.", price: 2500 },
  { name: "Pack E-commerce", description: "Boutique en ligne, paiement sécurisé, gestion des commandes, SEO, hébergement et maintenance 12 mois.", price: 6000 },
  { name: "Pack IA", description: "Site, assistant IA, chatbot IA, SEO, domaine + e-mail pro, hébergement et maintenance 12 mois.", price: 5000 },
  { name: "Pack Automatisation", description: "Site, IA + automatisations métier, domaine + e-mail pro, hébergement et maintenance 12 mois.", price: 8000 },
  { name: "Pack CRM", description: "Solution CRM sur mesure.", price: 20000 },
  { name: "Pack ERP", description: "Solution ERP sur mesure.", price: 30000 },
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  for (const s of services) {
    await prisma.service.upsert({
      where: { name: s.name },
      update: {},
      create: {
        name: s.name,
        slug: slugify(s.name),
        description: s.description,
        price: s.price,
        category: s.category,
        isPack: false,
      },
    });
  }

  for (const p of packs) {
    await prisma.service.upsert({
      where: { name: p.name },
      update: {},
      create: {
        name: p.name,
        slug: slugify(p.name),
        description: p.description,
        price: p.price,
        category: "Packs",
        isPack: true,
      },
    });
  }

  const admin = await prisma.user.upsert({
    where: { email: "collab-dev@outlook.com" },
    update: {},
    create: {
      email: "collab-dev@outlook.com",
      name: "Administrateur",
      role: "ADMIN",
      password: await hashPassword("tsi9708lacollab"),
    },
  });
  console.log("Admin user:", admin.email, "(mot de passe: tsi9708lacollab)");

  await prisma.companyInfo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "collab·dev",
      legalName: "Collectif collabDev",
      representative: "Ismaël",
      representativeRole: "Responsable administration & facturation",
      address: "",
      phone: "",
      email: "collab-dev@outlook.com",
      website: "collabdev.site.je",
      taxId: "",
      iban: "MG46 0000 8000 2105 0013 9861 793",
      bic: "BFAVMGMGXXX",
      currency: "EUR",
    },
  });

  const count = await prisma.service.count();
  console.log(`Seed terminé. ${count} services/packs en base.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
