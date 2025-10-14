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

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const MAX_RETRIES = 40;
const RETRY_INTERVAL = 500; // ms
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
      const client = new PrismaClient({
        datasources: { db: { url: DATABASE_URL } },
      });

      await client.$connect();
      await client.$disconnect();

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

    console.log('✅ Cliente de Prisma generado');
  } catch (error) {
    console.error('❌ Error al generar el cliente de Prisma:', error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Preparando base de datos de test...\n');

    await waitForDatabase();
    generatePrismaClient();
    applySchema();

    console.log('\n✅ Base de datos de test lista para los tests');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error preparando la base de datos de test:', error);
    process.exit(1);
  }
}

main();
