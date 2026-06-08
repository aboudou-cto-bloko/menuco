"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Template = "CLASSIQUE" | "CARDS" | "MAGAZINE";

const TEMPLATES: { value: Template; label: string; description: string; preview: React.ReactNode }[] = [
  {
    value: "CLASSIQUE",
    label: "Classique",
    description: "Fond sombre chaleureux · Liste simple · Épuré",
    preview: (
      <div className="w-full h-full rounded-lg overflow-hidden" style={{ backgroundColor: "#0f0705" }}>
        {/* Header */}
        <div className="px-3 py-2 border-b flex items-center gap-1.5" style={{ borderColor: "#3d2418" }}>
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#f97316" }} />
          <div className="w-16 h-1.5 rounded-full opacity-60" style={{ backgroundColor: "#f6ded3" }} />
        </div>
        {/* Tabs */}
        <div className="flex gap-1 px-3 py-1.5">
          <div className="px-2 py-0.5 rounded-full text-[6px]" style={{ backgroundColor: "#f97316", color: "#fff" }}>Entrées</div>
          <div className="px-2 py-0.5 rounded-full opacity-30" style={{ color: "#f6ded3", border: "1px solid #3d2418" }}>Plats</div>
          <div className="px-2 py-0.5 rounded-full opacity-30" style={{ color: "#f6ded3", border: "1px solid #3d2418" }}>Boissons</div>
        </div>
        {/* Items */}
        <div className="px-3 space-y-1.5 mt-1">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-2 p-1.5 rounded-md" style={{ backgroundColor: "rgba(26,15,10,0.6)", border: "1px solid #3d2418" }}>
              <div className="w-5 h-5 rounded" style={{ backgroundColor: "#3d2418" }} />
              <div className="flex-1">
                <div className="h-1 w-12 rounded-full mb-0.5" style={{ backgroundColor: "#f6ded3", opacity: 0.6 }} />
                <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: "#f6ded3", opacity: 0.3 }} />
              </div>
              <div className="h-1 w-8 rounded-full" style={{ backgroundColor: "#f97316", opacity: 0.8 }} />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    value: "CARDS",
    label: "Cards",
    description: "Fond noir · Grille 2 colonnes · Moderne",
    preview: (
      <div className="w-full h-full rounded-lg overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="px-3 py-2 border-b flex items-center gap-1.5" style={{ borderColor: "#222" }}>
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#f97316" }} />
          <div className="w-16 h-1.5 rounded-full opacity-60" style={{ backgroundColor: "#fff" }} />
        </div>
        <div className="p-2 grid grid-cols-2 gap-1.5 mt-1">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="rounded-lg overflow-hidden" style={{ backgroundColor: "#111" }}>
              <div className="h-7" style={{ backgroundColor: "#1e1e1e" }} />
              <div className="px-1.5 py-1">
                <div className="h-1 w-10 rounded-full mb-0.5" style={{ backgroundColor: "#fff", opacity: 0.6 }} />
                <div className="h-0.5 w-6 rounded-full" style={{ backgroundColor: "#f97316", opacity: 0.8 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    value: "MAGAZINE",
    label: "Magazine",
    description: "Fond clair · Hero cover · Style éditorial",
    preview: (
      <div className="w-full h-full rounded-lg overflow-hidden" style={{ backgroundColor: "#faf8f5" }}>
        {/* Hero */}
        <div className="h-12 relative" style={{ background: "linear-gradient(135deg, #f97316, #1a1008)" }}>
          <div className="absolute inset-0 flex items-end p-2">
            <div>
              <div className="h-1.5 w-14 rounded-full mb-1" style={{ backgroundColor: "#fff", opacity: 0.9 }} />
              <div className="h-1 w-10 rounded-full" style={{ backgroundColor: "#fff", opacity: 0.5 }} />
            </div>
          </div>
        </div>
        {/* Sticky bar */}
        <div className="flex items-center justify-between px-2 py-1" style={{ borderBottom: "1px solid #e5ddd5" }}>
          <div className="h-1 w-10 rounded-full opacity-30" style={{ backgroundColor: "#1a1008" }} />
          <div className="h-4 w-12 rounded-full" style={{ backgroundColor: "#25d366" }} />
        </div>
        {/* Accordion items */}
        <div className="px-2 py-1 space-y-1">
          {["Entrées", "Plats"].map((name, i) => (
            <div key={name} className="border rounded-md overflow-hidden" style={{ borderColor: "#e5ddd5" }}>
              <div className="px-2 py-1 flex items-center justify-between">
                <div className="h-1.5 w-10 rounded-full" style={{ backgroundColor: "#1a1008", opacity: 0.5 }} />
                <div className="w-2 h-2 opacity-30" style={{ borderBottom: "1.5px solid #1a1008", borderRight: "1.5px solid #1a1008", transform: i === 0 ? "rotate(-135deg)" : "rotate(45deg)" }} />
              </div>
              {i === 0 && (
                <div className="border-t px-2 py-1.5 space-y-1" style={{ borderColor: "#e5ddd5" }}>
                  {[1, 2].map(j => (
                    <div key={j} className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded" style={{ backgroundColor: "#e5ddd5" }} />
                      <div className="flex-1">
                        <div className="h-1 w-10 rounded-full opacity-50" style={{ backgroundColor: "#1a1008" }} />
                      </div>
                      <div className="h-1 w-7 rounded-full" style={{ backgroundColor: "#f97316", opacity: 0.7 }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

interface Props {
  value: Template;
  onChange: (v: Template) => void;
}

export function TemplatePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const current = TEMPLATES.find(t => t.value === value)!;

  return (
    <>
      <Button variant="outline" className="w-full justify-between font-normal h-10" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full"
            style={{ background: value === "MAGAZINE" ? "#faf8f5" : value === "CARDS" ? "#0a0a0a" : "#0f0705", border: "1px solid hsl(var(--border))" }} />
          {current.label}
        </div>
        <ChevronDown size={14} className="opacity-50" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choisir un template</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {TEMPLATES.map(t => (
              <button key={t.value} type="button"
                onClick={() => { onChange(t.value); setOpen(false); }}
                className={cn(
                  "group relative flex flex-col rounded-xl border-2 overflow-hidden text-left transition-all",
                  value === t.value ? "border-primary shadow-md" : "border-border hover:border-muted-foreground/30"
                )}>
                {/* Preview */}
                <div className="aspect-[3/4] w-full p-2 bg-muted/30">
                  {t.preview}
                </div>
                {/* Label */}
                <div className="px-3 py-2.5 border-t border-border/50 bg-background">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{t.label}</p>
                    {value === t.value && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "hsl(var(--primary))" }}>
                        <Check size={11} color="#fff" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{t.description}</p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
