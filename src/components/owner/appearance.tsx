"use client";

import { useState, useTransition } from "react";
import { Loader2, Check, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PalettePicker } from "@/components/ui/palette-picker";
import { useUploadThing } from "@/lib/uploadthing-client";
import { updateOwnerAppearance } from "@/app/actions/owner";

function ImageInput({
  label, current, endpoint, onUploaded, onRemove, aspect,
}: {
  label: string;
  current: string | null;
  endpoint: "restaurantLogo" | "restaurantCover";
  onUploaded: (url: string) => void;
  onRemove: () => void;
  aspect: string;
}) {
  const [uploading, setUploading] = useState(false);
  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => { onUploaded(res[0].url); setUploading(false); },
    onUploadError: () => setUploading(false),
  });

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {current ? (
        <div className={`relative group w-full rounded-xl overflow-hidden ${aspect}`}>
          <img src={current} alt="" className="w-full h-full object-cover" />
          <button onClick={onRemove}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <X size={11} />
          </button>
        </div>
      ) : (
        <label className={`relative flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-primary/50 transition-colors bg-muted/20 ${aspect}`}>
          <input type="file" accept="image/*" className="sr-only"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploading(true);
              await startUpload([file]);
            }} />
          {uploading
            ? <Loader2 size={16} className="animate-spin text-muted-foreground" />
            : <><Upload size={14} className="text-muted-foreground mb-0.5" /><span className="text-[10px] text-muted-foreground">Uploader</span></>}
        </label>
      )}
    </div>
  );
}

interface Props {
  initialPalette: string;
  initialLogo: string | null;
  initialCover: string | null;
}

export function OwnerAppearance({ initialPalette, initialLogo, initialCover }: Props) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const [palette, setPalette] = useState(initialPalette);
  const [logo, setLogo] = useState<string | null>(initialLogo);
  const [cover, setCover] = useState<string | null>(initialCover);

  function save() {
    startTransition(async () => {
      await updateOwnerAppearance({ themePalette: palette, logo, cover });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="space-y-4 p-4">
      <ImageInput label="Logo / Photo de profil" current={logo} endpoint="restaurantLogo"
        onUploaded={setLogo} onRemove={() => setLogo(null)} aspect="h-16 w-16 !rounded-full" />
      <ImageInput label="Photo de bannière" current={cover} endpoint="restaurantCover"
        onUploaded={setCover} onRemove={() => setCover(null)} aspect="aspect-[3/1]" />
      <div className="space-y-2">
        <Label className="text-xs">Palette de couleurs</Label>
        <PalettePicker value={palette} onChange={setPalette} />
      </div>
      <Button size="sm" onClick={save} disabled={isPending} className="gap-2 w-full">
        {isPending ? <Loader2 size={13} className="animate-spin" /> : saved ? <Check size={13} /> : null}
        {saved ? "Enregistré !" : "Appliquer"}
      </Button>
    </div>
  );
}
