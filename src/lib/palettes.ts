export interface Palette {
  id: string;
  name: string;
  dark: boolean;
  accent: string;
  accentFg: string;
  bg: string;
  surface: string;
  border: string;
  text: string;
  muted: string;
}

export const PALETTES: Palette[] = [
  {
    id: "braise", name: "Braise", dark: true,
    accent: "#e85d04", accentFg: "#ffffff",
    bg: "#0f0705", surface: "#1a0d08", border: "#3d2418",
    text: "#f6ded3", muted: "#a37060",
  },
  {
    id: "nuit-doree", name: "Nuit dorée", dark: true,
    accent: "#d4a017", accentFg: "#0a0a0a",
    bg: "#0a0a0a", surface: "#161616", border: "#2a2a2a",
    text: "#f0e8d0", muted: "#8a7a5a",
  },
  {
    id: "nuit-violette", name: "Nuit violette", dark: true,
    accent: "#8b5cf6", accentFg: "#ffffff",
    bg: "#0d0a1e", surface: "#16122b", border: "#2d2456",
    text: "#ede9fe", muted: "#7c6fcd",
  },
  {
    id: "terracotta", name: "Terracotta", dark: false,
    accent: "#c2410c", accentFg: "#ffffff",
    bg: "#fef3ec", surface: "#ffffff", border: "#fed7aa",
    text: "#431407", muted: "#9a3412",
  },
  {
    id: "tropical", name: "Tropical", dark: false,
    accent: "#16a34a", accentFg: "#ffffff",
    bg: "#f0fdf4", surface: "#ffffff", border: "#bbf7d0",
    text: "#14532d", muted: "#4a7c59",
  },
  {
    id: "bordeaux", name: "Bordeaux", dark: false,
    accent: "#9f1239", accentFg: "#ffffff",
    bg: "#fff1f2", surface: "#ffffff", border: "#fecdd3",
    text: "#4c0519", muted: "#881337",
  },
  {
    id: "ocean", name: "Océan", dark: false,
    accent: "#0284c7", accentFg: "#ffffff",
    bg: "#f0f9ff", surface: "#ffffff", border: "#bae6fd",
    text: "#0c4a6e", muted: "#64748b",
  },
  {
    id: "ardoise", name: "Ardoise", dark: false,
    accent: "#0f766e", accentFg: "#ffffff",
    bg: "#f8fafc", surface: "#ffffff", border: "#e2e8f0",
    text: "#0f172a", muted: "#64748b",
  },
];

export const DEFAULT_PALETTE = PALETTES[0];

export function getPalette(key: string | null | undefined): Palette {
  return PALETTES.find(p => p.id === key) ?? DEFAULT_PALETTE;
}

export function bgAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
