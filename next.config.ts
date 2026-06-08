import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "better-auth",
    "@better-auth/core",
    "@better-auth/kysely-adapter",
    "kysely",
    "@prisma/adapter-pg",
  ],
};

export default nextConfig;
