"use client";

import { useState } from "react";
import { Phone, MessageCircle, Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { ItemDetailSheet } from "./item-detail-sheet";
import { getPalette, bgAlpha } from "@/lib/palettes";
import { getFont } from "@/lib/fonts";
import type { Restaurant, Menu, Category, MenuItem, ItemVariant } from "@/generated/prisma/client";

type FullItem = MenuItem & { variants: ItemVariant[] };
type FullCategory = Category & { items: FullItem[] };
type FullMenu = Menu & { categories: FullCategory[] };

interface Props {
  restaurant: Restaurant;
  menu: FullMenu;
}

const SPICE_EMOJI: Record<string, string> = { NONE: "", MILD: "🌶️", MEDIUM: "🌶️🌶️", HOT: "🌶️🌶️🌶️" };

export function TemplateClassique({ restaurant, menu }: Props) {
  const [activeCat, setActiveCat] = useState(menu.categories[0]?.id ?? "");
  const [selectedItem, setSelectedItem] = useState<FullItem | null>(null);
  const p = getPalette(restaurant.themePalette);
  const accent = p.accent;
  const fontFamily = getFont(restaurant.fontChoice).family;

  const activeItems = menu.categories.find(c => c.id === activeCat)?.items.filter(i => i.available) ?? [];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: p.bg, color: p.text, fontFamily }}>
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md border-b"
        style={{ borderColor: p.border, backgroundColor: bgAlpha(p.bg, 0.9) }}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          {restaurant.logo ? (
            <img src={restaurant.logo} alt={restaurant.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ backgroundColor: accent, color: p.accentFg }}>
              {restaurant.name[0]}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-sm font-semibold leading-tight truncate">{restaurant.name}</h1>
            {restaurant.city && <p className="text-[10px] opacity-50">{restaurant.city}</p>}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {restaurant.whatsapp && (
              <a href={`https://wa.me/${restaurant.whatsapp.replace(/\D/g, "")}`}
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ backgroundColor: "#25d366", color: "#fff" }}>
                WA
              </a>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div className="border-t overflow-x-auto scrollbar-none" style={{ borderColor: p.border }}>
          <div className="max-w-lg mx-auto flex gap-1 px-3 py-1.5 min-w-max">
            {menu.categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCat(cat.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                  activeCat === cat.id ? "" : "opacity-50 hover:opacity-80"
                )}
                style={activeCat === cat.id
                  ? { backgroundColor: accent, color: p.accentFg }
                  : { color: p.text }}>
                {cat.emoji && <span className="mr-1">{cat.emoji}</span>}
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Items */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4 space-y-1">
        {activeItems.length === 0 ? (
          <div className="py-16 text-center opacity-40">
            <p className="text-sm">Aucun item disponible</p>
          </div>
        ) : (
          activeItems.map(item => (
            <button key={item.id} onClick={() => setSelectedItem(item)}
              className="w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-colors active:scale-[0.99]"
              style={{ borderColor: p.border, backgroundColor: bgAlpha(p.surface, 0.6) }}>
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-medium leading-tight">{item.name}</p>
                      {item.isNew && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                          style={{ backgroundColor: accent, color: p.accentFg }}>NEW</span>
                      )}
                      {SPICE_EMOJI[item.spiceLevel] && (
                        <span className="text-xs">{SPICE_EMOJI[item.spiceLevel]}</span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs mt-0.5 opacity-50 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                  <p className="text-sm font-bold shrink-0 tabular-nums" style={{ color: accent }}>
                    {item.price.toLocaleString()}
                    <span className="text-[10px] font-normal opacity-60 ml-0.5">XOF</span>
                  </p>
                </div>
                {item.variants.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {item.variants.map(v => (
                      <span key={v.id} className="text-[10px] px-2 py-0.5 rounded-full border opacity-60"
                        style={{ borderColor: p.border }}>
                        {v.name} • {v.price.toLocaleString()} XOF
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </button>
          ))
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 px-4" style={{ borderColor: p.border }}>
        <div className="max-w-lg mx-auto space-y-3">
          {restaurant.address && (
            <div className="flex items-center gap-2 text-xs opacity-50">
              <MapPin size={12} />{restaurant.address}
            </div>
          )}
          <div className="flex gap-2 flex-wrap">
            {restaurant.phone && (
              <a href={`tel:${restaurant.phone}`}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border"
                style={{ borderColor: p.border, color: p.text }}>
                <Phone size={12} />{restaurant.phone}
              </a>
            )}
            {restaurant.whatsapp && (
              <a href={`https://wa.me/${restaurant.whatsapp.replace(/\D/g, "")}`}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium"
                style={{ backgroundColor: "#25d366", color: "#fff" }}>
                <MessageCircle size={12} />WhatsApp
              </a>
            )}
            {restaurant.googlePlaceId && (
              <a href={`https://search.google.com/local/writereview?placeid=${restaurant.googlePlaceId}`}
                target="_blank"
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border"
                style={{ borderColor: p.border, color: p.text }}>
                <Star size={12} />Laisser un avis
              </a>
            )}
          </div>
          <p className="text-[10px] opacity-20 text-center">Propulsé par MenuCo</p>
        </div>
      </footer>

      <ItemDetailSheet
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        accent={accent}
        whatsapp={restaurant.whatsapp}
        restaurantName={restaurant.name}
        theme={p.dark ? "dark" : "light"}
      />
    </div>
  );
}
