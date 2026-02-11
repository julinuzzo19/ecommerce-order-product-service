#!/usr/bin/env node

/**
 * Script para preparar la base de datos de test antes de ejecutar los tests.
 *
 * Responsabilidades:
 * 1. Esperar a que la base de datos esté accesible
 * 2. Aplicar el esquema con Prisma (db push)
 * 3. Generar el cliente de Prisma si es necesario
 *
 * Uso: node scripts/prepare-test-db.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

const MAX_RETRIES = 40;
const RETRY_INTERVAL = 500; // ms
/**
 * Carga variables de entorno desde un archivo .env simple (KEY=VALUE).
 * No depende de dotenv porque se usa --env-file en otros scripts.
 * @param {string} envFilePath
 */
function loadEnvFromFile(envFilePath) {
  if (!fs.existsSync(envFilePath)) {
    return;
  }

  const content = fs.readFileSync(envFilePath, 'utf-8');
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

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFromFile(path.resolve(process.cwd(), '.env'));

const DATABASE_URL = process.env.DATABASE_URL_TEST;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL_TEST no está definida');
  process.exit(1);
}

/**
 * Espera hasta que la base de datos acepte conexiones.
 */
async function waitForDatabase() {
  console.log('⏳ Esperando a que la base de datos esté disponible...');

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const pool = new Pool({ connectionString: DATABASE_URL });
      const client = await pool.connect();
      client.release();
      await pool.end();

      console.log('✅ Base de datos accesible');
      return;
    } catch (error) {
      console.log({ error });
      if (attempt === MAX_RETRIES) {
        console.error(
          `❌ No se pudo conectar a la base de datos después de ${MAX_RETRIES} intentos`,
        );
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
    }
  }
}

/**
 * Aplica el esquema de Prisma a la base de datos.
 */
function applySchema() {
  console.log('📦 Aplicando esquema de Prisma a la base de datos de test...');

  try {
    execSync(
      'npx prisma db push --schema=./src/shared/infrastructure/db/prisma/schema.prisma --accept-data-loss',
      {
        env: {
          ...process.env,
          DATABASE_URL,
        },
        stdio: 'inherit',
        timeout: 120_000,
      },
    );

    console.log('✅ Esquema aplicado correctamente');
  } catch (error) {
    console.error('❌ Error al aplicar el esquema:', error.message);
    throw error;
  }
}

/**
 * Genera el cliente de Prisma.
 */
function generatePrismaClient() {
  console.log('🔧 Generando cliente de Prisma...');

  try {
    execSync(
      'npx prisma generate --schema=./src/shared/infrastructure/db/prisma/schema.prisma',
      {
        stdio: 'inherit',
        timeout: 60_000,
      },
    );
  } catch (error) {
    console.error('❌ Error al generar el cliente de Prisma:', error.message);
    throw error;
  }
}

async function main() {
  try {
    await waitForDatabase();
    generatePrismaClient();
    applySchema();

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error preparando la base de datos de test:', error);
    process.exit(1);
  }
}

main();
