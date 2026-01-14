import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * Obtiene la URL de la base de datos desde las variables de entorno.
 * @returns {string} URL de conexión a la base de datos
 */
const getDatabaseUrl = (): string => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to initialize PrismaClient');
  }

  return databaseUrl;
};

/**
 * Instancia única de PrismaClient para la aplicación.
 *
 * Prisma v7 requiere pasar un `adapter` (conexión directa) o `accelerateUrl`.
 * Aquí usamos PostgreSQL vía `@prisma/adapter-pg`.
 */
const pool = new Pool({ connectionString: getDatabaseUrl() });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };
