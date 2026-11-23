import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Read the PostgreSQL connection URL from the .env file.
const connectionString = process.env.DATABASE_URL!;

// Create the PostgreSQL adapter.
const adapter = new PrismaPg({
  connectionString,
});

// Prevent multiple Prisma instances during Next.js development.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Reuse the existing Prisma instance if available.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

// Store the instance globally during development.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
