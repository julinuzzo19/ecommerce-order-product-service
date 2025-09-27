import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

beforeAll(async () => {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL_TEST || "file:./test.db",
      },
    },
  });
  await prisma.$connect();
});

afterAll(async () => {
  await prisma?.$disconnect();
});

beforeEach(async () => {
  // Limpieza antes de cada test (opcional)
  // await prisma.$executeRaw`DELETE FROM Customer`;
});

export { prisma };
