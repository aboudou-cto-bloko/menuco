import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TEMPLATES = [
  {
    value: "CLASSIQUE",
    label: "Classique",
    description: "Design sombre chaleureux avec liste d'items scrollable et onglets de catégories sticky.",
    features: ["Fond sombre #0f0705", "Onglets catégories sticky", "Badge NEW + épice", "Variantes inline", "Bottom sheet détail", "Lien WhatsApp"],
    theme: "dark",
    bg: "#0f0705",
    accent: "#f97316",
    text: "#f6ded3",
  },
  {
    value: "CARDS",
    label: "Cards",
    description: "Grille 2 colonnes sur fond noir, modal item avec photo grand format et CTA WhatsApp.",
    features: ["Fond noir #0a0a0a", "Grille 2 colonnes", "Modal item full-screen", "Photo grande taille", "CTA WhatsApp dans modal", "Bouton WA flottant"],
    theme: "dark",
    bg: "#0a0a0a",
    accent: "#f97316",
    text: "#ffffff",
  },
  {
    value: "MAGAZINE",
    label: "Magazine",
    description: "Style éditorial clair avec hero cover plein écran, accordéon de catégories et typographie serif.",
    features: ["Fond clair #faf8f5", "Hero cover plein écran", "Accordéon catégories", "Typographie serif", "Bottom sheet détail", "Bouton WA flottant"],
    theme: "light",
    bg: "#faf8f5",
    accent: "#f97316",
    text: "#1a1008",
  },
];

const CLASSIQUE_PREVIEW = (
  <div className="w-full h-full" style={{ backgroundColor: "#0f0705", fontFamily: "sans-serif" }}>
    <div className="px-3 py-2 border-b flex items-center gap-1.5" style={{ borderColor: "#3d2418", backgroundColor: "rgba(15,7,5,0.95)" }}>
      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold" style={{ backgroundColor: "#f97316", color: "#fff" }}>R</div>
      <div className="flex-1">
        <div className="h-1.5 w-14 rounded-full opacity-70" style={{ backgroundColor: "#f6ded3" }} />
      </div>
      <div className="px-1.5 py-0.5 rounded-full text-[5px] font-medium" style={{ backgroundColor: "#25d366", color: "#fff" }}>WA</div>
    </div>
    <div className="flex gap-1 px-3 py-1.5 border-b" style={{ borderColor: "#3d2418" }}>
      <div className="px-1.5 py-0.5 rounded-full text-[5px]" style={{ backgroundColor: "#f97316", color: "#fff" }}>🍽️ Entrées</div>
      <div className="px-1.5 py-0.5 rounded-full text-[5px] opacity-40" style={{ color: "#f6ded3", border: "1px solid #3d2418" }}>Plats</div>
      <div className="px-1.5 py-0.5 rounded-full text-[5px] opacity-40" style={{ color: "#f6ded3", border: "1px solid #3d2418" }}>Boissons</div>
    </div>
    <div className="px-3 py-2 space-y-1.5">
      {["Salade niçoise", "Thieboudienne", "Jus de gingembre"].map((name, i) => (
        <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg" style={{ backgroundColor: "rgba(26,15,10,0.8)", border: "1px solid #3d2418" }}>
          <div className="w-6 h-6 rounded-md shrink-0" style={{ backgroundColor: "#2a1408" }} />
          <div className="flex-1 min-w-0">
            <div className="h-1 w-12 rounded-full mb-0.5 opacity-70" style={{ backgroundColor: "#f6ded3" }} />
            <div className="h-0.5 w-8 rounded-full opacity-30" style={{ backgroundColor: "#f6ded3" }} />
          </div>
          <div className="text-[5px] font-bold tabular-nums" style={{ color: "#f97316" }}>2 500</div>
        </div>
      ))}
    </div>
  </div>
);

