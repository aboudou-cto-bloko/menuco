"use client";

import { useState, useTransition } from "react";
import {
  Plus, GripVertical, Eye, EyeOff, Pencil, Trash2, Loader2, UtensilsCrossed, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  createCategory, updateCategory, deleteCategory,
  createItem, updateItem, deleteItem, toggleItemAvailability, upsertVariants,
} from "@/app/actions/menu";
import { ImageUpload } from "@/components/shared/image-upload";
import type { Restaurant, Menu, Category, MenuItem, ItemVariant, ModifierGroup, ModifierOption } from "@/generated/prisma/client";

type FullItem = MenuItem & { variants: ItemVariant[]; modifierGroups: (ModifierGroup & { options: ModifierOption[] })[] };
type FullCategory = Category & { items: FullItem[] };
type FullMenu = Menu & { categories: FullCategory[] };

interface Props { restaurant: Restaurant; menu: FullMenu | null; }

const EMOJI_SUGGESTIONS = ["🍽️","🍖","🍗","🥩","🐟","🦐","🍜","🍛","🥗","🥪","🍔","🌮","🫕","🥘","🍲","🥤","🧃","🍺","🍷","☕","🧁","🍰","🍦","🍬"];
const SPICE_LABELS: Record<string, string> = { NONE: "Neutre", MILD: "🌶️ Léger", MEDIUM: "🌶️🌶️ Moyen", HOT: "🌶️🌶️🌶️ Épicé" };

const DIETARY_OPTIONS = [
  { value: "VEGETARIAN", label: "🌿 Végétarien" },
  { value: "VEGAN", label: "🌱 Vegan" },
  { value: "HALAL", label: "☪️ Halal" },
  { value: "GLUTEN_FREE", label: "GF Sans gluten" },
  { value: "DAIRY_FREE", label: "DF Sans lactose" },
  { value: "SPICY", label: "🌶️ Épicé" },
];

const ALLERGEN_OPTIONS = [
  { value: "GLUTEN", label: "Gluten" }, { value: "CRUSTACEANS", label: "Crustacés" },
  { value: "EGGS", label: "Œufs" }, { value: "FISH", label: "Poisson" },
  { value: "PEANUTS", label: "Arachides" }, { value: "SOY", label: "Soja" },
  { value: "MILK", label: "Lait" }, { value: "NUTS", label: "Noix" },
  { value: "SESAME", label: "Sésame" },
];

type ItemFormVariant = { id?: string; name: string; price: string };

type ItemForm = {
  name: string; price: string; description: string;
  imageUrl: string | undefined;
  spiceLevel: string; featured: boolean; isNew: boolean;
  dietaryTags: string[]; allergens: string[];
  variants: ItemFormVariant[];
};

const BLANK_ITEM: ItemForm = {
  name: "", price: "", description: "", imageUrl: undefined,
  spiceLevel: "NONE", featured: false, isNew: false,
  dietaryTags: [], allergens: [], variants: [],
};

