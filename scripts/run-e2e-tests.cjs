'use strict';

/**
 * Wrapper para correr los tests e2e con DATABASE_URL apuntando al schema de test.
 *
 * El problema: Jest workers son procesos hijos que heredan process.env del proceso
 * que los lanza. Si seteamos DATABASE_URL aquí antes de spawnear Jest, todos los
 * workers lo heredan — incluyendo cuando prisma.client.ts inicializa su pool.
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const sep = trimmed.indexOf('=');
    if (sep <= 0) continue;
    const key = trimmed.slice(0, sep).trim();
    let value = trimmed.slice(sep + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnvFile();

if (!process.env.DATABASE_URL_TEST) {
  console.error('❌ DATABASE_URL_TEST no está definida en .env');
  process.exit(1);
}

// Sobreescribir DATABASE_URL ANTES de spawnear Jest.
// Los workers heredan este process.env completo.
process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;
process.env.NODE_ENV = 'test';

console.log(`[run-e2e-tests] DATABASE_URL → ${process.env.DATABASE_URL}`);

execFileSync(
  process.execPath,
  [
    '--experimental-vm-modules',
    'node_modules/.bin/jest',
    '--verbose',
    '--config=__tests__/setup/jest.config.cjs',
    '--selectProjects', 'e2e',
    '--runInBand',
  ],
  {
    stdio: 'inherit',
    env: process.env,
  },
);
