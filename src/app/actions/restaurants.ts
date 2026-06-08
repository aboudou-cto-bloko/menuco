"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const HoursSchema = z.record(
  z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]),
  z.object({
    open: z.boolean(),
    from: z.string().optional(),
    to: z.string().optional(),
  })
).optional();

const CreateRestaurantSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  city: z.string().default("Cotonou"),
  address: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  googlePlaceId: z.string().optional(),
  logo: z.string().url().optional(),
  cover: z.string().url().optional(),
  template: z.enum(["CLASSIQUE", "CARDS", "MAGAZINE"]).default("CLASSIQUE"),
  accentColor: z.string().default("#f97316"),
  ownerEmail: z.string().email(),
  ownerPassword: z.string().min(8),
  sendEmail: z.coerce.boolean().optional().default(false),
  hours: z.string().optional(),
});

type State = { success: boolean; error?: string; restaurantId?: string };

export async function createRestaurant(_: State, formData: FormData): Promise<State> {
  const raw = Object.fromEntries(formData);
  const parsed = CreateRestaurantSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { ownerEmail, ownerPassword, sendEmail, hours: hoursStr, ...rest } = parsed.data;
  const hours = hoursStr ? (() => { try { return JSON.parse(hoursStr); } catch { return null; } })() : null;

  const existing = await prisma.restaurant.findUnique({ where: { slug: rest.slug } });
  if (existing) return { success: false, error: "Ce slug est déjà utilisé" };

  const existingUser = await prisma.user.findUnique({ where: { email: ownerEmail } });
  if (existingUser) return { success: false, error: "Cet email est déjà associé à un compte" };

  const { hashPassword } = await import("better-auth/crypto");
  const passwordHash = await hashPassword(ownerPassword);

  const owner = await prisma.user.create({
    data: { email: ownerEmail, name: rest.name, emailVerified: false, role: "OWNER" },
  });

  await prisma.account.create({
    data: { accountId: owner.id, providerId: "credential", userId: owner.id, password: passwordHash },
  });

  const restaurant = await prisma.restaurant.create({
    data: {
      ...rest,
      hours,
      ownerId: owner.id,
      menus: { create: { name: "Menu principal", status: "ACTIVE", order: 0 } },
    },
  });

  if (sendEmail) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "menuco.bj";
    const { sendOwnerCredentials } = await import("./email");
    await sendOwnerCredentials({
      restaurantName: rest.name,
      ownerEmail,
      password: ownerPassword,
      menuUrl: `https://${rest.slug}.${rootDomain}`,
      dashboardUrl: `${appUrl}/owner/dashboard`,
    }).catch(console.error);
  }

  revalidatePath("/dashboard");
  return { success: true, restaurantId: restaurant.id };
}

const UpdateRestaurantSchema = z.object({
  id: z.string(),
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  googlePlaceId: z.string().optional(),
  customDomain: z.string().optional().nullable(),
  logo: z.string().url().optional().nullable(),
  cover: z.string().url().optional().nullable(),
  template: z.enum(["CLASSIQUE", "CARDS", "MAGAZINE"]).optional(),
  accentColor: z.string().optional(),
  fontChoice: z.string().optional(),
  active: z.coerce.boolean().optional(),
  hours: z.unknown().optional(),
});

export async function updateRestaurant(data: z.infer<typeof UpdateRestaurantSchema>) {
  const { id, ...rest } = UpdateRestaurantSchema.parse(data);
  await prisma.restaurant.update({ where: { id }, data: rest as Parameters<typeof prisma.restaurant.update>[0]["data"] });
  revalidatePath("/dashboard");
  revalidatePath(`/restaurants/${id}`);
}
