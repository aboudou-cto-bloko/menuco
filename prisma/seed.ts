import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const { hashPassword } = await import("better-auth/crypto");

  const adminEmail = process.env.ADMIN_EMAIL ?? "franckzinsou24@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin_change_me_2024!";

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log(`Admin already exists: ${adminEmail}`);
    return;
  }

  const passwordHash = await hashPassword(adminPassword);
  await prisma.user.create({
    data: { email: adminEmail, passwordHash, role: "ADMIN" },
  });

  console.log(`✓ Admin created: ${adminEmail}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
