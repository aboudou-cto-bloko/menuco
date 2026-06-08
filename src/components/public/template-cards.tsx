"use client";

import { useState } from "react";
import { X, MessageCircle, Star, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Restaurant, Menu, Category, MenuItem, ItemVariant } from "@/generated/prisma/client";

type FullItem = MenuItem & { variants: ItemVariant[] };
type FullCategory = Category & { items: FullItem[] };
type FullMenu = Menu & { categories: FullCategory[] };

interface Props { restaurant: Restaurant; menu: FullMenu; }

export function TemplateCards({ restaurant, menu }: Props) {
  const [activeCat, setActiveCat] = useState(menu.categories[0]?.id ?? "");
  const [selected, setSelected] = useState<FullItem | null>(null);
  const accent = restaurant.accentColor ?? "#f97316";

  const activeItems = menu.categories.find(c => c.id === activeCat)?.items.filter(i => i.available) ?? [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a", color: "#f0f0f0" }}>
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md" style={{ backgroundColor: "rgba(10,10,10,0.92)" }}>
        <div className="max-w-xl mx-auto px-4 pt-4 pb-2 flex items-center gap-3">
          {restaurant.logo ? (
            <img src={restaurant.logo} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: accent, color: "#fff" }}>{restaurant.name[0]}</div>
          )}
          <h1 className="text-sm font-semibold flex-1 truncate">{restaurant.name}</h1>
          {restaurant.whatsapp && (
            <a href={`https://wa.me/${restaurant.whatsapp.replace(/\D/g, "")}`}
              className="text-[11px] px-3 py-1.5 rounded-full font-semibold"
              style={{ backgroundColor: "#25d366", color: "#fff" }}>Commander</a>
          )}
        </div>

        {/* Category pills */}
        <div className="overflow-x-auto scrollbar-none px-4 pb-3">
          <div className="flex gap-2 min-w-max">
            {menu.categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCat(cat.id)}
                className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
                style={activeCat === cat.id
                  ? { backgroundColor: accent, color: "#fff" }
                  : { backgroundColor: "#1a1a1a", color: "#888" }}>
                {cat.emoji && <span className="mr-1">{cat.emoji}</span>}
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Cards grid */}
      <main className="max-w-xl mx-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {activeItems.map(item => (
            <button key={item.id} onClick={() => setSelected(item)}
              className="rounded-xl overflow-hidden text-left transition-transform active:scale-95"
              style={{ backgroundColor: "#141414" }}>
              {/* Image */}
              <div className="relative aspect-square">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl"
                    style={{ backgroundColor: "#1f1f1f" }}>🍽️</div>
                )}
                {/* Price overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-sm font-bold tabular-nums" style={{ color: accent }}>
                    {item.price.toLocaleString()} XOF
                  </span>
                </div>
                {item.isNew && (
                  <div className="absolute top-2 right-2">
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                      style={{ backgroundColor: accent, color: "#fff" }}>NEW</span>
                  </div>
                )}
              </div>
              {/* Name */}
              <div className="px-2.5 py-2">
                <p className="text-xs font-medium leading-snug line-clamp-2">{item.name}</p>
                {item.description && (
                  <p className="text-[10px] opacity-40 mt-0.5 line-clamp-1">{item.description}</p>
                )}
              </div>
            </button>
          ))}
        </div>

        {activeItems.length === 0 && (
          <div className="py-20 text-center opacity-30">
            <p className="text-sm">Aucun item disponible</p>
          </div>
        )}
      </main>

      {/* Item modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
          <div className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl overflow-hidden"
            style={{ backgroundColor: "#141414" }}>
            {selected.imageUrl && (
              <div className="aspect-video relative">
                <img src={selected.imageUrl} alt={selected.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold leading-tight">{selected.name}</h3>
                <button onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#2a2a2a" }}>
                  <X size={14} />
                </button>
              </div>
              <p className="text-xl font-bold tabular-nums" style={{ color: accent }}>
                {selected.price.toLocaleString()} XOF
              </p>
              {selected.description && (
                <p className="text-sm opacity-60 leading-relaxed">{selected.description}</p>
              )}
              {selected.variants.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium opacity-60">Variantes</p>
                  {selected.variants.map(v => (
                    <div key={v.id} className="flex justify-between text-sm px-3 py-2 rounded-lg"
                      style={{ backgroundColor: "#1f1f1f" }}>
                      <span>{v.name}</span>
                      <span className="font-medium" style={{ color: accent }}>{v.price.toLocaleString()} XOF</span>
                    </div>
                  ))}
                </div>
              )}
              {restaurant.whatsapp && (
                <a href={`https://wa.me/${restaurant.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Bonjour, je voudrais commander : ${selected.name}`)}`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold"
                  style={{ backgroundColor: "#25d366", color: "#fff" }}>
                  <MessageCircle size={15} />Commander via WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating WA button */}
      {restaurant.whatsapp && (
        <a href={`https://wa.me/${restaurant.whatsapp.replace(/\D/g, "")}`}
          className="fixed bottom-6 right-4 flex items-center gap-2 px-4 py-3 rounded-full shadow-xl text-sm font-semibold z-40"
          style={{ backgroundColor: "#25d366", color: "#fff" }}>
          <MessageCircle size={16} />
        </a>
      )}
    </div>
  );
}
