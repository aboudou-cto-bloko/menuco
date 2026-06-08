"use client";

import { cn } from "@/lib/utils";
import { PALETTES } from "@/lib/palettes";
import { Check } from "lucide-react";

interface Props {
  value: string | null | undefined;
  onChange: (id: string) => void;
}

export function PalettePicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {PALETTES.map(p => (
        <button key={p.id} type="button" onClick={() => onChange(p.id)}
          title={p.name}
          className={cn(
            "relative rounded-xl overflow-hidden border-2 transition-all hover:scale-105",
            value === p.id ? "border-primary ring-1 ring-primary" : "border-transparent"
          )}>
          {/* Preview: bg + stripe for accent */}
          <div className="h-10 flex">
            <div className="flex-1" style={{ backgroundColor: p.bg }} />
            <div className="w-2" style={{ backgroundColor: p.surface }} />
            <div className="w-3" style={{ backgroundColor: p.accent }} />
          </div>
          {/* Name label */}
          <div className="px-1 py-1" style={{ backgroundColor: p.bg }}>
            <p className="text-[9px] font-medium text-center truncate" style={{ color: p.text }}>
              {p.name}
            </p>
          </div>
          {value === p.id && (
            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <Check size={8} className="text-primary-foreground" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
