import { PrismaClient } from '@prisma/client';

export let prismaTestClient: PrismaClient;
let isInitialized = false;

/**
 * Espera a que la base de datos esté accesible.
 * Asume que el esquema ya fue aplicado por el script de preparación.
 */
async function waitForDatabase(
  databaseUrl: string,
  retries = 30,
  interval = 500,
): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const temp = new PrismaClient({
        datasources: { db: { url: databaseUrl } },
      });
      await temp.$connect();
      await temp.$disconnect();
      return;
    } catch (error) {
      if (attempt === retries) {
        throw new Error(
          `Database not reachable after ${retries} attempts. ` +
            'Make sure to run the prepare-test-db script before tests.',
        );
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }
}

export async function initializeTestDatabase(): Promise<void> {
  if (isInitialized) {
    // Si ya está inicializada, solo limpiar datos
    await cleanTestDatabase();
    return;
  }

  const testDatabaseUrl = process.env.DATABASE_URL_TEST as string;

  console.log('🚀 Initializing test database...');

  try {
    // 1. Esperar a que la base de datos esté accesible
    await waitForDatabase(testDatabaseUrl);

    // 2. Verificar que las tablas existan (el esquema debe haber sido aplicado previamente)
    const dbReady = await verifyDatabaseConnection(testDatabaseUrl);
    if (!dbReady) {
      throw new Error(
        'Database is reachable but schema not found. ' +
          'Run "npm run test:e2e:prepare" before running tests.',
      );
    }

    // 3. Crear cliente Prisma si no existe
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
    console.log('✅ Test database ready');
  } catch (error) {
    console.error('❌ Test database initialization failed:', error);
    throw error;
  }
}

async function verifyDatabaseConnection(databaseUrl: string): Promise<boolean> {
  try {
    const tempClient = new PrismaClient({
      datasources: { db: { url: databaseUrl } },
    });

    console.log({ databaseUrl });
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
    console.warn('⚠️ Error cleaning database:', error);
  }
}

export async function closeTestDatabase(): Promise<void> {
  if (prismaTestClient) {
    await prismaTestClient.$disconnect();
    prismaTestClient = null as any;
    isInitialized = false;
  }
}
