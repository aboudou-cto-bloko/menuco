import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Owner account
  const ownerEmail = "demo@lejardinduport.bj";
  const ownerPassword = "demo2026!";

  let owner = await prisma.user.findUnique({ where: { email: ownerEmail } });
  if (!owner) {
    owner = await prisma.user.create({
      data: { email: ownerEmail, name: "Kossivi Mensah", emailVerified: true, role: "OWNER" },
    });
    const pwd = await hashPassword(ownerPassword);
    await prisma.account.create({
      data: { accountId: owner.id, providerId: "credential", userId: owner.id, password: pwd },
    });
  }

  // Delete existing restaurant if any
  await prisma.restaurant.deleteMany({ where: { slug: "le-jardin-du-port" } });

  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Le Jardin du Port",
      slug: "le-jardin-du-port",
      description: "Maquis premium au bord du lac Nokoué. Poissons frais du jour, grillades au charbon de bois et spécialités béninoises dans un cadre verdoyant.",
      city: "Cotonou",
      address: "Zone du Port, Cotonou, Bénin",
      phone: "+22997000001",
      whatsapp: "+22997000001",
      template: "CLASSIQUE",
      accentColor: "#e85d04",
      active: true,
      ownerId: owner.id,
      hours: {
        mon: { open: true, from: "11:00", to: "23:00" },
        tue: { open: true, from: "11:00", to: "23:00" },
        wed: { open: true, from: "11:00", to: "23:00" },
        thu: { open: true, from: "11:00", to: "23:00" },
        fri: { open: true, from: "11:00", to: "01:00" },
        sat: { open: true, from: "10:00", to: "01:00" },
        sun: { open: true, from: "10:00", to: "22:00" },
      },
    },
  });

  const menu = await prisma.menu.create({
    data: { restaurantId: restaurant.id, name: "Menu principal", status: "ACTIVE", order: 0 },
  });

  // ── Catégories + items ─────────────────────────────────────────────────────

  const categories = [
    {
      name: "Entrées", emoji: "🥗", order: 0,
      items: [
        { name: "Salade de crudités", price: 1500, description: "Tomates, concombres, carottes râpées, oignons rouges, vinaigrette maison au citron et huile d'olive.", dietaryTags: ["VEGETARIAN", "VEGAN", "GLUTEN_FREE"], spiceLevel: "NONE", featured: false, isNew: false },
        { name: "Accras de haricots", price: 1000, description: "Beignets croustillants de haricots niébé assaisonnés d'oignons, piment doux et sel, frits à l'huile dorée.", dietaryTags: ["VEGETARIAN", "VEGAN", "GLUTEN_FREE"], spiceLevel: "MILD", featured: true, isNew: false },
        { name: "Soupe de poisson", price: 2000, description: "Bouillon de tilapia fumé, tomates, oignons, poivrons et épices africaines, servi bien chaud avec du pain de mie grillé.", allergens: ["FISH"], spiceLevel: "MEDIUM", featured: false, isNew: false },
        { name: "Plateau de charcuteries", price: 3500, description: "Assortiment de viandes froides importées, cornichons, moutarde et crackers. Pour 2 personnes.", allergens: ["GLUTEN"], spiceLevel: "NONE", featured: false, isNew: true },
      ],
    },
    {
      name: "Poissons & Fruits de mer", emoji: "🐟", order: 1,
      items: [
        { name: "Tilapia braisé entier", price: 4500, description: "Tilapia frais du lac Nokoué, marinée aux épices locales (gingembre, ail, citronnelle), grillé au charbon de bois. Servi avec attiéké et sauce tomate pimentée.", allergens: ["FISH"], dietaryTags: ["GLUTEN_FREE", "HALAL"], spiceLevel: "MEDIUM", featured: true, isNew: false },
        { name: "Capitaine frit", price: 5500, description: "Filet de capitaine pané maison, frit à la perfection. Chair fondante, peau croustillante. Accompagné de frites maison et salade verte.", allergens: ["FISH", "GLUTEN", "EGGS"], spiceLevel: "NONE", featured: false, isNew: false },
        { name: "Crevettes à l'ail", price: 6000, description: "Grosses crevettes royales revenues au beurre, ail confit, persil frais et jus de citron vert. Servies sur lit de riz blanc parfumé.", allergens: ["CRUSTACEANS", "MILK"], dietaryTags: ["GLUTEN_FREE"], spiceLevel: "NONE", featured: true, isNew: false },
        { name: "Capitaine entier braisé", price: 7500, description: "Beau capitaine entier (800g–1kg) grillé au feu de bois avec sauce graine maison, servie avec du riz blanc et du foufou d'igname. Plat signature de la maison.", allergens: ["FISH"], dietaryTags: ["GLUTEN_FREE", "HALAL"], spiceLevel: "HOT", featured: true, isNew: false },
        { name: "Brochettes de poisson", price: 3000, description: "Cubes de filet de bar marinés aux épices, embrochés et grillés. Sauce arachide à part. 4 brochettes.", allergens: ["FISH", "PEANUTS"], spiceLevel: "MEDIUM", featured: false, isNew: true },
      ],
    },
    {
      name: "Viandes & Grillades", emoji: "🥩", order: 2,
      items: [
        { name: "Poulet braisé demi", price: 3500, description: "Demi-poulet fermier mariné 24h aux épices du jardin (thym, laurier, piment doux, ail), braisé lentement au charbon. Servi avec attiéké et sauce tomate.", dietaryTags: ["GLUTEN_FREE", "HALAL"], spiceLevel: "MEDIUM", featured: true, isNew: false },
        { name: "Côtelettes d'agneau", price: 8000, description: "3 côtelettes d'agneau importées, marinées au romarin et à l'ail, cuites rosées sur la braise. Accompagnées de légumes grillés et sauce menthe-yaourt.", allergens: ["MILK"], dietaryTags: ["GLUTEN_FREE", "HALAL"], spiceLevel: "NONE", featured: true, isNew: false },
        { name: "Brochettes de bœuf", price: 2500, description: "Cubes de bœuf de qualité marinés au cumin, paprika et huile d'olive. 4 brochettes servies avec sauce piment maison.", dietaryTags: ["GLUTEN_FREE", "HALAL"], spiceLevel: "MEDIUM", featured: false, isNew: false },
        { name: "Côtes de porc grillées", price: 5000, description: "Rack de côtes de porc caramélisées au miel et sauce soja, cuites au four puis terminées sur la braise. Chair tendre qui se détache toute seule.", allergens: ["SOY"], spiceLevel: "MILD", featured: false, isNew: false },
        { name: "Mixed grill pour 2", price: 12000, description: "Plateau de grillades pour 2 personnes : poulet, bœuf, agneau, merguez maison. Servi avec 2 accompagnements au choix et 2 sauces.", allergens: ["GLUTEN"], dietaryTags: ["HALAL"], spiceLevel: "MEDIUM", featured: true, isNew: false },
      ],
    },
    {
      name: "Plats traditionnels", emoji: "🫕", order: 3,
      items: [
        { name: "Sauce graine + poisson fumé", price: 3500, description: "La sauce emblématique du Bénin. Pulpe de palme fraîche, poisson fumé, feuilles de gboma. Servie avec du foufou d'igname fait maison.", allergens: ["FISH"], dietaryTags: ["GLUTEN_FREE"], spiceLevel: "HOT", featured: true, isNew: false },
        { name: "Gboma dessi", price: 3000, description: "Ragoût de feuilles de gboma (aubergines africaines) cuit au poisson fumé et aux crevettes séchées. Accompagné de pâte de maïs (ablo).", allergens: ["FISH", "CRUSTACEANS"], dietaryTags: ["GLUTEN_FREE"], spiceLevel: "MEDIUM", featured: false, isNew: false },
        { name: "Riz au gras complet", price: 3000, description: "Riz parfumé cuisiné dans un bouillon de viande avec tomates fraîches, poivrons et épices. Servi avec viande au choix et plantain frit.", dietaryTags: ["GLUTEN_FREE", "HALAL"], spiceLevel: "MILD", featured: false, isNew: false },
        { name: "Amiwo (ble) au poulet", price: 2800, description: "Pâte de maïs fermentée relevée (akassa/amiwo), servie avec ragoût de poulet mijoté aux légumes. Recette familiale transmise depuis 3 générations.", dietaryTags: ["GLUTEN_FREE", "HALAL"], spiceLevel: "MEDIUM", featured: true, isNew: false },
        { name: "Thiéboudienne", price: 4000, description: "Le plat national sénégalais adopté par Cotonou. Riz au poisson et légumes (carotte, chou, aubergine, tapioca) dans un bouillon de tomate fumé.", allergens: ["FISH"], dietaryTags: ["GLUTEN_FREE"], spiceLevel: "MEDIUM", featured: false, isNew: false },
      ],
    },
    {
      name: "Accompagnements", emoji: "🌽", order: 4,
      items: [
        { name: "Attiéké maison", price: 800, description: "Semoule de manioc fraîchement préparée, légèrement fermentée. Texture parfaite.", dietaryTags: ["VEGETARIAN", "VEGAN", "GLUTEN_FREE"], spiceLevel: "NONE", featured: false, isNew: false },
        { name: "Frites de banane plantain", price: 1000, description: "Bananes plantain mûres frites à l'huile de palme. Croustillantes dehors, fondantes dedans.", dietaryTags: ["VEGETARIAN", "VEGAN", "GLUTEN_FREE"], spiceLevel: "NONE", featured: false, isNew: false },
        { name: "Frites de pommes de terre", price: 1000, description: "Pommes de terre fraîches, coupées en bâtonnets et frites deux fois pour le croustillant.", dietaryTags: ["VEGETARIAN", "VEGAN", "GLUTEN_FREE"], spiceLevel: "NONE", featured: false, isNew: false },
        { name: "Foufou d'igname", price: 800, description: "Igname pilée à la perfection. Texture lisse et élastique, l'accompagnement idéal pour les sauces.", dietaryTags: ["VEGETARIAN", "VEGAN", "GLUTEN_FREE"], spiceLevel: "NONE", featured: false, isNew: false },
        { name: "Riz blanc parfumé", price: 700, description: "Riz long grain cuit à la vapeur avec une feuille de laurier.", dietaryTags: ["VEGETARIAN", "VEGAN", "GLUTEN_FREE"], spiceLevel: "NONE", featured: false, isNew: false },
        { name: "Salade verte maison", price: 800, description: "Laitue fraîche, tomates cerises, radis, vinaigrette moutarde-miel.", dietaryTags: ["VEGETARIAN", "VEGAN", "GLUTEN_FREE"], spiceLevel: "NONE", featured: false, isNew: false },
      ],
    },
    {
      name: "Boissons fraîches", emoji: "🥤", order: 5,
      items: [
        { name: "Jus de gingembre maison", price: 800, description: "Gingembre frais pressé, citron vert, sucre de canne, eau minérale. Préparation quotidienne. Rafraîchissant et tonique.", dietaryTags: ["VEGETARIAN", "VEGAN", "GLUTEN_FREE"], spiceLevel: "MILD", featured: true, isNew: false },
        { name: "Bissap (hibiscus)", price: 700, description: "Infusion froide de fleurs d'hibiscus séchées avec menthe fraîche et un soupçon de cannelle.", dietaryTags: ["VEGETARIAN", "VEGAN", "GLUTEN_FREE"], spiceLevel: "NONE", featured: false, isNew: false },
        { name: "Ananas-menthe pressé", price: 1000, description: "Ananas Victoria frais pressé à la commande, menthe fraîche, glaçons.", dietaryTags: ["VEGETARIAN", "VEGAN", "GLUTEN_FREE"], spiceLevel: "NONE", featured: true, isNew: false },
        { name: "Eau minérale", price: 500, description: "Possotomé 75cl — eau minérale béninoise.", dietaryTags: ["VEGETARIAN", "VEGAN", "GLUTEN_FREE"], spiceLevel: "NONE", featured: false, isNew: false },
        { name: "Coca-Cola / Fanta / Sprite", price: 600, description: "Canettes 33cl bien fraîches. Précisez votre choix.", dietaryTags: ["VEGETARIAN", "VEGAN"], spiceLevel: "NONE", featured: false, isNew: false },
        { name: "Cocktail fruits tropicaux", price: 1500, description: "Mélange mangue, maracuja, ananas et citron vert. Sans alcool. Servi avec des glaçons et une touche de sirop de grenadine.", dietaryTags: ["VEGETARIAN", "VEGAN", "GLUTEN_FREE"], spiceLevel: "NONE", featured: false, isNew: true },
      ],
    },
    {
      name: "Bières & Alcools", emoji: "🍺", order: 6,
      items: [
        { name: "Flag (33cl)", price: 800, description: "La bière béninoise par excellence. Légère et désaltérante.", spiceLevel: "NONE", featured: true, isNew: false },
        { name: "Castel (50cl)", price: 1000, description: "Castel bière pression en bouteille 50cl. Bien fraîche.", spiceLevel: "NONE", featured: false, isNew: false },
        { name: "Heineken (33cl)", price: 1200, description: "Heineken importée en canette 33cl.", spiceLevel: "NONE", featured: false, isNew: false },
        { name: "Vin rouge (verre)", price: 2000, description: "Verre de vin rouge de table, servi à température ambiante.", allergens: ["SOY"], spiceLevel: "NONE", featured: false, isNew: false },
        { name: "Whisky (mesure)", price: 3500, description: "Mesure de whisky Johnnie Walker Red Label, servi avec glaçons ou sec selon votre préférence.", spiceLevel: "NONE", featured: false, isNew: false },
      ],
    },
    {
      name: "Desserts", emoji: "🍮", order: 7,
      items: [
        { name: "Fondant au chocolat", price: 2000, description: "Gâteau moelleux à cœur coulant, servi tiède avec une boule de glace vanille et coulis de fruits rouges.", allergens: ["GLUTEN", "EGGS", "MILK"], dietaryTags: ["VEGETARIAN"], spiceLevel: "NONE", featured: true, isNew: false },
        { name: "Salade de fruits frais", price: 1500, description: "Mangue, papaye, ananas, banane et pastèque de saison, arrosée de jus de citron vert et menthe fraîche.", dietaryTags: ["VEGETARIAN", "VEGAN", "GLUTEN_FREE"], spiceLevel: "NONE", featured: false, isNew: false },
        { name: "Crème caramel maison", price: 1800, description: "Flan traditionnel au caramel ambré, préparation maison du matin. Texture veloutée, goût délicat.", allergens: ["EGGS", "MILK"], dietaryTags: ["VEGETARIAN", "GLUTEN_FREE"], spiceLevel: "NONE", featured: true, isNew: false },
        { name: "Boules de glace (2)", price: 1200, description: "Au choix : vanille, chocolat, fraise, mangue ou coco. Précisez vos parfums.", allergens: ["MILK"], dietaryTags: ["VEGETARIAN"], spiceLevel: "NONE", featured: false, isNew: false },
      ],
    },
  ];

  for (const catData of categories) {
    const category = await prisma.category.create({
      data: { menuId: menu.id, name: catData.name, emoji: catData.emoji, order: catData.order, visible: true },
    });

    for (let i = 0; i < catData.items.length; i++) {
      const item = catData.items[i];
      await prisma.menuItem.create({
        data: {
          categoryId: category.id,
          name: item.name,
          price: item.price,
          description: item.description,
          available: true,
          featured: item.featured,
          isNew: item.isNew,
          spiceLevel: item.spiceLevel as "NONE" | "MILD" | "MEDIUM" | "HOT",
          dietaryTags: (item.dietaryTags ?? []) as ("VEGETARIAN"|"VEGAN"|"HALAL"|"GLUTEN_FREE"|"DAIRY_FREE"|"SPICY")[],
          allergens: (item.allergens ?? []) as ("GLUTEN"|"CRUSTACEANS"|"EGGS"|"FISH"|"PEANUTS"|"SOY"|"MILK"|"NUTS"|"SESAME")[],
          order: i,
        },
      });
    }
    console.log(`✓ ${catData.emoji} ${catData.name} (${catData.items.length} items)`);
  }

  // Variants for some items
  const tilapia = await prisma.menuItem.findFirst({ where: { name: "Tilapia braisé entier", category: { menuId: menu.id } } });
  if (tilapia) {
    await prisma.itemVariant.createMany({ data: [
      { itemId: tilapia.id, name: "Petit (400g)", price: 3500, order: 0 },
      { itemId: tilapia.id, name: "Moyen (600g)", price: 4500, order: 1 },
      { itemId: tilapia.id, name: "Grand (800g)", price: 5500, order: 2 },
    ]});
    console.log("✓ Variantes tilapia");
  }

  const poulet = await prisma.menuItem.findFirst({ where: { name: "Poulet braisé demi", category: { menuId: menu.id } } });
  if (poulet) {
    await prisma.itemVariant.createMany({ data: [
      { itemId: poulet.id, name: "Quart", price: 2000, order: 0 },
      { itemId: poulet.id, name: "Demi", price: 3500, order: 1 },
      { itemId: poulet.id, name: "Entier", price: 6500, order: 2 },
    ]});
    console.log("✓ Variantes poulet");
  }

  const glace = await prisma.menuItem.findFirst({ where: { name: "Boules de glace (2)", category: { menuId: menu.id } } });
  if (glace) {
    await prisma.itemVariant.createMany({ data: [
      { itemId: glace.id, name: "2 boules", price: 1200, order: 0 },
      { itemId: glace.id, name: "3 boules", price: 1600, order: 1 },
      { itemId: glace.id, name: "4 boules", price: 2000, order: 2 },
    ]});
  }

  console.log("\n🎉 Restaurant de démo créé !");
  console.log(`📍 Slug   : le-jardin-du-port`);
  console.log(`🔗 Menu   : https://menuco-kohl.vercel.app/m/le-jardin-du-port`);
  console.log(`👤 Owner  : ${ownerEmail} / ${ownerPassword}`);

  const total = categories.reduce((s, c) => s + c.items.length, 0);
  console.log(`📊 Total  : ${categories.length} catégories, ${total} plats`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
