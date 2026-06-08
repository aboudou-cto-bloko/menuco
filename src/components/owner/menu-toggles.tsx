"use client";

import { useState, useTransition, useRef } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toggleItemAvailability, updateItemPrice } from "@/app/actions/menu";
import { cn } from "@/lib/utils";
import type { Category, MenuItem } from "@/generated/prisma/client";

type Cat = Category & { items: MenuItem[] };

export function OwnerMenuToggles({ categories }: { categories: Cat[] }) {
  const [cats, setCats] = useState(categories);
  const [pending, startTransition] = useTransition();
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function toggle(itemId: string, catId: string, current: boolean) {
    startTransition(async () => {
      await toggleItemAvailability(itemId, !current);
      setCats(prev => prev.map(c =>
        c.id !== catId ? c : {
          ...c, items: c.items.map(i => i.id === itemId ? { ...i, available: !current } : i),
        }
      ));
    });
  }

  function startEditPrice(item: MenuItem) {
    setEditingPriceId(item.id);
    setPriceInput(String(item.price));
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function cancelEdit() {
    setEditingPriceId(null);
    setPriceInput("");
  }

  async function savePrice(itemId: string, catId: string) {
    const newPrice = parseInt(priceInput, 10);
    if (isNaN(newPrice) || newPrice < 0) { cancelEdit(); return; }
    setSavingId(itemId);
    setEditingPriceId(null);
    await updateItemPrice(itemId, newPrice);
    setCats(prev => prev.map(c =>
      c.id !== catId ? c : {
        ...c, items: c.items.map(i => i.id === itemId ? { ...i, price: newPrice } : i),
      }
    ));
    setSavingId(null);
  }

  return (
    <div className="divide-y divide-border">
      {cats.map((cat) => (
        <div key={cat.id}>
          <div className="px-4 py-2.5 bg-muted/30">
            <p className="text-xs font-medium text-muted-foreground">
              {cat.emoji && <span className="mr-1.5">{cat.emoji}</span>}{cat.name}
            </p>
          </div>
          {cat.items.map(item => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm truncate", !item.available && "line-through opacity-40")}>
                  {item.name}
                </p>

                {/* Price — inline edit */}
                {editingPriceId === item.id ? (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Input
                      ref={inputRef}
                      type="number"
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") savePrice(item.id, cat.id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      className="h-6 w-24 text-xs px-2 font-mono"
                    />
                    <span className="text-[10px] text-muted-foreground">XOF</span>
                    <button onClick={() => savePrice(item.id, cat.id)}
                      className="w-5 h-5 rounded flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                      <Check size={10} />
                    </button>
                    <button onClick={cancelEdit}
                      className="w-5 h-5 rounded flex items-center justify-center bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
                      <X size={10} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditPrice(item)}
                    className="group flex items-center gap-1 mt-0.5 text-left"
                    title="Modifier le prix">
                    {savingId === item.id ? (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Loader2 size={10} className="animate-spin" />
                        Enregistrement…
                      </span>
                    ) : (
                      <>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {item.price.toLocaleString()} XOF
                        </span>
                        <Pencil size={9} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                      </>
                    )}
                  </button>
                )}
              </div>

              <Switch
                checked={item.available}
                onCheckedChange={() => toggle(item.id, cat.id, item.available)}
                disabled={pending || savingId === item.id}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
