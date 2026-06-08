"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function updateOwnerAppearance(data: {
  themePalette?: string;
  logo?: string | null;
  cover?: string | null;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Non autorisé");

  const restaurant = await prisma.restaurant.findUnique({ where: { ownerId: session.user.id } });
  if (!restaurant) throw new Error("Restaurant introuvable");

  await prisma.restaurant.update({
    where: { id: restaurant.id },
    data: {
      ...(data.themePalette !== undefined && { themePalette: data.themePalette }),
      ...(data.logo !== undefined && { logo: data.logo }),
      ...(data.cover !== undefined && { cover: data.cover }),
    },
  });

  revalidatePath("/owner/dashboard");
  revalidatePath(`/m/${restaurant.slug}`);
}
