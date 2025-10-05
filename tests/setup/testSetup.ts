import {
  cleanTestDatabase,
  closeTestDatabase,
  initializeTestDatabase,
} from "./testDatabase.js";

export async function setupTest() {
  // Inicializar base de datos (solo se hace una vez)
  await initializeTestDatabase();

  // Limpiar datos antes de cada suite de tests
  await cleanTestDatabase();
}

export async function teardownTest() {
  // Limpiar datos después de cada suite
  await cleanTestDatabase();
}

export async function teardownAllTests() {
  // Cerrar conexión al final de todos los tests
  await closeTestDatabase();
}
