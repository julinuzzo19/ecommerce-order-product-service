const { execSync } = require("child_process");

const containerName = "postgres-test";

function runCommand(command, ignoreError = false) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: "inherit" });
    return true;
  } catch (error) {
    if (!ignoreError) {
      console.error(`❌ Command failed: ${command}`);
      console.error(error.message);
      return false;
    }
    return false;
  }
}

function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

async function waitForPostgreSQL() {
  const maxAttempts = 30;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      execSync(`docker exec ${containerName} pg_isready -U postgres`, {
        stdio: "pipe",
      });
      console.log("✅ PostgreSQL is ready");
      return true;
    } catch (error) {
      attempts++;
      console.log(`⏳ Waiting for PostgreSQL... (${attempts}/${maxAttempts})`);
      await sleep(1);
    }
  }

  console.error("❌ PostgreSQL failed to be ready in time");
  return false;
}

async function cleanup() {
  console.log("🧹 Cleaning up PostgreSQL container...");
  runCommand(`docker stop ${containerName}`, true);
  runCommand(`docker rm ${containerName}`, true);
  console.log("✅ Container cleanup completed");
}

// Manejar señales de salida para siempre limpiar
process.on("SIGINT", async () => {
  console.log("\n🛑 Received SIGINT, cleaning up...");
  await cleanup();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Received SIGTERM, cleaning up...");
  await cleanup();
  process.exit(0);
});

async function main() {
  console.log("🚀 Starting E2E tests with Docker PostgreSQL...");

  try {
    // Limpiar contenedor existente
    console.log("🧹 Cleaning up existing container...");
    runCommand(`docker stop ${containerName}`, true);
    runCommand(`docker rm ${containerName}`, true);

    // Crear nuevo contenedor con auto-remove
    console.log("📦 Creating PostgreSQL container with auto-cleanup...");
    const containerStarted = runCommand(
      `docker run --name ${containerName} -e POSTGRES_PASSWORD=test -e POSTGRES_DB=postgres -p 5433:5432 -d postgres:15-alpine`
      //                                    ^^^^^^ --rm elimina automáticamente cuando se detiene
    );

    if (!containerStarted) {
      console.error("❌ Failed to start PostgreSQL container");
      process.exit(1);
    }

    // Esperar a que PostgreSQL esté completamente listo
    const isReady = await waitForPostgreSQL();
    if (!isReady) {
      await cleanup();
      process.exit(1);
    }

    console.log("⏳ Ensuring PostgreSQL is fully initialized...");
    await sleep(2);

    console.log("🧪 Running E2E tests...");
    const testsSucceeded = runCommand("npm run test:e2e");

    if (testsSucceeded) {
      console.log("✅ E2E tests completed successfully!");
    } else {
      console.log("❌ E2E tests failed");
    }

    return testsSucceeded;
  } finally {
    // Siempre limpiar el contenedor
    await cleanup();
  }
}

main()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch(async (error) => {
    console.error("💥 Unexpected error:", error);
    await cleanup();
    process.exit(1);
  });
