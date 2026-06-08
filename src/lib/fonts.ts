export interface FontOption {
  id: string;
  name: string;
  category: "Sans-serif" | "Serif" | "Display" | "Chaleureux";
  google: string;       // Google Fonts family name (exact)
  family: string;       // CSS font-family value
  weights: string;      // used in Google Fonts URL
}

export const FONTS: FontOption[] = [
  // ── Sans-serif modernes ───────────────────────────────────────────
  { id: "inter",              name: "Inter",              category: "Sans-serif", google: "Inter",              family: "'Inter', sans-serif",              weights: "400;500;600;700" },
  { id: "plus-jakarta-sans",  name: "Plus Jakarta Sans",  category: "Sans-serif", google: "Plus Jakarta Sans",  family: "'Plus Jakarta Sans', sans-serif",  weights: "400;500;600;700" },
  { id: "nunito",             name: "Nunito",             category: "Sans-serif", google: "Nunito",             family: "'Nunito', sans-serif",             weights: "400;500;600;700" },
  { id: "poppins",            name: "Poppins",            category: "Sans-serif", google: "Poppins",            family: "'Poppins', sans-serif",            weights: "400;500;600;700" },
  { id: "outfit",             name: "Outfit",             category: "Sans-serif", google: "Outfit",             family: "'Outfit', sans-serif",             weights: "400;500;600;700" },
  { id: "dm-sans",            name: "DM Sans",            category: "Sans-serif", google: "DM Sans",            family: "'DM Sans', sans-serif",            weights: "400;500;600;700" },
  { id: "urbanist",           name: "Urbanist",           category: "Sans-serif", google: "Urbanist",           family: "'Urbanist', sans-serif",           weights: "400;500;600;700" },
  { id: "manrope",            name: "Manrope",            category: "Sans-serif", google: "Manrope",            family: "'Manrope', sans-serif",            weights: "400;500;600;700" },
  { id: "figtree",            name: "Figtree",            category: "Sans-serif", google: "Figtree",            family: "'Figtree', sans-serif",            weights: "400;500;600;700" },

  // ── Serif élégants ────────────────────────────────────────────────
  { id: "playfair-display",   name: "Playfair Display",   category: "Serif",      google: "Playfair Display",   family: "'Playfair Display', serif",        weights: "400;500;600;700" },
  { id: "cormorant",          name: "Cormorant",          category: "Serif",      google: "Cormorant",          family: "'Cormorant', serif",               weights: "400;500;600;700" },
  { id: "lora",               name: "Lora",               category: "Serif",      google: "Lora",               family: "'Lora', serif",                    weights: "400;500;600;700" },
  { id: "eb-garamond",        name: "EB Garamond",        category: "Serif",      google: "EB Garamond",        family: "'EB Garamond', serif",             weights: "400;500;600;700" },
  { id: "libre-baskerville",  name: "Libre Baskerville",  category: "Serif",      google: "Libre Baskerville",  family: "'Libre Baskerville', serif",       weights: "400;700" },
  { id: "merriweather",       name: "Merriweather",       category: "Serif",      google: "Merriweather",       family: "'Merriweather', serif",            weights: "400;700" },

  // ── Display / Fort caractère ──────────────────────────────────────
  { id: "montserrat",         name: "Montserrat",         category: "Display",    google: "Montserrat",         family: "'Montserrat', sans-serif",         weights: "400;500;600;700;800" },
  { id: "raleway",            name: "Raleway",            category: "Display",    google: "Raleway",            family: "'Raleway', sans-serif",            weights: "400;500;600;700" },
  { id: "josefin-sans",       name: "Josefin Sans",       category: "Display",    google: "Josefin Sans",       family: "'Josefin Sans', sans-serif",       weights: "400;600;700" },
  { id: "oswald",             name: "Oswald",             category: "Display",    google: "Oswald",             family: "'Oswald', sans-serif",             weights: "400;500;600;700" },
  { id: "bebas-neue",         name: "Bebas Neue",         category: "Display",    google: "Bebas Neue",         family: "'Bebas Neue', cursive",            weights: "400" },
  { id: "work-sans",          name: "Work Sans",          category: "Display",    google: "Work Sans",          family: "'Work Sans', sans-serif",          weights: "400;500;600;700" },
  { id: "barlow",             name: "Barlow",             category: "Display",    google: "Barlow",             family: "'Barlow', sans-serif",             weights: "400;500;600;700" },
  { id: "exo-2",              name: "Exo 2",              category: "Display",    google: "Exo 2",              family: "'Exo 2', sans-serif",              weights: "400;500;600;700" },

  // ── Chaleureux / Expressif ────────────────────────────────────────
  { id: "quicksand",          name: "Quicksand",          category: "Chaleureux", google: "Quicksand",          family: "'Quicksand', sans-serif",          weights: "400;500;600;700" },
  { id: "pacifico",           name: "Pacifico",           category: "Chaleureux", google: "Pacifico",           family: "'Pacifico', cursive",              weights: "400" },
  { id: "dancing-script",     name: "Dancing Script",     category: "Chaleureux", google: "Dancing Script",     family: "'Dancing Script', cursive",        weights: "400;500;600;700" },
  { id: "caveat",             name: "Caveat",             category: "Chaleureux", google: "Caveat",             family: "'Caveat', cursive",                weights: "400;500;600;700" },
  { id: "kalam",              name: "Kalam",              category: "Chaleureux", google: "Kalam",              family: "'Kalam', cursive",                 weights: "400;700" },
];

export const DEFAULT_FONT = FONTS[0]; // Inter

export function getFont(id: string | null | undefined): FontOption {
  return FONTS.find(f => f.id === id) ?? DEFAULT_FONT;
}

export function getGoogleFontsUrl(fontId: string | null | undefined): string {
  const font = getFont(fontId);
  const encoded = font.google.replace(/ /g, "+");
  return `https://fonts.googleapis.com/css2?family=${encoded}:wght@${font.weights}&display=swap`;
}

export function getAllFontsPreviewUrl(): string {
  const families = FONTS.map(f => `family=${f.google.replace(/ /g, "+")}:wght@400;700`).join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

export const FONT_CATEGORIES = ["Sans-serif", "Serif", "Display", "Chaleureux"] as const;
