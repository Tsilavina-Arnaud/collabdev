import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getServices = cache(async () => {
  const services = await prisma.service.findMany({
    where: { active: true, isPack: false },
    orderBy: [{ category: "asc" }, { price: "asc" }],
  });
  const categories = [...new Set(services.map((s) => s.category))];
  return { services, categories };
});

export const getPacks = cache(async () => {
  return prisma.service.findMany({
    where: { active: true, isPack: true },
    orderBy: { price: "asc" },
  });
});
