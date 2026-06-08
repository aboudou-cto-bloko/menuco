import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const { hashPassword } = await import("better-auth/crypto");

  const adminEmail = process.env.ADMIN_EMAIL ?? "franckzinsou24@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin_change_me_2024!";

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

  let userId: string;

  if (existing) {
    console.log(`User exists: ${adminEmail} — mise à jour du mot de passe`);
    userId = existing.id;
    // Update password in Account
    await prisma.account.deleteMany({ where: { userId, providerId: "credential" } });
  } else {
    const user = await prisma.user.create({
      data: { email: adminEmail, name: "François Zinsou", role: "ADMIN", emailVerified: true },
    });
    userId = user.id;
  }

  // Create Better Auth credential account
  const passwordHash = await hashPassword(adminPassword);
  await prisma.account.create({
    data: {
      accountId: userId,
      providerId: "credential",
      userId,
      password: passwordHash,
    },
  });

  console.log(`✓ Admin prêt: ${adminEmail}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
