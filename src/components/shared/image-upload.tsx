"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing-client";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  endpoint: "restaurantLogo" | "restaurantCover" | "itemPhoto";
  value?: string;
  onChange: (url: string | undefined) => void;
  label?: string;
  hint?: string;
  aspect?: "square" | "wide";
}

export function ImageUpload({ endpoint, value, onChange, label, hint, aspect = "wide" }: Props) {
  const [dragging, setDragging] = useState(false);

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      if (res[0]) onChange(res[0].ufsUrl);
    },
  });

  async function handleFile(file: File) {
    await startUpload([file]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleFile(file);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  if (value) {
    return (
      <div className={cn("relative rounded-lg overflow-hidden border border-border", aspect === "square" ? "w-20 h-20" : "h-28")}>
        <img src={value} alt="" className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors">
          <X size={10} className="text-white" />
        </button>
      </div>
    );
  }

  return (
    <label
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border cursor-pointer transition-colors",
        aspect === "square" ? "w-20 h-20" : "h-28 w-full",
        dragging ? "border-primary bg-primary/5" : "hover:border-muted-foreground/40 hover:bg-muted/30",
        isUploading && "pointer-events-none opacity-60"
      )}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}>
      <input type="file" className="hidden" accept="image/*" onChange={handleInput} disabled={isUploading} />
      {isUploading ? (
        <Loader2 size={18} className="animate-spin text-muted-foreground" />
      ) : (
        <>
          <ImagePlus size={18} className="text-muted-foreground/50" />
          {label && <p className="text-xs text-muted-foreground text-center px-2">{label}</p>}
          {hint && <p className="text-[10px] text-muted-foreground/50">{hint}</p>}
        </>
      )}
    </label>
  );
}
