import { PrismaClient } from "@prisma/client";

/**
 * Se crea una única instancia de PrismaClient
 * para ser reutilizada en toda la aplicación.
 */
const prisma = new PrismaClient();

export { prisma };
