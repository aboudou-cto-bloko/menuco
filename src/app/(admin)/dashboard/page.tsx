import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Store, FileText, Package, QrCode, ExternalLink } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CreateRestaurantSheet } from "@/components/admin/create-restaurant-sheet";

async function getStats() {
  const [restaurants, activeMenus, totalItems] = await Promise.all([
    prisma.restaurant.count({ where: { active: true } }),
    prisma.menu.count({ where: { status: "ACTIVE" } }),
    prisma.menuItem.count(),
  ]);
  return { restaurants, activeMenus, totalItems };
}

async function getRestaurants() {
  return prisma.restaurant.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

const stats_config = [
  { label: "Restaurants actifs", icon: Store },
  { label: "Menus en ligne", icon: FileText },
  { label: "Total items", icon: Package },
  { label: "QR scans ce mois", icon: QrCode },
];

export default async function DashboardPage() {
  const [stats, restaurants] = await Promise.all([getStats(), getRestaurants()]);
  const statsValues = [stats.restaurants, stats.activeMenus, stats.totalItems, "—"];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <CreateRestaurantSheet />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats_config.map((s, i) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <s.icon size={14} className="text-muted-foreground/50" />
              </div>
              <p className="text-2xl font-bold">{statsValues[i]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium">Liste des restaurants</CardTitle>
          <Input placeholder="Rechercher…" className="w-48 h-8 text-xs" />
        </CardHeader>
        <CardContent className="p-0">
          {restaurants.length === 0 ? (
            <div className="py-20 flex flex-col items-center text-center px-6">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4 text-2xl">🍽️</div>
              <h3 className="text-sm font-medium">Aucun restaurant pour l&apos;instant</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Créez votre premier menu en moins de 10 minutes.
              </p>
              <div className="mt-4"><CreateRestaurantSheet /></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Domaine</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {restaurants.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-xs font-bold text-primary shrink-0">
                          {r.name[0]}
                        </div>
                        <Link href={`/restaurants/${r.id}`} className="font-medium hover:text-primary transition-colors">
                          {r.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{r.slug}</TableCell>
                    <TableCell>
                      <Badge variant={r.active ? "default" : "destructive"} className="text-[10px]">
                        {r.active ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground capitalize">{r.template.toLowerCase()}</TableCell>
                    <TableCell>
                      {r.customDomain ? (
                        <a href={`https://${r.customDomain}`} target="_blank"
                          className="text-xs text-primary hover:underline flex items-center gap-1">
                          {r.customDomain}<ExternalLink size={10} />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">Non configuré</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/restaurants/${r.id}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                          Éditer
                        </Link>
                        <a href={`/m/${r.slug}`} target="_blank" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                          Ouvrir
                        </a>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
