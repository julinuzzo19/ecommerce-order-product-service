// tests/setup/testDatabase.ts
import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

export let prismaTestClient: PrismaClient;
let isInitialized = false;

export async function initializeTestDatabase(): Promise<void> {
  if (isInitialized) {
    // Si ya está inicializada, solo limpiar datos
    await cleanTestDatabase();
    return;
  }

  const testDatabaseUrl = process.env.DATABASE_URL_TEST as string;

  console.log("🚀 Initializing test database...");

  try {
    // 1. Verificar si la base de datos ya existe y está lista
    const dbReady = await verifyDatabaseConnection(testDatabaseUrl);

    if (!dbReady) {
      // Solo crear si no existe
      await createTestDatabaseIfNotExists();
      await pushSchema(testDatabaseUrl);
    } else {
      console.log("📦 Database already exists and is ready");
    }

    // 2. Crear cliente Prisma si no existe
    if (!prismaTestClient) {
      prismaTestClient = new PrismaClient({
        datasources: {
          db: { url: testDatabaseUrl },
        },
        log: [],
      });

      await prismaTestClient.$connect();
    }

    isInitialized = true;
    console.log("✅ Test database ready");
  } catch (error) {
    console.error("❌ Test database initialization failed:", error);
    throw error;
  }
}

async function verifyDatabaseConnection(databaseUrl: string): Promise<boolean> {
  try {
    const tempClient = new PrismaClient({
      datasources: { db: { url: databaseUrl } },
    });

    await tempClient.$connect();

    // Verificar si las tablas existen
    const tables = await tempClient.$queryRaw`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `;

    await tempClient.$disconnect();

    // Si hay tablas, la base está lista
    return Array.isArray(tables) && tables.length > 0;
  } catch (error) {
    return false;
  }
}

async function createTestDatabaseIfNotExists(): Promise<void> {
  try {
    console.log("🏗️ Setting up database structure...");
    // La base de datos ya fue creada/limpiada por el script Docker
    // Solo necesitamos aplicar el esquema
  } catch (error) {
    console.warn("⚠️ Database setup warning:", (error as Error).message);
  }
}

async function pushSchema(databaseUrl: string): Promise<void> {
  try {
    console.log("📦 Applying database schema...");

    execSync(
      `npx prisma db push --schema=./src/shared/infrastructure/db/prisma/schema.prisma`,
      {
        env: {
          ...process.env,
          DATABASE_URL: databaseUrl,
        },
        stdio: "pipe",
      }
    );

    console.log("✅ Schema applied successfully");
  } catch (error) {
    throw new Error(`Schema application failed: ${error}`);
  }
}

export async function cleanTestDatabase(): Promise<void> {
  if (!prismaTestClient) return;

  try {
    // Limpiar solo datos, mantener estructura
    await prismaTestClient.$transaction([
      prismaTestClient.orderItem.deleteMany(),
      prismaTestClient.order.deleteMany(),
      prismaTestClient.customer.deleteMany(),
      prismaTestClient.product.deleteMany(),
    ]);
  } catch (error) {
    console.warn("⚠️ Error cleaning database:", error);
  }
}

export async function closeTestDatabase(): Promise<void> {
  if (prismaTestClient) {
    await prismaTestClient.$disconnect();
    prismaTestClient = null as any;
    isInitialized = false;
  }
}
