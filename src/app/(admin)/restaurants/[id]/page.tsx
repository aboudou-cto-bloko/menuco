import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { MenuBuilder } from "@/components/admin/menu-builder";
import { RestaurantSettings } from "@/components/admin/restaurant-settings";
import { QrSection } from "@/components/admin/qr-section";

async function getRestaurant(id: string) {
  return prisma.restaurant.findUnique({
    where: { id },
    include: {
      menus: {
        orderBy: { order: "asc" },
        include: {
          categories: {
            orderBy: { order: "asc" },
            include: {
              items: {
                orderBy: { order: "asc" },
                include: { variants: true, modifierGroups: { include: { options: true } } },
              },
            },
          },
        },
      },
    },
  });
}

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurant = await getRestaurant(id);
  if (!restaurant) notFound();

  const menu = restaurant.menus[0];
  const publicUrl = restaurant.customDomain
    ? `https://${restaurant.customDomain}`
    : `https://${restaurant.slug}.menuco.bj`;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}>
            <ChevronLeft size={15} />Dashboard
          </Link>
          <div className="w-px h-4 bg-border" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold truncate">{restaurant.name}</h1>
              <Badge variant={restaurant.active ? "default" : "destructive"} className="text-[10px] shrink-0">
                {restaurant.active ? "Actif" : "Inactif"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-mono">{restaurant.slug}.menuco.bj</p>
          </div>
        </div>
        <a href={publicUrl} target="_blank" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}>
          <ExternalLink size={13} />Voir le menu
        </a>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="menu" className="h-full flex flex-col">
          <div className="px-6 border-b border-border shrink-0">
            <TabsList className="bg-transparent gap-4 p-0 h-10">
              <TabsTrigger value="menu" className="text-xs px-0 pb-2.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground">
                Menu
              </TabsTrigger>
              <TabsTrigger value="qr" className="text-xs px-0 pb-2.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground">
                QR Code
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs px-0 pb-2.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground">
                Paramètres
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="menu" className="flex-1 overflow-hidden m-0">
            <MenuBuilder restaurant={restaurant} menu={menu ?? null} />
          </TabsContent>

          <TabsContent value="qr" className="flex-1 overflow-auto m-0 p-6">
            <QrSection restaurant={restaurant} />
          </TabsContent>

          <TabsContent value="settings" className="flex-1 overflow-auto m-0 p-6">
            <RestaurantSettings restaurant={restaurant} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
