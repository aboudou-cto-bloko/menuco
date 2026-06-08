import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TemplateClassique } from "@/components/public/template-classique";
import { TemplateCards } from "@/components/public/template-cards";
import { TemplateMagazine } from "@/components/public/template-magazine";
import { MessageCircle } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ domain?: string }>;
}

async function getRestaurant(slug: string, domain?: string) {
  return prisma.restaurant.findFirst({
    where: domain
      ? { customDomain: domain, active: true }
      : { slug: slug === "__domain__" ? undefined : slug, active: true },
    include: {
      menus: {
        where: { status: "ACTIVE" },
        orderBy: { order: "asc" },
        take: 1,
        include: {
          categories: {
            where: { visible: true },
            orderBy: { order: "asc" },
            include: {
              items: {
                orderBy: { order: "asc" },
                include: {
                  variants: { orderBy: { order: "asc" } },
                  modifierGroups: {
                    orderBy: { order: "asc" },
                    include: { options: { orderBy: { order: "asc" } } },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

export default async function PublicMenuPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { domain } = await searchParams;
  const restaurant = await getRestaurant(slug, domain);
  if (!restaurant) notFound();

  const menu = restaurant.menus[0];

  // Empty state
  if (!menu || menu.categories.every(c => c.items.length === 0)) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center p-8"
        style={{ backgroundColor: "#0f0705", color: "#f6ded3" }}>
        <div className="text-5xl mb-5">👨‍🍳</div>
        <h1 className="text-xl font-semibold">{restaurant.name}</h1>
        <p className="text-sm opacity-50 mt-2 max-w-xs">Notre menu est en cours de préparation. Revenez bientôt !</p>
        {restaurant.whatsapp && (
          <a
            href={`https://wa.me/${restaurant.whatsapp.replace(/\D/g, "")}`}
            className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold"
            style={{ backgroundColor: "#25d366", color: "#fff" }}>
            <MessageCircle size={15} />Contactez-nous sur WhatsApp
          </a>
        )}
      </div>
    );
  }

  if (restaurant.template === "CARDS") return <TemplateCards restaurant={restaurant} menu={menu} />;
  if (restaurant.template === "MAGAZINE") return <TemplateMagazine restaurant={restaurant} menu={menu} />;
  return <TemplateClassique restaurant={restaurant} menu={menu} />;
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { slug } = await params;
  const { domain } = await searchParams;
  const restaurant = await getRestaurant(slug, domain);
  if (!restaurant) return {};
  return {
    title: `${restaurant.name} — Menu`,
    description: restaurant.description ?? `Découvrez notre menu en ligne`,
    openGraph: {
      title: restaurant.name,
      description: restaurant.description ?? "",
      images: restaurant.cover ? [restaurant.cover] : [],
    },
  };
}
