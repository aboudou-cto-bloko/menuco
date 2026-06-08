"use client";

import { useState, useTransition } from "react";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { updateRestaurant } from "@/app/actions/restaurants";
import { TemplatePicker } from "./template-picker";
import type { Restaurant } from "@/generated/prisma/client";

export function RestaurantSettings({ restaurant }: { restaurant: Restaurant }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(restaurant.name);
  const [customDomain, setCustomDomain] = useState(restaurant.customDomain ?? "");
  const [template, setTemplate] = useState(restaurant.template);
  const [accentColor, setAccentColor] = useState(restaurant.accentColor ?? "#f97316");
  const [active, setActive] = useState(restaurant.active);

  function save() {
    startTransition(async () => {
      await updateRestaurant({
        id: restaurant.id,
        name, template: template as "CLASSIQUE" | "CARDS" | "MAGAZINE",
        accentColor, active,
        customDomain: customDomain || undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Informations générales</h3>
        <div className="space-y-1.5">
          <Label htmlFor="s-name">Nom du restaurant</Label>
          <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="s-domain">Domaine personnalisé</Label>
          <Input id="s-domain" value={customDomain} onChange={(e) => setCustomDomain(e.target.value)}
            placeholder="menu.monrestaurant.bj" className="font-mono text-sm" />
          <p className="text-[10px] text-muted-foreground">
            Configurez un CNAME vers <span className="font-mono">cname.vercel-dns.com</span>
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Apparence</h3>
        <div className="space-y-1.5">
          <Label>Template</Label>
          <TemplatePicker value={template as "CLASSIQUE" | "CARDS" | "MAGAZINE"} onChange={(v) => setTemplate(v)} />
        </div>
        <div className="space-y-1.5">
          <Label>Couleur accent</Label>
          <div className="flex items-center gap-3">
            <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border border-border bg-transparent p-0.5" />
            <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)}
              className="font-mono text-sm w-32" />
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div>
          <Label>Menu actif</Label>
          <p className="text-xs text-muted-foreground">Le menu est visible en ligne</p>
        </div>
        <Switch checked={active} onCheckedChange={setActive} />
      </div>

      <Button onClick={save} disabled={isPending} className="gap-2">
        {isPending ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
        {saved ? "Enregistré" : "Enregistrer"}
      </Button>
    </div>
  );
}
