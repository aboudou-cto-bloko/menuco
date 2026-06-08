"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, ChevronRight, ChevronLeft, Check, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { createRestaurant } from "@/app/actions/restaurants";
import { ImageUpload } from "@/components/shared/image-upload";
import { generatePassword } from "@/lib/password";

const TEMPLATES = [
  { value: "CLASSIQUE", label: "Classique", description: "Liste sobre, fond sombre, catégories en onglets" },
  { value: "CARDS", label: "Cards", description: "Grille photo, prix en overlay, mobile-first" },
  { value: "MAGAZINE", label: "Magazine", description: "Cover full-bleed, typographie éditoriale" },
];

const STEPS = ["Identité", "Contact & Visuels", "Horaires", "Template", "Propriétaire"];

const DAYS: { key: string; label: string }[] = [
  { key: "mon", label: "Lundi" }, { key: "tue", label: "Mardi" },
  { key: "wed", label: "Mercredi" }, { key: "thu", label: "Jeudi" },
  { key: "fri", label: "Vendredi" }, { key: "sat", label: "Samedi" },
  { key: "sun", label: "Dimanche" },
];

type DaySchedule = { open: boolean; from: string; to: string };
type Hours = Record<string, DaySchedule>;

function slugify(s: string) {
  return s.toLowerCase().trim().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const INITIAL_STATE = { success: false };

export function CreateRestaurantSheet() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();

  // Step 0 — Identité
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("Cotonou");

  // Step 1 — Contact & Visuels
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [googlePlaceId, setGooglePlaceId] = useState("");
  const [logo, setLogo] = useState<string | undefined>();
  const [cover, setCover] = useState<string | undefined>();

  // Step 2 — Horaires
  const [hours, setHours] = useState<Hours>(() =>
    Object.fromEntries(DAYS.map(d => [d.key, { open: d.key !== "sun", from: "08:00", to: "22:00" }]))
  );

  // Step 3 — Template
  const [template, setTemplate] = useState("CLASSIQUE");
  const [accentColor, setAccentColor] = useState("#f97316");

  // Step 4 — Propriétaire
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPassword, setOwnerPassword] = useState(generatePassword());
  const [sendEmail, setSendEmail] = useState(true);
  const [error, setError] = useState("");

  function handleNameChange(v: string) {
    setName(v);
    if (!slugEdited) setSlug(slugify(v));
  }

  function toggleDay(key: string) {
    setHours(h => ({ ...h, [key]: { ...h[key], open: !h[key].open } }));
  }

  function setDayTime(key: string, field: "from" | "to", value: string) {
    setHours(h => ({ ...h, [key]: { ...h[key], [field]: value } }));
  }

  function reset() {
    setStep(0); setName(""); setSlug(""); setSlugEdited(false); setDescription("");
    setCity("Cotonou"); setPhone(""); setWhatsapp(""); setAddress("");
    setGooglePlaceId(""); setLogo(undefined); setCover(undefined);
    setHours(Object.fromEntries(DAYS.map(d => [d.key, { open: d.key !== "sun", from: "08:00", to: "22:00" }])));
    setTemplate("CLASSIQUE"); setAccentColor("#f97316");
    setOwnerEmail(""); setOwnerPassword(generatePassword()); setSendEmail(true); setError("");
  }

  async function handleSubmit() {
    setError("");
    const fd = new FormData();
    fd.append("name", name); fd.append("slug", slug);
    if (description) fd.append("description", description);
    fd.append("city", city);
    if (phone) fd.append("phone", phone);
    if (whatsapp) fd.append("whatsapp", whatsapp);
    if (address) fd.append("address", address);
    if (googlePlaceId) fd.append("googlePlaceId", googlePlaceId);
    if (logo) fd.append("logo", logo);
    if (cover) fd.append("cover", cover);
    fd.append("hours", JSON.stringify(hours));
    fd.append("template", template); fd.append("accentColor", accentColor);
    fd.append("ownerEmail", ownerEmail); fd.append("ownerPassword", ownerPassword);
    fd.append("sendEmail", String(sendEmail));

    startTransition(async () => {
      const result = await createRestaurant(INITIAL_STATE, fd);
      if (result.error) { setError(result.error); return; }
      reset(); setOpen(false);
      router.push(`/restaurants/${result.restaurantId}`);
    });
  }

  const canNext = [
    name.length >= 2 && slug.length >= 2,
    true,
    true,
    true,
    ownerEmail.includes("@") && ownerPassword.length >= 8,
  ];

  return (
    <>
      <Button onClick={() => setOpen(true)}><Plus size={14} className="mr-1.5" />Nouveau restaurant</Button>
      <Sheet open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto flex flex-col gap-0 p-0">
          <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-base">Nouveau restaurant</SheetTitle>
              <div className="flex items-center gap-1">
                {STEPS.map((_, i) => (
                  <div key={i} className={cn("h-1.5 rounded-full transition-all", i <= step ? "bg-primary w-5" : "bg-muted w-2.5")} />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{STEPS[step]}</p>
          </SheetHeader>

          <div className="flex-1 px-6 py-5 space-y-5 overflow-y-auto">

            {/* ── Step 0: Identité ── */}
            {step === 0 && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="name">Nom du restaurant <span className="text-destructive">*</span></Label>
                  <Input id="name" value={name} onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Le Gourmet Béninois" autoFocus />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="slug">
                    Slug URL <span className="text-destructive">*</span>
                    <span className="ml-1 text-[10px] font-normal text-muted-foreground">/{slug || "…"}</span>
                  </Label>
                  <Input id="slug" value={slug} className="font-mono text-sm"
                    onChange={(e) => { setSlug(slugify(e.target.value)); setSlugEdited(true); }}
                    placeholder="le-gourmet-beninois" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="desc">Description <span className="text-muted-foreground text-xs font-normal">(optionnel)</span></Label>
                  <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="Cuisine béninoise authentique au cœur de Cotonou…" rows={3} className="resize-none" />
                </div>
                <div className="space-y-1.5">
                  <Label>Ville</Label>
                  <Select value={city} onValueChange={(v) => v && setCity(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Cotonou","Porto-Novo","Parakou","Abomey-Calavi","Lomé","Abidjan","Autre"].map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* ── Step 1: Contact & Visuels ── */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+229 97 00 00 00" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="wa">WhatsApp</Label>
                    <Input id="wa" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+229 97 00 00 00" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="addr">Adresse</Label>
                  <Input id="addr" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Lot 12, Rue du Commerce, Ganhi" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="gp">Google Place ID <span className="text-muted-foreground text-xs font-normal">(optionnel)</span></Label>
                  <Input id="gp" value={googlePlaceId} onChange={(e) => setGooglePlaceId(e.target.value)}
                    placeholder="ChIJ..." className="font-mono text-xs" />
                </div>
                <Separator />
                <div className="space-y-3">
                  <p className="text-xs font-medium">Visuels</p>
                  <div className="flex gap-4 items-start">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Logo</Label>
                      <ImageUpload endpoint="restaurantLogo" value={logo} onChange={setLogo}
                        label="Logo" hint="500×500px" aspect="square" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <Label className="text-xs">Photo de couverture</Label>
                      <ImageUpload endpoint="restaurantCover" value={cover} onChange={setCover}
                        label="Glisser ou cliquer" hint="1200×630px" aspect="wide" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── Step 2: Horaires ── */}
            {step === 2 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Définissez vos horaires d&apos;ouverture.</p>
                {DAYS.map(d => {
                  const day = hours[d.key];
                  return (
                    <div key={d.key} className="flex items-center gap-3 py-2">
                      <div className="w-24 shrink-0">
                        <p className={cn("text-sm", !day.open && "text-muted-foreground/50")}>{d.label}</p>
                      </div>
                      <Switch checked={day.open} onCheckedChange={() => toggleDay(d.key)} className="shrink-0" />
                      {day.open ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input type="time" value={day.from}
                            onChange={(e) => setDayTime(d.key, "from", e.target.value)}
                            className="h-8 text-xs w-28" />
                          <span className="text-xs text-muted-foreground">→</span>
                          <Input type="time" value={day.to}
                            onChange={(e) => setDayTime(d.key, "to", e.target.value)}
                            className="h-8 text-xs w-28" />
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/40 flex-1">Fermé</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Step 3: Template ── */}
            {step === 3 && (
              <>
                <div className="space-y-2.5">
                  {TEMPLATES.map(t => (
                    <button key={t.value} type="button" onClick={() => setTemplate(t.value)}
                      className={cn("w-full text-left p-4 rounded-lg border transition-all",
                        template === t.value ? "border-primary bg-primary/5" : "border-border hover:border-border/60 bg-card")}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{t.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                        </div>
                        {template === t.value && <Check size={14} className="text-primary shrink-0" />}
                      </div>
                    </button>
                  ))}
                </div>
                <Separator />
                <div className="space-y-1.5">
                  <Label>Couleur accent</Label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)}
                      className="w-9 h-9 rounded-md cursor-pointer border border-border bg-transparent p-0.5" />
                    <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)}
                      className="font-mono text-sm w-28" />
                    <div className="flex gap-1.5">
                      {["#f97316","#10b981","#3b82f6","#e11d48","#a855f7"].map(c => (
                        <button key={c} type="button" onClick={() => setAccentColor(c)}
                          className="w-6 h-6 rounded-full border-2 transition-all"
                          style={{ backgroundColor: c, borderColor: accentColor === c ? "white" : "transparent" }} />
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── Step 4: Propriétaire ── */}
            {step === 4 && (
              <>
                <p className="text-xs text-muted-foreground">Le propriétaire se connecte avec ces identifiants.</p>
                <div className="space-y-1.5">
                  <Label htmlFor="ownerEmail">Email <span className="text-destructive">*</span></Label>
                  <Input id="ownerEmail" type="email" value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)} placeholder="restaurant@example.com" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pwd">Mot de passe <span className="text-destructive">*</span></Label>
                  <div className="flex gap-2">
                    <Input id="pwd" value={ownerPassword} onChange={(e) => setOwnerPassword(e.target.value)}
                      className="font-mono text-sm flex-1" />
                    <Button variant="outline" size="icon" type="button"
                      onClick={() => setOwnerPassword(generatePassword())} title="Regénérer">
                      <RefreshCw size={14} />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-sm">Envoyer par email</p>
                    <p className="text-xs text-muted-foreground">Email avec identifiants + lien dashboard</p>
                  </div>
                  <Switch checked={sendEmail} onCheckedChange={setSendEmail} />
                </div>

                {error && (
                  <div className="px-3 py-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                    {error}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3 shrink-0">
            {step > 0 ? (
              <Button variant="outline" onClick={() => setStep(s => s - 1)} className="gap-1.5">
                <ChevronLeft size={14} />Retour
              </Button>
            ) : <div />}
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(s => s + 1)} disabled={!canNext[step]} className="gap-1.5">
                Suivant<ChevronRight size={14} />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isPending || !canNext[4]} className="gap-1.5">
                {isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                {isPending ? "Création…" : "Créer"}
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
