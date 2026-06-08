"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ─── Category actions ──────────────────────────────────────────────────────────

export async function createCategory(menuId: string, name: string, emoji?: string) {
  const count = await prisma.category.count({ where: { menuId } });
  const cat = await prisma.category.create({
    data: { menuId, name, emoji, order: count },
    include: { items: { include: { variants: true, modifierGroups: { include: { options: true } } } } },
  });
  revalidatePath("/restaurants", "layout");
  return cat;
}

export async function updateCategory(id: string, data: { name?: string; emoji?: string; visible?: boolean }) {
  const cat = await prisma.category.update({
    where: { id }, data,
    include: { items: { include: { variants: true, modifierGroups: { include: { options: true } } } } },
  });
  revalidatePath("/restaurants", "layout");
  return cat;
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/restaurants", "layout");
}

export async function reorderCategories(menuId: string, orderedIds: string[]) {
  await Promise.all(orderedIds.map((id, order) => prisma.category.update({ where: { id }, data: { order } })));
  revalidatePath("/restaurants", "layout");
}

// ─── MenuItem actions ──────────────────────────────────────────────────────────

const DietaryTagEnum = z.enum(["VEGETARIAN", "VEGAN", "HALAL", "GLUTEN_FREE", "DAIRY_FREE", "SPICY"]);
const AllergenEnum = z.enum(["GLUTEN", "CRUSTACEANS", "EGGS", "FISH", "PEANUTS", "SOY", "MILK", "NUTS", "SESAME"]);

const ItemSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().int().min(0),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
  available: z.coerce.boolean().optional().default(true),
  featured: z.coerce.boolean().optional().default(false),
  isNew: z.coerce.boolean().optional().default(false),
  spiceLevel: z.enum(["NONE", "MILD", "MEDIUM", "HOT"]).optional().default("NONE"),
  dietaryTags: z.array(DietaryTagEnum).optional().default([]),
  allergens: z.array(AllergenEnum).optional().default([]),
  preparationTime: z.coerce.number().int().optional(),
  calories: z.coerce.number().int().optional(),
});

const INCLUDE = { include: { variants: true, modifierGroups: { include: { options: true } } } } as const;

export async function createItem(categoryId: string, data: z.infer<typeof ItemSchema>) {
  const validated = ItemSchema.parse(data);
  const count = await prisma.menuItem.count({ where: { categoryId } });
  const item = await prisma.menuItem.create({
    data: { ...validated, categoryId, order: count },
    ...INCLUDE,
  });
  revalidatePath("/restaurants", "layout");
  return item;
}

export async function updateItem(id: string, data: Partial<z.infer<typeof ItemSchema>>) {
  const item = await prisma.menuItem.update({
    where: { id }, data,
    ...INCLUDE,
  });
  revalidatePath("/restaurants", "layout");
  return item;
}

export async function deleteItem(id: string) {
  await prisma.menuItem.delete({ where: { id } });
  revalidatePath("/restaurants", "layout");
}

export async function reorderItems(categoryId: string, orderedIds: string[]) {
  await Promise.all(orderedIds.map((id, order) => prisma.menuItem.update({ where: { id }, data: { order } })));
  revalidatePath("/restaurants", "layout");
}

export async function toggleItemAvailability(id: string, available: boolean) {
  await prisma.menuItem.update({ where: { id }, data: { available } });
  revalidatePath("/restaurants", "layout");
}

// ─── Variant actions ───────────────────────────────────────────────────────────

export async function upsertVariants(itemId: string, variants: { id?: string; name: string; price: number }[]) {
  const existing = await prisma.itemVariant.findMany({ where: { itemId } });
  const existingIds = new Set(existing.map(v => v.id));
  const incomingIds = new Set(variants.filter(v => v.id).map(v => v.id!));

  // Delete removed
  const toDelete = [...existingIds].filter(id => !incomingIds.has(id));
  if (toDelete.length) await prisma.itemVariant.deleteMany({ where: { id: { in: toDelete } } });

  // Upsert each
  for (let i = 0; i < variants.length; i++) {
    const { id, name, price } = variants[i];
    if (id) {
      await prisma.itemVariant.update({ where: { id }, data: { name, price, order: i } });
    } else {
      await prisma.itemVariant.create({ data: { itemId, name, price, order: i } });
    }
  }
  revalidatePath("/restaurants", "layout");
}

// ─── Owner price update ────────────────────────────────────────────────────────

export async function updateItemPrice(id: string, price: number) {
  await prisma.menuItem.update({ where: { id }, data: { price } });
  revalidatePath("/restaurants", "layout");
}
