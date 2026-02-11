import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as path from 'path';
import { execSync } from 'child_process';

function getSchemaFromUrl(databaseUrl: string): string {
  if (!databaseUrl) return 'public';
  const m = databaseUrl.match(/[?&]schema=([^&]+)/);
  return m ? decodeURIComponent(m[1]) : 'public';
}

function applyMigrations(databaseUrl: string) {
  if (!databaseUrl) {
    throw new Error('DATABASE URL requerido para aplicar migraciones');
  }

  const schemaPath = path.resolve(
    'src/shared/infrastructure/db/prisma/schema.prisma',
  );

  console.log('🔧 Aplicando migraciones Prisma al schema de test...');

  try {
    execSync(`npx prisma migrate deploy --schema=${schemaPath}`, {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: databaseUrl },
    });
  } catch (err) {
    console.log('⚠️ migrate deploy falló, intentando db push como fallback');
    execSync(`npx prisma db push --schema=${schemaPath}`, {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: databaseUrl },
    });
  }
}

export let prismaTestClient: PrismaClient;
let isInitialized = false;

function createPrismaClient(databaseUrl: string): PrismaClient {
  const adapter = new PrismaPg(
    { connectionString: databaseUrl },
    { schema: getSchemaFromUrl(databaseUrl) },
  );
  return new PrismaClient({ adapter, log: [] });
}

async function waitForDatabase(
  databaseUrl: string,
  retries = 30,
  interval = 500,
): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = createPrismaClient(databaseUrl);
      await client.$connect();
      await client.$disconnect();
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
    await cleanTestDatabase();
    return;
  }

  const testDatabaseUrl = process.env.DATABASE_URL_TEST as string;

  console.log('🚀 Initializing test database...');

  try {
    await waitForDatabase(testDatabaseUrl);

    try {
      applyMigrations(testDatabaseUrl);
    } catch (err) {
      console.warn('⚠️ Error aplicando migraciones:', err);
    }

    const dbReady = await verifyDatabaseConnection(testDatabaseUrl);
    if (!dbReady) {
      throw new Error(
        'Database is reachable but schema not found. ' +
          'Run "npm run test:e2e:prepare" before running tests.',
      );
    }

    if (!prismaTestClient) {
      prismaTestClient = createPrismaClient(testDatabaseUrl);
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
    const client = createPrismaClient(databaseUrl);
    await client.$connect();

    const schema = getSchemaFromUrl(databaseUrl);
    const tables = await client.$queryRaw`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = ${schema} AND table_type = 'BASE TABLE'
    `;

    await client.$disconnect();
    return Array.isArray(tables) && tables.length > 0;
  } catch (error) {
    return false;
  }
}

export async function cleanTestDatabase(): Promise<void> {
  if (!prismaTestClient) return;

  try {
    await prismaTestClient.$transaction([
      prismaTestClient.orderItem.deleteMany(),
      prismaTestClient.order.deleteMany(),
      prismaTestClient.customer.deleteMany(),
      prismaTestClient.address.deleteMany(),
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
