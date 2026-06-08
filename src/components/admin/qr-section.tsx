"use client";

import { useState, useEffect, useRef } from "react";
import { Download, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Restaurant } from "@/generated/prisma/client";

interface Props {
  restaurant: Restaurant;
}

const PRESET_FG = ["#f97316", "#10b981", "#3b82f6", "#e11d48", "#a855f7", "#000000"];
const PRESET_BG = ["#ffffff", "#0f0705", "#000000", "#fef3c7"];

export function QrSection({ restaurant }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fgColor, setFgColor] = useState(restaurant.accentColor ?? "#f97316");
  const [bgColor, setBgColor] = useState("#0f0705");

  const menuUrl = restaurant.customDomain
    ? `https://${restaurant.customDomain}`
    : `https://${restaurant.slug}.menuco.bj`;

  useEffect(() => {
    if (!canvasRef.current) return;
    let cancelled = false;
    import("qrcode").then((QRCode) => {
      if (!cancelled && canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, menuUrl, {
          width: 280, margin: 2,
          color: { dark: fgColor, light: bgColor },
        });
      }
    });
    return () => { cancelled = true; };
  }, [menuUrl, fgColor, bgColor]);

  function downloadPng() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `qr-${restaurant.slug}.png`;
    a.click();
  }

  function copyLink() {
    navigator.clipboard.writeText(menuUrl);
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* QR preview */}
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 rounded-xl border border-border bg-card inline-block">
            <canvas ref={canvasRef} className="rounded-lg" />
          </div>
          <p className="text-xs text-muted-foreground font-mono">{menuUrl}</p>
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-5">
          <div className="space-y-2">
            <Label className="text-xs">Couleur du QR</Label>
            <div className="flex items-center gap-2">
              <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-border bg-transparent p-0.5" />
              <div className="flex gap-1.5 flex-wrap">
                {PRESET_FG.map(c => (
                  <button key={c} type="button" onClick={() => setFgColor(c)}
                    className="w-6 h-6 rounded border-2 transition-all"
                    style={{ backgroundColor: c, borderColor: fgColor === c ? "white" : "transparent" }} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Couleur de fond</Label>
            <div className="flex items-center gap-2">
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-border bg-transparent p-0.5" />
              {PRESET_BG.map(c => (
                <button key={c} type="button" onClick={() => setBgColor(c)}
                  className="w-6 h-6 rounded border-2 transition-all"
                  style={{ backgroundColor: c, borderColor: bgColor === c ? "white" : "transparent" }} />
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Button className="w-full gap-2" onClick={downloadPng}>
              <Download size={14} />Télécharger PNG
            </Button>
            <Button variant="outline" className="w-full gap-2" onClick={copyLink}>
              <Link2 size={14} />Copier le lien
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground font-medium">Partager avec le propriétaire</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Envoyez le PNG au restaurant. Le QR redirige vers{" "}
            <span className="font-mono text-primary">{menuUrl}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
