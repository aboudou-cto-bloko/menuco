"use client";

import { useEffect } from "react";
import { X, MessageCircle } from "lucide-react";
import type { MenuItem, ItemVariant } from "@/generated/prisma/client";

type FullItem = MenuItem & { variants: ItemVariant[] };

const SPICE_LABELS: Record<string, string> = { MILD: "🌶️ Légèrement épicé", MEDIUM: "🌶️🌶️ Moyennement épicé", HOT: "🌶️🌶️🌶️ Très épicé" };

const DIETARY_LABELS: Record<string, string> = {
  VEGETARIAN: "🌿 Végétarien", VEGAN: "🌱 Vegan", HALAL: "☪️ Halal",
  GLUTEN_FREE: "GF Sans gluten", DAIRY_FREE: "DF Sans lactose", SPICY: "🌶️ Épicé",
};

const ALLERGEN_LABELS: Record<string, string> = {
  GLUTEN: "Gluten", CRUSTACEANS: "Crustacés", EGGS: "Œufs", FISH: "Poisson",
  PEANUTS: "Arachides", SOY: "Soja", MILK: "Lait", NUTS: "Noix", SESAME: "Sésame",
};

interface Props {
  item: FullItem | null;
  onClose: () => void;
  accent: string;
  whatsapp?: string | null;
  restaurantName: string;
  theme?: "dark" | "light";
}

export function ItemDetailSheet({ item, onClose, accent, whatsapp, restaurantName, theme = "dark" }: Props) {
  useEffect(() => {
    if (!item) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  if (!item) return null;

  const isDark = theme === "dark";
  const bg = isDark ? "#1a0f0a" : "#fff";
  const textPrimary = isDark ? "#f6ded3" : "#1a1008";
  const textMuted = isDark ? "rgba(246,222,211,0.5)" : "rgba(26,16,8,0.5)";
  const border = isDark ? "#3d2418" : "#e5ddd5";
  const overlayBg = "rgba(0,0,0,0.7)";

  const tags = Array.isArray(item.dietaryTags) ? item.dietaryTags as string[] : [];
  const allergens = Array.isArray(item.allergens) ? item.allergens as string[] : [];

  function buildWAMessage() {
    const msg = `Bonjour ! Je souhaite commander : ${item!.name} (${item!.price.toLocaleString()} XOF) — ${restaurantName}`;
    return `https://wa.me/${whatsapp?.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50"
        style={{ backgroundColor: overlayBg, backdropFilter: "blur(2px)" }}
        onClick={onClose}
      />

      {/* Sheet — slides up from bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl overflow-hidden max-h-[85vh] flex flex-col"
        style={{ backgroundColor: bg, boxShadow: "0 -8px 32px rgba(0,0,0,0.3)" }}>

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full opacity-20" style={{ backgroundColor: textPrimary }} />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
          style={{ backgroundColor: border }}>
          <X size={14} color={textPrimary} />
        </button>

        <div className="overflow-y-auto flex-1 px-5 pb-6 pt-2">
          {/* Photo */}
          {item.imageUrl && (
            <div className="w-full aspect-video rounded-xl overflow-hidden mb-4">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Name + badges */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="min-w-0">
              <h2 className="text-lg font-bold leading-snug" style={{ color: textPrimary }}>{item.name}</h2>
              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                {item.isNew && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                    style={{ backgroundColor: accent, color: "#fff" }}>NOUVEAU</span>
                )}
                {item.featured && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                    style={{ border: `1px solid ${accent}`, color: accent }}>★ POPULAIRE</span>
                )}
              </div>
            </div>
            <p className="text-xl font-black tabular-nums shrink-0" style={{ color: accent }}>
              {item.price.toLocaleString()}
              <span className="text-xs font-normal ml-1 opacity-60" style={{ color: textPrimary }}>XOF</span>
            </p>
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-sm leading-relaxed mt-3" style={{ color: textMuted }}>{item.description}</p>
          )}

          {/* Spice */}
          {item.spiceLevel && item.spiceLevel !== "NONE" && SPICE_LABELS[item.spiceLevel] && (
            <p className="text-xs mt-3" style={{ color: textMuted }}>{SPICE_LABELS[item.spiceLevel]}</p>
          )}

          {/* Variants */}
          {item.variants.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold mb-2 opacity-60" style={{ color: textPrimary }}>TAILLES / PORTIONS</p>
              <div className="space-y-1.5">
                {item.variants.map(v => (
                  <div key={v.id} className="flex items-center justify-between px-3 py-2 rounded-lg"
                    style={{ backgroundColor: isDark ? "#0f0705" : "#f5f0ea", border: `1px solid ${border}` }}>
                    <span className="text-sm" style={{ color: textPrimary }}>{v.name}</span>
                    <span className="text-sm font-bold tabular-nums" style={{ color: accent }}>{v.price.toLocaleString()} XOF</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dietary tags */}
          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full"
                  style={{ border: `1px solid ${border}`, color: textMuted }}>
                  {DIETARY_LABELS[tag] ?? tag}
                </span>
              ))}
            </div>
          )}

          {/* Allergens */}
          {allergens.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] opacity-40 mb-1.5" style={{ color: textPrimary }}>ALLERGÈNES :</p>
              <p className="text-xs" style={{ color: textMuted }}>
                {allergens.map(a => ALLERGEN_LABELS[a] ?? a).join(", ")}
              </p>
            </div>
          )}

          {/* WhatsApp CTA */}
          {whatsapp && (
            <a href={buildWAMessage()} target="_blank" rel="noreferrer"
              className="mt-6 flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-semibold text-sm"
              style={{ backgroundColor: "#25d366", color: "#fff" }}>
              <MessageCircle size={18} />
              Commander via WhatsApp
            </a>
          )}
        </div>
      </div>
    </>
  );
}
