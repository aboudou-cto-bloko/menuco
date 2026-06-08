"use client";

import { useState } from "react";
import { MessageCircle, Phone, Star, MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ItemDetailSheet } from "./item-detail-sheet";
import type { Restaurant, Menu, Category, MenuItem, ItemVariant } from "@/generated/prisma/client";

type FullItem = MenuItem & { variants: ItemVariant[] };
type FullCategory = Category & { items: FullItem[] };
type FullMenu = Menu & { categories: FullCategory[] };

interface Props { restaurant: Restaurant; menu: FullMenu; }

export function TemplateMagazine({ restaurant, menu }: Props) {
  const [expanded, setExpanded] = useState<string | null>(menu.categories[0]?.id ?? null);
  const [selectedItem, setSelectedItem] = useState<FullItem | null>(null);
  const accent = restaurant.accentColor ?? "#f97316";

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1008]">
      {/* Hero cover */}
      <div className="relative h-[55vh] min-h-[320px] overflow-hidden">
        {restaurant.cover ? (
          <img src={restaurant.cover} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${accent}33, #0f0705)` }}>
            <span className="text-6xl opacity-30">🍽️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-2xl mx-auto">
            {restaurant.logo && (
              <img src={restaurant.logo} alt="" className="w-12 h-12 rounded-full object-cover mb-3 border-2 border-white/30" />
            )}
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight tracking-tight">
              {restaurant.name}
            </h1>
            {restaurant.description && (
              <p className="text-white/70 text-sm mt-1.5 max-w-md leading-relaxed">{restaurant.description}</p>
            )}
            {restaurant.city && (
              <p className="text-white/50 text-xs mt-2 flex items-center gap-1">
                <MapPin size={10} />{restaurant.city}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contact bar */}
      <div className="sticky top-0 z-20 border-b"
        style={{ backgroundColor: "rgba(250,248,245,0.95)", backdropFilter: "blur(8px)", borderColor: "#e5ddd5" }}>
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <p className="text-xs font-serif font-semibold truncate opacity-60">{restaurant.name}</p>
          <div className="flex items-center gap-2">
            {restaurant.phone && (
              <a href={`tel:${restaurant.phone}`}
                className="text-xs px-3 py-1.5 rounded-full border font-medium"
                style={{ borderColor: "#d1c4b8" }}>
                <Phone size={10} className="inline mr-1" />{restaurant.phone}
              </a>
            )}
            {restaurant.whatsapp && (
              <a href={`https://wa.me/${restaurant.whatsapp.replace(/\D/g, "")}`}
                className="text-xs px-3 py-1.5 rounded-full font-semibold"
                style={{ backgroundColor: "#25d366", color: "#fff" }}>
                <MessageCircle size={10} className="inline mr-1" />WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Menu sections */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-1">
        {menu.categories.map(cat => (
          <div key={cat.id} className="border rounded-xl overflow-hidden" style={{ borderColor: "#e5ddd5" }}>
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}>
              <div className="flex items-center gap-2.5">
                {cat.emoji && <span className="text-xl">{cat.emoji}</span>}
                <div>
                  <h2 className="text-base font-serif font-semibold">{cat.name}</h2>
                  <p className="text-[11px] opacity-40">{cat.items.filter(i => i.available).length} plats</p>
                </div>
              </div>
              <ChevronDown size={16} className={cn("opacity-40 transition-transform", expanded === cat.id && "rotate-180")} />
            </button>

            {expanded === cat.id && (
              <div className="border-t" style={{ borderColor: "#e5ddd5" }}>
                {cat.items.filter(i => i.available).map((item, idx) => (
                  <button key={item.id} onClick={() => setSelectedItem(item)}
                    className={cn(
                      "w-full text-left flex items-start gap-4 px-5 py-4 transition-colors hover:bg-[#f5efe8] active:scale-[0.99]",
                      idx > 0 && "border-t"
                    )}
                    style={{ borderColor: "#f0ebe4" }}>
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-medium leading-snug">{item.name}</h3>
                            {item.isNew && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0"
                                style={{ backgroundColor: accent, color: "#fff" }}>NEW</span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs opacity-50 mt-1 leading-relaxed line-clamp-2">{item.description}</p>
                          )}
                        </div>
                        <p className="text-sm font-bold tabular-nums shrink-0" style={{ color: accent }}>
                          {item.price.toLocaleString()} <span className="text-[10px] font-normal opacity-60">XOF</span>
                        </p>
                      </div>
                      {item.variants.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {item.variants.map(v => (
                            <span key={v.id} className="text-[10px] px-2 py-1 rounded-md"
                              style={{ backgroundColor: "#f0ebe4" }}>
                              {v.name} — {v.price.toLocaleString()} XOF
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
                {cat.items.filter(i => i.available).length === 0 && (
                  <div className="px-5 py-6 text-center text-xs opacity-30">Aucun plat disponible</div>
                )}
              </div>
            )}
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t mt-8 py-8 px-4" style={{ borderColor: "#e5ddd5", backgroundColor: "#f5f0ea" }}>
        <div className="max-w-2xl mx-auto space-y-4 text-center">
          {restaurant.address && (
            <p className="text-xs opacity-50 flex items-center justify-center gap-1">
              <MapPin size={10} />{restaurant.address}
            </p>
          )}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {restaurant.phone && (
              <a href={`tel:${restaurant.phone}`} className="text-xs underline opacity-50">{restaurant.phone}</a>
            )}
            {restaurant.googlePlaceId && (
              <a href={`https://search.google.com/local/writereview?placeid=${restaurant.googlePlaceId}`}
                target="_blank"
                className="flex items-center gap-1 text-xs font-medium opacity-60">
                <Star size={11} />Laisser un avis Google
              </a>
            )}
          </div>
          <p className="text-[10px] opacity-20">Propulsé par MenuCo</p>
        </div>
      </footer>

      {/* Floating WA */}
      {restaurant.whatsapp && (
        <a href={`https://wa.me/${restaurant.whatsapp.replace(/\D/g, "")}`}
          className="fixed bottom-6 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-40"
          style={{ backgroundColor: "#25d366" }}>
          <MessageCircle size={22} color="#fff" />
        </a>
      )}

      {/* Item detail bottom sheet */}
      <ItemDetailSheet
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        accent={accent}
        whatsapp={restaurant.whatsapp}
        restaurantName={restaurant.name}
        theme="light"
      />
    </div>
  );
}
