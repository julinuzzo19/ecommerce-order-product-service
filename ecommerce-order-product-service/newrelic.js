"use strict";

/**
 * New Relic agent configuration.
 *
 * See lib/config/default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Nombre de tu aplicación (aparecerá en New Relic dashboard)
   */
  app_name: [process.env.NEW_RELIC_APP_NAME],

  /**
   * Tu license key de New Relic
   * IMPORTANTE: Usa variable de entorno en producción
   */
  license_key: process.env.NEW_RELIC_LICENSE_KEY,

  /**
   * Nivel de logging
   * 'info' es bueno para desarrollo, 'warn' para producción
   */
  logging: {
    level: process.env.NEW_RELIC_LOG_LEVEL || "info",
    filepath:
      // process.env.NODE_ENV === "production"
      //   ? "./logs/newrelic_agent.log":
      "stdout", // Log a consola, útil para desarrollo
  },

  /**
   * Distributed tracing (RECOMENDADO - deja habilitado)
   */
  distributed_tracing: {
    enabled: true,
  },

  /**
   * Transaction tracer (para ver requests lentas en detalle)
   */
  transaction_tracer: {
    enabled: true,
    transaction_threshold: "apdex_f", // Captura transacciones lentas
    record_sql: "obfuscated", // Oculta valores sensibles en queries
  },

  /**
   * Error collector
   */
  error_collector: {
    enabled: true,
    ignore_status_codes: [404], // No reportar 404s como errores
  },

  /**
   * Habilitar en desarrollo/producción
   */
  agent_enabled: process.env.NEW_RELIC_ENABLED !== "false",

  /**
   * Excluir headers sensibles
   */
  allow_all_headers: false,
  attributes: {
    exclude: [
      "request.headers.cookie",
      "request.headers.authorization",
      "request.headers.proxyAuthorization",
      "request.headers.setCookie*",
      "request.headers.x*",
      "response.headers.cookie",
      "response.headers.authorization",
      "response.headers.proxyAuthorization",
      "response.headers.setCookie*",
      "response.headers.x*",
    ],
  },
};
