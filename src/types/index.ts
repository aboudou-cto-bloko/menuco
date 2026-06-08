export type {
  User,
  Restaurant,
  Menu,
  Category,
  MenuItem,
  ItemVariant,
  ModifierGroup,
  ModifierOption,
  Role,
  Template,
  MenuStatus,
  SpiceLevel,
  DietaryTag,
  Allergen,
} from "@/generated/prisma/client";

// ─── Extended types for UI ────────────────────────────────────────────────────

export type MenuItemWithRelations = import("@/generated/prisma/client").MenuItem & {
  variants: import("@/generated/prisma/client").ItemVariant[];
  modifierGroups: (import("@/generated/prisma/client").ModifierGroup & {
    options: import("@/generated/prisma/client").ModifierOption[];
  })[];
};

export type CategoryWithItems = import("@/generated/prisma/client").Category & {
  items: MenuItemWithRelations[];
};

export type MenuWithCategories = import("@/generated/prisma/client").Menu & {
  categories: CategoryWithItems[];
};

export type RestaurantWithMenu = import("@/generated/prisma/client").Restaurant & {
  menus: MenuWithCategories[];
};

// ─── Hours JSON type ──────────────────────────────────────────────────────────

export type DayHours = { open: string; close: string; closed: boolean };
export type WeekHours = {
  lun?: DayHours;
  mar?: DayHours;
  mer?: DayHours;
  jeu?: DayHours;
  ven?: DayHours;
  sam?: DayHours;
  dim?: DayHours;
};
