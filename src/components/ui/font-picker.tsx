"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { FONTS, FONT_CATEGORIES, getAllFontsPreviewUrl, type FontOption } from "@/lib/fonts";
import { Check } from "lucide-react";

interface Props {
  value: string | null | undefined;
  onChange: (id: string) => void;
}

export function FontPicker({ value, onChange }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("Sans-serif");
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load all fonts for preview when picker mounts
  useEffect(() => {
    if (fontsLoaded) return;
    const url = getAllFontsPreviewUrl();
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.onload = () => setFontsLoaded(true);
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [fontsLoaded]);

  const visible = FONTS.filter(f => f.category === activeCategory);
  const selected = FONTS.find(f => f.id === value);

  return (
    <div className="space-y-3">
      {/* Selected preview */}
      {selected && (
        <div className="px-3 py-2.5 rounded-lg border border-border bg-muted/30 flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Police sélectionnée</p>
            <p className="text-base font-medium leading-tight" style={{ fontFamily: selected.family }}>
              {selected.name}
            </p>
            <p className="text-xs mt-0.5" style={{ fontFamily: selected.family, opacity: 0.6 }}>
              Bonsoir & Menu du jour — 1 200 XOF
            </p>
          </div>
          <span className="text-[9px] text-muted-foreground border border-border px-1.5 py-0.5 rounded-full">
            {selected.category}
          </span>
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-1 flex-wrap">
        {FONT_CATEGORIES.map(cat => (
          <button key={cat} type="button"
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors",
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground border border-border"
            )}>
            {cat}
          </button>
        ))}
      </div>

      {/* Font list */}
      <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto pr-0.5 custom-scrollbar">
        {visible.map(font => (
          <button key={font.id} type="button"
            onClick={() => onChange(font.id)}
            className={cn(
              "relative text-left px-3 py-2.5 rounded-lg border transition-all",
              value === font.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40 hover:bg-muted/40"
            )}>
            <p className="text-xs font-medium leading-tight" style={{ fontFamily: font.family }}>
              {font.name}
            </p>
            <p className="text-[10px] mt-0.5 opacity-50" style={{ fontFamily: font.family }}>
              Bonjour 123
            </p>
            {value === font.id && (
              <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <Check size={8} className="text-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
