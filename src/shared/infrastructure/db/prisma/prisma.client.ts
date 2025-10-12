import { PrismaClient } from "@prisma/client";

/**
 * Configuración de URL de base de datos según el entorno
 */
const getDatabaseUrl = (): string => {
  // const nodeEnv = process.env.NODE_ENV || "development";

  const URL = process.env.DATABASE_URL as string;

  return URL;
  // switch (nodeEnv) {
  //   case "production":
  //     return process.env.DATABASE_URL || "";
  //   case "test":
  //     return process.env.DATABASE_URL_TEST || "";
  //   case "development":
  //   default:
  //     return process.env.DATABASE_URL_DEV || "";
  // }
};

/**
 * Se crea una única instancia de PrismaClient
 * para ser reutilizada en toda la aplicación.
 */
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
});

export { prisma };
