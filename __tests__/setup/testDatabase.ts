import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Cargar variables de entorno desde .env si existe
function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    return;
  }

  const content = fs.readFileSync(envPath, 'utf-8');
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    // Remover comillas si existen
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Solo establecer si no existe ya en process.env
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

// Cargar variables de entorno al inicio
loadEnvFile();

/**
 * Extrae el schema de la DATABASE URL (query param `schema=`) o devuelve 'public'.
 */
function getSchemaFromUrl(databaseUrl: string): string {
  if (!databaseUrl) return 'public';
  const m = databaseUrl.match(/[?&]schema=([^&]+)/);
  return m ? decodeURIComponent(m[1]) : 'public';
}

/**
 * Aplica migraciones con Prisma al `databaseUrl` proporcionado. Intenta
 * `migrate deploy` y si falla hace `db push` como fallback.
 */
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
let prismaTestPool: Pool | null = null;

/**
 * Crea un PrismaClient para PostgreSQL usando Driver Adapter (Prisma v7).
 */
function createPrismaClient(databaseUrl: string): {
  client: PrismaClient;
  pool: Pool;
} {
  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({ adapter, log: [] });

  return { client, pool };
}

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
      const { client, pool } = createPrismaClient(databaseUrl);
      await client.$connect();
      await client.$disconnect();
      await pool.end();
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

    // 1.5 Aplicar migraciones / db push para tener las tablas en el schema de test
    try {
      applyMigrations(testDatabaseUrl);
    } catch (err) {
      console.warn('⚠️ Error aplicando migraciones:', err);
    }

    // 2. Verificar que las tablas existan (el esquema debe haber sido aplicado ahora)
    const dbReady = await verifyDatabaseConnection(testDatabaseUrl);
    if (!dbReady) {
      throw new Error(
        'Database is reachable but schema not found. ' +
          'Run "npm run test:e2e:prepare" before running tests.',
      );
    }

    // 3. Crear cliente Prisma si no existe
    if (!prismaTestClient) {
      const { client, pool } = createPrismaClient(testDatabaseUrl);
      prismaTestClient = client;
      prismaTestPool = pool;

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
    const { client, pool } = createPrismaClient(databaseUrl);

    await client.$connect();

    // Verificar si las tablas existen
    const schema = getSchemaFromUrl(databaseUrl);
    const tables = await client.$queryRaw`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = ${schema} AND table_type = 'BASE TABLE'
    `;

    await client.$disconnect();
    await pool.end();

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
    if (prismaTestPool) {
      await prismaTestPool.end();
      prismaTestPool = null;
    }
    isInitialized = false;
  }
}
