"use client";

import { useEffect, useRef } from "react";
import { Download, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Restaurant } from "@/generated/prisma/client";

export function OwnerQrDownload({ restaurant, publicUrl }: { restaurant: Restaurant; publicUrl: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const accent = restaurant.accentColor ?? "#f97316";

  useEffect(() => {
    if (!canvasRef.current) return;
    let cancelled = false;
    import("qrcode").then((QRCode) => {
      if (!cancelled && canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, publicUrl, {
          width: 180, margin: 2,
          color: { dark: accent, light: "#0f0705" },
        });
      }
    });
    return () => { cancelled = true; };
  }, [publicUrl, accent]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `qr-${restaurant.slug}.png`;
    a.click();
  }

  function copyLink() {
    navigator.clipboard.writeText(publicUrl);
  }

  return (
    <div className="flex items-center gap-5">
      <div className="p-2.5 rounded-xl border border-border bg-card shrink-0">
        <canvas ref={canvasRef} className="rounded-md" />
      </div>
      <div className="space-y-2 flex-1">
        <p className="text-xs text-muted-foreground font-mono break-all">{publicUrl}</p>
        <Button size="sm" className="w-full gap-2 text-xs" onClick={download}>
          <Download size={12} />Télécharger PNG
        </Button>
        <Button size="sm" variant="outline" className="w-full gap-2 text-xs" onClick={copyLink}>
          <Link2 size={12} />Copier le lien
        </Button>
      </div>
    </div>
  );
}
