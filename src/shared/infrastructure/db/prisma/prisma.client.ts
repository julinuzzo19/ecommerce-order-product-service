import { PrismaClient } from '../../../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const getSchemaFromUrl = (url: string): string => {
  const m = url.match(/[?&]schema=([^&]+)/);
  return m ? decodeURIComponent(m[1]) : 'public';
};

/**
 * Lazy singleton: el cliente se crea la primera vez que se usa `prisma`,
 * no al importar el módulo. Permite que DATABASE_URL sea sobreescrita
 * (ej. en tests via run-e2e-tests.cjs) antes de la primera query.
 *
 * PrismaPg acepta { schema } como segundo argumento para indicar el schema
 * PostgreSQL — es la forma oficial con driver adapters (Prisma v7).
 */
let _prisma: PrismaClient | null = null;

function getPrismaClient(): PrismaClient {
  if (!_prisma) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is required');
    const adapter = new PrismaPg(
      { connectionString: url },
      { schema: getSchemaFromUrl(url) },
    );
    _prisma = new PrismaClient({ adapter });
  }
  return _prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrismaClient() as any)[prop];
  },
});
