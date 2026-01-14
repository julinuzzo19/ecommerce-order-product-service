/**
 * Config de Prisma (v7.x) para CLI/Migrate.
 *
 * En Prisma 7, las URLs de conexión ya no viven en el `schema.prisma`.
 * Prisma CLI lee la conexión desde este archivo.
 */
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './src/shared/infrastructure/db/prisma/schema.prisma',
  migrations: {
    path: './src/shared/infrastructure/db/prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