const CARDS_PREVIEW = (
  <div className="w-full h-full" style={{ backgroundColor: "#0a0a0a" }}>
    <div className="px-3 py-2 border-b flex items-center gap-1.5" style={{ borderColor: "#1a1a1a", backgroundColor: "#0a0a0a" }}>
      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold" style={{ backgroundColor: "#f97316", color: "#fff" }}>R</div>
      <div className="h-1.5 w-14 rounded-full opacity-60" style={{ backgroundColor: "#fff" }} />
      <div className="ml-auto px-1.5 py-0.5 rounded-full text-[5px]" style={{ backgroundColor: "#25d366", color: "#fff" }}>WA</div>
    </div>
    <div className="flex gap-1 px-3 py-1.5 border-b" style={{ borderColor: "#1a1a1a" }}>
      <div className="px-1.5 py-0.5 rounded-full text-[5px]" style={{ backgroundColor: "#f97316", color: "#fff" }}>Tous</div>
      <div className="px-1.5 py-0.5 rounded-full text-[5px] opacity-40" style={{ color: "#fff", border: "1px solid #222" }}>Entrées</div>
    </div>
    <div className="p-2 grid grid-cols-2 gap-1.5">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="rounded-xl overflow-hidden" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
          <div className="h-9 flex items-center justify-center text-xs" style={{ backgroundColor: "#1a1a1a", color: "#333" }}>🍽️</div>
          <div className="p-1.5">
            <div className="h-1 w-10 rounded-full mb-0.5 opacity-60" style={{ backgroundColor: "#fff" }} />
            <div className="h-0.5 w-8 rounded-full opacity-30 mb-1" style={{ backgroundColor: "#fff" }} />
            <div className="h-1 w-7 rounded-full" style={{ backgroundColor: "#f97316", opacity: 0.8 }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MAGAZINE_PREVIEW = (
  <div className="w-full h-full" style={{ backgroundColor: "#faf8f5" }}>
    <div className="h-16 relative" style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.5), #1a1008)" }}>
      <div className="absolute inset-0 flex items-end p-2">
        <div>
          <div className="w-4 h-4 rounded-full mb-1" style={{ backgroundColor: "rgba(255,255,255,0.3)" }} />
          <div className="h-2 w-16 rounded-full mb-0.5" style={{ backgroundColor: "#fff", opacity: 0.9 }} />
          <div className="h-1 w-12 rounded-full" style={{ backgroundColor: "#fff", opacity: 0.5 }} />
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between px-2 py-1.5 border-b" style={{ borderColor: "#e5ddd5", backgroundColor: "rgba(250,248,245,0.95)" }}>
      <div className="h-1 w-10 rounded-full opacity-30" style={{ backgroundColor: "#1a1008" }} />
      <div className="flex gap-1">
        <div className="h-4 w-14 rounded-full text-[4px] flex items-center justify-center" style={{ backgroundColor: "#25d366", color: "#fff" }}>WhatsApp</div>
      </div>
    </div>
    <div className="px-2 py-1.5 space-y-1">
      {["🍽️ Entrées", "🥩 Plats du jour"].map((name, i) => (
        <div key={i} className="border rounded-lg overflow-hidden" style={{ borderColor: "#e5ddd5" }}>
          <div className="px-2 py-1.5 flex items-center justify-between">
            <div className="h-1.5 w-14 rounded-full opacity-50" style={{ backgroundColor: "#1a1008" }} />
            <div className="w-1.5 h-1.5 opacity-30 border-b border-r" style={{ borderColor: "#1a1008", transform: i === 0 ? "rotate(-135deg)" : "rotate(45deg)" }} />
          </div>
          {i === 0 && (
            <div className="border-t px-2 py-1.5 space-y-1" style={{ borderColor: "#e5ddd5" }}>
              {[1, 2].map(j => (
                <div key={j} className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md" style={{ backgroundColor: "#ede8e2" }} />
                  <div className="flex-1">
                    <div className="h-1 w-10 rounded-full opacity-40" style={{ backgroundColor: "#1a1008" }} />
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
);

const PREVIEWS = [CLASSIQUE_PREVIEW, CARDS_PREVIEW, MAGAZINE_PREVIEW];

export default function TemplatesPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-semibold">Templates</h1>
        <p className="text-sm text-muted-foreground mt-1">
          3 designs disponibles — sélectionnable par restaurant dans les Paramètres.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TEMPLATES.map((t, i) => (
          <div key={t.value} className="rounded-2xl border border-border overflow-hidden bg-card">
            {/* Preview */}
            <div className="aspect-[9/16] max-h-72 w-full overflow-hidden bg-muted/30 p-3">
              <div className="w-full h-full rounded-xl overflow-hidden border border-border/20 shadow-sm">
                {PREVIEWS[i]}
              </div>
            </div>

            {/* Info */}
            <div className="p-5 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold">{t.label}</h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full border border-border/30"
                    style={{ backgroundColor: t.bg }} />
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.accent }} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{t.description}</p>
              <ul className="space-y-1.5">
                {t.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check size={11} className="text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-xl border border-border bg-muted/30">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Note :</span> Le template s&apos;applique par restaurant depuis{" "}
          <span className="font-mono text-foreground">Restaurants → [nom] → Paramètres → Template</span>.
          La couleur accent est également personnalisable par restaurant.
        </p>
      </div>
    </div>
  );
}
