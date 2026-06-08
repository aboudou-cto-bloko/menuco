"use client";

import { useState, useTransition } from "react";
import { Loader2, Check, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PalettePicker } from "@/components/ui/palette-picker";
import { FontPicker } from "@/components/ui/font-picker";
import { updateRestaurant } from "@/app/actions/restaurants";
import { TemplatePicker } from "./template-picker";
import { useUploadThing } from "@/lib/uploadthing-client";
import type { Restaurant } from "@/generated/prisma/client";

function ImageUpload({
  label, current, endpoint, onUploaded, onRemove, aspect,
}: {
  label: string;
  current: string | null | undefined;
  endpoint: "restaurantLogo" | "restaurantCover";
  onUploaded: (url: string) => void;
  onRemove: () => void;
  aspect: string;
}) {
  const [uploading, setUploading] = useState(false);
  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => { onUploaded(res[0].url); setUploading(false); },
    onUploadError: () => setUploading(false),
  });

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {current ? (
        <div className="relative group w-full max-w-xs">
          <div className={`${aspect} w-full rounded-xl overflow-hidden bg-muted`}>
            <img src={current} alt="" className="w-full h-full object-cover" />
          </div>
          <button onClick={onRemove}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <X size={11} />
          </button>
        </div>
      ) : (
        <label className={`relative flex flex-col items-center justify-center w-full max-w-xs ${aspect} rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-primary/50 transition-colors bg-muted/30`}>
          <input type="file" accept="image/*" className="sr-only"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploading(true);
              await startUpload([file]);
            }} />
          {uploading ? (
            <Loader2 size={20} className="animate-spin text-muted-foreground" />
          ) : (
            <>
              <Upload size={18} className="text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">Cliquer pour uploader</span>
            </>
          )}
        </label>
      )}
    </div>
  );
}

export function RestaurantSettings({ restaurant }: { restaurant: Restaurant }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(restaurant.name);
  const [customDomain, setCustomDomain] = useState(restaurant.customDomain ?? "");
  const [template, setTemplate] = useState(restaurant.template);
  const [themePalette, setThemePalette] = useState(restaurant.themePalette ?? "braise");
  const [fontChoice, setFontChoice] = useState(restaurant.fontChoice ?? "inter");
  const [logo, setLogo] = useState<string | null>(restaurant.logo ?? null);
  const [cover, setCover] = useState<string | null>(restaurant.cover ?? null);
  const [active, setActive] = useState(restaurant.active);

  function save() {
    startTransition(async () => {
      await updateRestaurant({
        id: restaurant.id,
        name,
        template: template as "CLASSIQUE" | "CARDS" | "MAGAZINE",
        themePalette,
        fontChoice,
        logo,
        cover,
        active,
        customDomain: customDomain || undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="max-w-lg space-y-6">
      {/* Général */}
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

      {/* Photos */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Photos</h3>
        <ImageUpload label="Logo / Photo de profil" current={logo} endpoint="restaurantLogo"
          onUploaded={setLogo} onRemove={() => setLogo(null)} aspect="aspect-square max-h-24 !w-24" />
        <ImageUpload label="Bannière (cover)" current={cover} endpoint="restaurantCover"
          onUploaded={setCover} onRemove={() => setCover(null)} aspect="aspect-[3/1]" />
      </div>

      <Separator />

      {/* Apparence */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Apparence</h3>
        <div className="space-y-1.5">
          <Label>Template</Label>
          <TemplatePicker value={template as "CLASSIQUE" | "CARDS" | "MAGAZINE"} onChange={(v) => setTemplate(v)} />
        </div>
        <div className="space-y-2">
          <Label>Palette de couleurs</Label>
          <PalettePicker value={themePalette} onChange={setThemePalette} />
        </div>
        <div className="space-y-2">
          <Label>Police du menu public</Label>
          <FontPicker value={fontChoice} onChange={setFontChoice} />
        </div>
      </div>

      <Separator />

      {/* Statut */}
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
