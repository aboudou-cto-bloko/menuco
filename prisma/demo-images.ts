import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const BASE = "https://images.unsplash.com/photo-";
const Q = "?w=720&q=85&auto=format&fit=crop";

// [item name] → unsplash photo id
const IMAGES: Record<string, string> = {
  // Entrées
  "Salade de crudités":       `${BASE}1512621776951-a57141f2eefd${Q}`,
  "Accras de haricots":       `${BASE}1623428187969-5da2dcea5ebf${Q}`,
  "Soupe de poisson":         `${BASE}1547592180-85f173990554${Q}`,
  "Plateau de charcuteries":  `${BASE}1534482421-64566f976cfa${Q}`,

  // Poissons
  "Tilapia braisé entier":    `${BASE}1467003909585-2f8a72700288${Q}`,
  "Capitaine frit":           `${BASE}1519708227418-c8fd9a32b7a2${Q}`,
  "Crevettes à l'ail":        `${BASE}1565557623262-b51c2513a641${Q}`,
  "Capitaine entier braisé":  `${BASE}1504674900247-0877df9cc836${Q}`,
  "Brochettes de poisson":    `${BASE}1555126634-323283e090fa${Q}`,

  // Viandes
  "Poulet braisé demi":       `${BASE}1598103442097-8b74394b95c7${Q}`,
  "Côtelettes d'agneau":      `${BASE}1607623814075-a2490f36a7f9${Q}`,
  "Brochettes de bœuf":       `${BASE}1555939594-58d7cb561ad1${Q}`,
  "Côtes de porc grillées":   `${BASE}1544025162-d76538c24609${Q}`,
  "Mixed grill pour 2":       `${BASE}1529042410759-befb1204b468${Q}`,

  // Plats traditionnels
  "Sauce graine + poisson fumé": `${BASE}1604329760661-e71dc83f8f26${Q}`,
  "Gboma dessi":              `${BASE}1546069901-522a6d719b2e${Q}`,
  "Riz au gras complet":      `${BASE}1455619452474-d9e1c0a76b3d${Q}`,
  "Amiwo (ble) au poulet":    `${BASE}1567188040759-fb8a883dc6d8${Q}`,
  "Thiéboudienne":            `${BASE}1603360946369-dc9bb6258143${Q}`,

  // Accompagnements
  "Attiéké maison":           `${BASE}1490645935967-10de6ba17061${Q}`,
  "Frites de banane plantain":`${BASE}1570197788417-0e82375c9371${Q}`,
  "Frites de pommes de terre":`${BASE}1573080496219-bb080dd4f877${Q}`,
  "Foufou d'igname":          `${BASE}1585937421612-70a008356fbe${Q}`,
  "Riz blanc parfumé":        `${BASE}1536304929831-ee1ca9d44906${Q}`,
  "Salade verte maison":      `${BASE}1540420773420-3366772f4999${Q}`,

  // Boissons
  "Jus de gingembre maison":  `${BASE}1556679908-c787f8e9d08d${Q}`,
  "Bissap (hibiscus)":        `${BASE}1604382354936-07c5d9983bd3${Q}`,
  "Ananas-menthe pressé":     `${BASE}1600271772470-ebb23cb3bb7a${Q}`,
  "Eau minérale":             `${BASE}1548839140-29a749e1cf4d${Q}`,
  "Coca-Cola / Fanta / Sprite":`${BASE}1581636625402-29b2a704ef13${Q}`,
  "Cocktail fruits tropicaux":`${BASE}1551538827-9c037cb4f32a${Q}`,

  // Bières & Alcools
  "Flag (33cl)":              `${BASE}1535958636474-b021ee887b13${Q}`,
  "Castel (50cl)":            `${BASE}1558618666-fcd25c85cd64${Q}`,
  "Heineken (33cl)":          `${BASE}1570640347-3699958bcbae${Q}`,
  "Vin rouge (verre)":        `${BASE}1510812431401-41d2bd2722f3${Q}`,
  "Whisky (mesure)":          `${BASE}1527281400683-1aae777175f8${Q}`,

  // Desserts
  "Fondant au chocolat":      `${BASE}1563805042-7f460fa3d21c${Q}`,
  "Salade de fruits frais":   `${BASE}1568702846914-96b305d2aaeb${Q}`,
  "Crème caramel maison":     `${BASE}1518732714860-b62714ce0c59${Q}`,
  "Boules de glace (2)":      `${BASE}1501443762994-f856eca07e6c${Q}`,
};

async function main() {
  const restaurant = await prisma.restaurant.findUnique({ where: { slug: "le-jardin-du-port" } });
  if (!restaurant) { console.error("Restaurant introuvable"); return; }

  let updated = 0;
  let skipped = 0;

  for (const [name, imageUrl] of Object.entries(IMAGES)) {
    const item = await prisma.menuItem.findFirst({
      where: { name, category: { menu: { restaurantId: restaurant.id } } },
    });
    if (!item) { console.log(`⚠ introuvable : ${name}`); skipped++; continue; }
    await prisma.menuItem.update({ where: { id: item.id }, data: { imageUrl } });
    console.log(`✓ ${name}`);
    updated++;
  }

  console.log(`\n✅ ${updated} photos assignées, ${skipped} non trouvés`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
