import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const BASE = "https://images.unsplash.com/photo-";
  const Q = "?w=1280&q=85&auto=format&fit=crop";
  const QS = "?w=200&h=200&q=80&auto=format&fit=crop";

  await prisma.restaurant.update({
    where: { slug: "le-jardin-du-port" },
    data: {
      // Photo de profil ronde (assiette présentée, vue de dessus)
      logo: `${BASE}1546069901-522a6d719b2e${QS}`,
      // Bannière : grande table de restaurant tropical en extérieur
      cover: `${BASE}1414235077428-338989a2e8c0${Q}`,
      // Palette sombre chaude par défaut
      themePalette: "braise",
      template: "MAGAZINE",
    },
  });

  console.log("✅ Restaurant démo mis à jour : logo, cover, palette braise, template MAGAZINE");
  console.log("🔗 https://menuco-kohl.vercel.app/m/le-jardin-du-port");
}

main().catch(console.error).finally(() => prisma.$disconnect());
