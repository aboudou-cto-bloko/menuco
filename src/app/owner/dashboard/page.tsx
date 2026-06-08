import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QrCode, Eye, EyeOff, LogOut, ExternalLink, MessageCircle, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OwnerMenuToggles } from "@/components/owner/menu-toggles";
import { OwnerQrDownload } from "@/components/owner/qr-download";
import { OwnerSignOut } from "@/components/owner/sign-out";

async function getOwnerRestaurant(userId: string) {
  return prisma.restaurant.findUnique({
    where: { ownerId: userId },
    include: {
      menus: {
        orderBy: { order: "asc" },
        include: {
          categories: {
            orderBy: { order: "asc" },
            include: { items: { orderBy: { order: "asc" }, include: { variants: true } } },
          },
        },
      },
    },
  });
}

export default async function OwnerDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const restaurant = await getOwnerRestaurant(session.user.id);
  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">Aucun restaurant associé à ce compte.</p>
        </div>
      </div>
    );
  }

  const menu = restaurant.menus[0];
  const totalItems = menu?.categories.reduce((acc, c) => acc + c.items.length, 0) ?? 0;
  const publicUrl = restaurant.customDomain
    ? `https://${restaurant.customDomain}`
    : `https://${restaurant.slug}.menuco.bj`;

  return (
    <div className="min-h-screen bg-background">
      {/* Topbar */}
      <header className="border-b border-border sticky top-0 z-20 backdrop-blur-md"
        style={{ backgroundColor: "rgba(15,7,5,0.9)" }}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {restaurant.logo ? (
              <img src={restaurant.logo} alt="" className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold bg-primary text-primary-foreground">
                {restaurant.name[0]}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold leading-tight truncate max-w-[160px]">{restaurant.name}</p>
              <p className="text-[10px] text-muted-foreground">Dashboard propriétaire</p>
            </div>
          </div>
          <OwnerSignOut />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Status */}
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Statut du menu</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={restaurant.active ? "default" : "destructive"}>
                    {restaurant.active ? "En ligne" : "Hors ligne"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{totalItems} plats</span>
                </div>
              </div>
              <a href={publicUrl} target="_blank"
                className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                Voir mon menu<ExternalLink size={11} />
              </a>
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <QrCode size={15} />Mon QR Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OwnerQrDownload restaurant={restaurant} publicUrl={publicUrl} />
          </CardContent>
        </Card>

        {/* Menu toggles */}
        {menu && menu.categories.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Disponibilité des plats</CardTitle>
              <p className="text-xs text-muted-foreground">Activez ou désactivez un plat pour les clients.</p>
            </CardHeader>
            <CardContent className="p-0">
              <OwnerMenuToggles categories={menu.categories} />
            </CardContent>
          </Card>
        )}

        {/* Contact links */}
        <Card>
          <CardContent className="pt-4 pb-4 space-y-2">
            {restaurant.whatsapp && (
              <a href={`https://wa.me/${restaurant.whatsapp.replace(/\D/g, "")}`}
                className="flex items-center gap-2.5 text-sm py-2 text-muted-foreground hover:text-foreground transition-colors">
                <MessageCircle size={15} className="text-[#25d366]" />
                Ouvrir WhatsApp Business
              </a>
            )}
            {restaurant.googlePlaceId && (
              <>
                <Separator />
                <a href={`https://search.google.com/local/writereview?placeid=${restaurant.googlePlaceId}`}
                  target="_blank"
                  className="flex items-center gap-2.5 text-sm py-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Star size={15} className="text-yellow-400" />
                  Voir mes avis Google
                </a>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