export function MenuBuilder({ restaurant, menu }: Props) {
  const [categories, setCategories] = useState<FullCategory[]>(menu?.categories ?? []);
  const [selectedCat, setSelectedCat] = useState<string | null>(categories[0]?.id ?? null);
  const [isPending, startTransition] = useTransition();

  const [catDialog, setCatDialog] = useState<{ open: boolean; editing?: FullCategory }>({ open: false });
  const [catName, setCatName] = useState("");
  const [catEmoji, setCatEmoji] = useState("");

  const [itemDrawer, setItemDrawer] = useState<{ open: boolean; editing?: FullItem; categoryId?: string }>({ open: false });
  const [itemForm, setItemForm] = useState<ItemForm>(BLANK_ITEM);

  const activeCat = categories.find(c => c.id === selectedCat) ?? categories[0] ?? null;

  // ── Category ──────────────────────────────────────────────────────────────

  function openNewCat() { setCatName(""); setCatEmoji(""); setCatDialog({ open: true }); }
  function openEditCat(cat: FullCategory) { setCatName(cat.name); setCatEmoji(cat.emoji ?? ""); setCatDialog({ open: true, editing: cat }); }

  function saveCat() {
    if (!catName.trim() || !menu) return;
    startTransition(async () => {
      if (catDialog.editing) {
        const updated = await updateCategory(catDialog.editing.id, { name: catName, emoji: catEmoji || undefined });
        setCategories(prev => prev.map(c => c.id === updated.id ? { ...updated, items: c.items } : c));
      } else {
        const created = await createCategory(menu.id, catName, catEmoji || undefined);
        setCategories(prev => [...prev, { ...created }]);
        setSelectedCat(created.id);
      }
      setCatDialog({ open: false });
    });
  }

  function deleteCat(cat: FullCategory) {
    if (!confirm(`Supprimer "${cat.name}" et tous ses items ?`)) return;
    startTransition(async () => {
      await deleteCategory(cat.id);
      setCategories(prev => {
        const next = prev.filter(c => c.id !== cat.id);
        if (selectedCat === cat.id) setSelectedCat(next[0]?.id ?? null);
        return next;
      });
    });
  }

  function toggleCatVisible(cat: FullCategory) {
    startTransition(async () => {
      await updateCategory(cat.id, { visible: !cat.visible });
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, visible: !c.visible } : c));
    });
  }

  // ── Item ──────────────────────────────────────────────────────────────────

  function openNewItem(categoryId: string) {
    setItemForm(BLANK_ITEM);
    setItemDrawer({ open: true, categoryId });
  }

  function openEditItem(item: FullItem) {
    setItemForm({
      name: item.name, price: String(item.price),
      description: item.description ?? "",
      imageUrl: item.imageUrl ?? undefined,
      spiceLevel: item.spiceLevel,
      featured: item.featured, isNew: item.isNew,
      dietaryTags: item.dietaryTags as string[],
      allergens: item.allergens as string[],
      variants: item.variants.map(v => ({ id: v.id, name: v.name, price: String(v.price) })),
    });
    setItemDrawer({ open: true, editing: item });
  }

  function toggleTag(field: "dietaryTags" | "allergens", val: string) {
    setItemForm(f => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter(t => t !== val) : [...f[field], val],
    }));
  }

  function saveItem() {
    startTransition(async () => {
      const data = {
        name: itemForm.name, price: Number(itemForm.price),
        description: itemForm.description || undefined,
        imageUrl: itemForm.imageUrl ?? null,
        spiceLevel: itemForm.spiceLevel as "NONE" | "MILD" | "MEDIUM" | "HOT",
        featured: itemForm.featured, isNew: itemForm.isNew, available: true,
        dietaryTags: itemForm.dietaryTags as Parameters<typeof createItem>[1]["dietaryTags"],
        allergens: itemForm.allergens as Parameters<typeof createItem>[1]["allergens"],
      };

      let saved: FullItem;
      if (itemDrawer.editing) {
        saved = await updateItem(itemDrawer.editing.id, data);
      } else {
        saved = await createItem(itemDrawer.categoryId!, data);
      }

      // save variants separately
      if (itemForm.variants.length > 0 || (itemDrawer.editing && itemDrawer.editing.variants.length > 0)) {
        const parsedVariants = itemForm.variants.filter(v => v.name.trim()).map(v => ({
          id: v.id, name: v.name, price: Number(v.price) || 0,
        }));
        await upsertVariants(saved.id, parsedVariants);
        saved = { ...saved, variants: parsedVariants.map((v, i) => ({ ...v, id: v.id ?? `tmp-${i}`, available: true, order: i, itemId: saved.id })) as ItemVariant[] };
      }

      setCategories(prev => {
        if (itemDrawer.editing) {
          return prev.map(c => ({ ...c, items: c.items.map(i => i.id === saved.id ? saved : i) }));
        }
        return prev.map(c => c.id === itemDrawer.categoryId ? { ...c, items: [...c.items, saved] } : c);
      });
      setItemDrawer({ open: false });
    });
  }

  function deleteItemById(item: FullItem) {
    if (!confirm(`Supprimer "${item.name}" ?`)) return;
    startTransition(async () => {
      await deleteItem(item.id);
      setCategories(prev => prev.map(c => ({ ...c, items: c.items.filter(i => i.id !== item.id) })));
    });
  }

  function toggleAvail(item: FullItem) {
    startTransition(async () => {
      await toggleItemAvailability(item.id, !item.available);
      setCategories(prev => prev.map(c => ({
        ...c, items: c.items.map(i => i.id === item.id ? { ...i, available: !i.available } : i),
      })));
    });
  }

  if (!menu) return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <UtensilsCrossed size={32} className="text-muted-foreground/40 mb-3" />
      <p className="text-sm text-muted-foreground">Aucun menu trouvé.</p>
    </div>
  );

  return (
    <>
      <div className="flex h-full overflow-hidden">
        {/* Left — categories */}
        <div className="w-52 shrink-0 border-r border-border flex flex-col">
          <div className="px-3 py-3 border-b border-border flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Catégories</span>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={openNewCat}><Plus size={13} /></Button>
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            {categories.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-muted-foreground">Aucune catégorie</p>
                <Button variant="ghost" size="sm" className="text-xs mt-2" onClick={openNewCat}>Créer</Button>
              </div>
            ) : categories.map(cat => (
              <div key={cat.id} onClick={() => setSelectedCat(cat.id)}
                className={cn("flex items-center gap-2 px-3 py-2.5 cursor-pointer text-sm transition-colors",
                  cat.id === selectedCat ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/50")}>
                <GripVertical size={12} className="text-muted-foreground/30 shrink-0" />
                {cat.emoji && <span className="text-sm">{cat.emoji}</span>}
                <span className="flex-1 truncate text-xs font-medium">{cat.name}</span>
                <span className="text-[10px] text-muted-foreground">{cat.items.length}</span>
              </div>
            ))}
          </div>
          <div className="px-3 py-2 border-t border-border">
            <Button variant="ghost" className="w-full text-xs h-8 gap-1.5" onClick={openNewCat}>
              <Plus size={12} />Catégorie
            </Button>
          </div>
        </div>

        {/* Right — items */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!activeCat ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <UtensilsCrossed size={28} className="text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">Sélectionnez ou créez une catégorie</p>
            </div>
          ) : (
            <>
              <div className="px-5 py-3 border-b border-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  {activeCat.emoji && <span className="text-base">{activeCat.emoji}</span>}
                  <h2 className="text-sm font-semibold">{activeCat.name}</h2>
                  <Badge variant="secondary" className="text-[10px]">{activeCat.items.length} items</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleCatVisible(activeCat)}>
                    {activeCat.visible ? <Eye size={13} /> : <EyeOff size={13} className="text-muted-foreground/50" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditCat(activeCat)}><Pencil size={13} /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/60 hover:text-destructive" onClick={() => deleteCat(activeCat)}><Trash2 size={13} /></Button>
                  <Button size="sm" className="h-7 text-xs gap-1 ml-1" onClick={() => openNewItem(activeCat.id)}>
                    <Plus size={12} />Item
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {activeCat.items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3 text-xl">🍽️</div>
                    <p className="text-sm text-muted-foreground">Aucun item dans cette catégorie</p>
                    <Button variant="outline" size="sm" className="mt-3 text-xs" onClick={() => openNewItem(activeCat.id)}>
                      Ajouter le premier item
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {activeCat.items.map(item => (
                      <div key={item.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 group transition-colors">
                        <GripVertical size={13} className="text-muted-foreground/20 shrink-0" />
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-md object-cover shrink-0 bg-muted" />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-lg shrink-0">🍽️</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className={cn("text-sm font-medium truncate", !item.available && "line-through text-muted-foreground")}>
                              {item.name}
                            </p>
                            {item.isNew && <Badge className="text-[9px] py-0 px-1.5 h-4">New</Badge>}
                            {item.featured && <Badge variant="secondary" className="text-[9px] py-0 px-1.5 h-4">★</Badge>}
                          </div>
                          {item.description && <p className="text-xs text-muted-foreground truncate">{item.description}</p>}
                        </div>
                        <span className="text-sm font-medium text-primary shrink-0">{item.price.toLocaleString()} XOF</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Switch checked={item.available} onCheckedChange={() => toggleAvail(item)} className="scale-75" />
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditItem(item)}><Pencil size={12} /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/60 hover:text-destructive" onClick={() => deleteItemById(item)}><Trash2 size={12} /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Category dialog */}
      <Dialog open={catDialog.open} onOpenChange={(v) => setCatDialog(p => ({ ...p, open: v }))}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{catDialog.editing ? "Modifier la catégorie" : "Nouvelle catégorie"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Emoji (optionnel)</Label>
              <div className="flex items-center gap-2">
                <Input value={catEmoji} onChange={(e) => setCatEmoji(e.target.value)} placeholder="🍽️" className="w-14 text-center text-lg" />
                <div className="flex flex-wrap gap-1">
                  {EMOJI_SUGGESTIONS.slice(0, 12).map(e => (
                    <button key={e} type="button" onClick={() => setCatEmoji(e)} className="text-lg hover:scale-125 transition-transform">{e}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Nom <span className="text-destructive">*</span></Label>
              <Input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="Entrées, Plats, Boissons…"
                onKeyDown={(e) => e.key === "Enter" && saveCat()} autoFocus />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCatDialog({ open: false })}>Annuler</Button>
            <Button onClick={saveCat} disabled={!catName.trim() || isPending}>
              {isPending ? <Loader2 size={14} className="animate-spin" /> : catDialog.editing ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item drawer */}
      <Sheet open={itemDrawer.open} onOpenChange={(v) => setItemDrawer(p => ({ ...p, open: v }))}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-base">{itemDrawer.editing ? "Modifier l'item" : "Nouvel item"}</SheetTitle>
          </SheetHeader>
          <div className="space-y-5 mt-5">
            {/* Photo */}
            <div className="space-y-1.5">
              <Label className="text-xs">Photo (optionnel)</Label>
              <ImageUpload endpoint="itemPhoto" value={itemForm.imageUrl}
                onChange={(url) => setItemForm(f => ({ ...f, imageUrl: url }))}
                label="Glisser ou cliquer · JPG, PNG · max 4MB" aspect="wide" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label>Nom <span className="text-destructive">*</span></Label>
                <Input value={itemForm.name} onChange={(e) => setItemForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Poisson braisé" autoFocus />
              </div>
              <div className="space-y-1.5">
                <Label>Prix (XOF) <span className="text-destructive">*</span></Label>
                <Input type="number" value={itemForm.price}
                  onChange={(e) => setItemForm(f => ({ ...f, price: e.target.value }))} placeholder="2500" />
              </div>
              <div className="space-y-1.5">
                <Label>Niveau épice</Label>
                <Select value={itemForm.spiceLevel} onValueChange={(v) => v && setItemForm(f => ({ ...f, spiceLevel: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(SPICE_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={itemForm.description} rows={2} className="resize-none"
                onChange={(e) => setItemForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Poisson tilapia grillé au charbon, servi avec de l'attiéké…" />
            </div>

            {/* Dietary tags */}
            <div className="space-y-2">
              <Label className="text-xs">Labels diétiques</Label>
              <div className="flex flex-wrap gap-1.5">
                {DIETARY_OPTIONS.map(opt => (
                  <button key={opt.value} type="button"
                    onClick={() => toggleTag("dietaryTags", opt.value)}
                    className={cn("text-xs px-2.5 py-1 rounded-full border transition-all",
                      itemForm.dietaryTags.includes(opt.value)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-muted-foreground/40")}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Allergens */}
            <div className="space-y-2">
              <Label className="text-xs">Allergènes</Label>
              <div className="flex flex-wrap gap-1.5">
                {ALLERGEN_OPTIONS.map(opt => (
                  <button key={opt.value} type="button"
                    onClick={() => toggleTag("allergens", opt.value)}
                    className={cn("text-xs px-2.5 py-1 rounded-full border transition-all",
                      itemForm.allergens.includes(opt.value)
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-border text-muted-foreground hover:border-muted-foreground/40")}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Variantes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Variantes / Portions</Label>
                <Button variant="ghost" size="sm" className="text-xs h-7 gap-1"
                  onClick={() => setItemForm(f => ({ ...f, variants: [...f.variants, { name: "", price: "" }] }))}>
                  <Plus size={11} />Ajouter
                </Button>
              </div>
              {itemForm.variants.length === 0 ? (
                <p className="text-xs text-muted-foreground">Ex: Petite, Grande, Demi-portion…</p>
              ) : (
                <div className="space-y-2">
                  {itemForm.variants.map((v, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Input placeholder="Taille" value={v.name}
                        onChange={(e) => setItemForm(f => ({
                          ...f, variants: f.variants.map((x, j) => j === i ? { ...x, name: e.target.value } : x),
                        }))} className="flex-1 h-8 text-xs" />
                      <Input placeholder="Prix" type="number" value={v.price}
                        onChange={(e) => setItemForm(f => ({
                          ...f, variants: f.variants.map((x, j) => j === i ? { ...x, price: e.target.value } : x),
                        }))} className="w-24 h-8 text-xs" />
                      <button type="button" onClick={() => setItemForm(f => ({ ...f, variants: f.variants.filter((_, j) => j !== i) }))}
                        className="text-muted-foreground hover:text-destructive transition-colors">
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Mettre en avant ★</Label>
                <Switch checked={itemForm.featured} onCheckedChange={(v) => setItemForm(f => ({ ...f, featured: v }))} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Badge "Nouveau"</Label>
                <Switch checked={itemForm.isNew} onCheckedChange={(v) => setItemForm(f => ({ ...f, isNew: v }))} />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setItemDrawer({ open: false })}>Annuler</Button>
              <Button className="flex-1" onClick={saveItem} disabled={!itemForm.name || !itemForm.price || isPending}>
                {isPending && <Loader2 size={14} className="animate-spin mr-1" />}
                {itemDrawer.editing ? "Enregistrer" : "Créer l'item"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
