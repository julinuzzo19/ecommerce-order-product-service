import { InfrastructureException } from "./InfrastructureException.js";
import { ErrorCode } from "../../domain/exceptions/BaseError.js";

/**
 * Excepción específica para errores relacionados con la publicación de eventos.
 */
export class EventPublisherException extends InfrastructureException {
  constructor(message: string, code: ErrorCode, statusCode = 500) {
    super(message, code, statusCode);
    this.name = "EventPublisherException";
  }

  /**
   * Error cuando el publisher no ha sido inicializado.
   */
  static notInitialized(): EventPublisherException {
    return new EventPublisherException(
      "El publisher no ha sido inicializado. Llama a initialize() primero.",
      ErrorCode.CONFIG_ERROR,
      500
    );
  }

  /**
   * Error al publicar un evento.
   */
  static publishFailed(
    eventName: string,
    reason: string
  ): EventPublisherException {
    return new EventPublisherException(
      `Error al publicar evento '${eventName}': ${reason}`,
      ErrorCode.NETWORK_ERROR,
      500
    );
  }

  /**
   * Error al conectar con RabbitMQ.
   */
  static connectionFailed(reason: string): EventPublisherException {
    return new EventPublisherException(
      `Error de conexión a RabbitMQ: ${reason}`,
      ErrorCode.NETWORK_ERROR,
      503
    );
  }

  /**
   * Error al declarar exchange.
   */
  static exchangeDeclarationFailed(
    exchangeName: string,
    reason: string
  ): EventPublisherException {
    return new EventPublisherException(
      `Error al declarar exchange '${exchangeName}': ${reason}`,
      ErrorCode.CONFIG_ERROR,
      500
    );
  }

  /**
   * Error al cerrar canal o conexión.
   */
  static closeFailed(reason: string): EventPublisherException {
    return new EventPublisherException(
      `Error al cerrar conexión: ${reason}`,
      ErrorCode.NETWORK_ERROR,
      500
    );
  }

  /**
   * Error de validación del mensaje.
   */
  static invalidMessage(details: string): EventPublisherException {
    return new EventPublisherException(
      `Mensaje inválido: ${details}`,
      ErrorCode.VALIDATION_ERROR,
      400
    );
  }

  /**
   * Error cuando el canal no está disponible.
   */
  static channelUnavailable(): EventPublisherException {
    return new EventPublisherException(
      "Canal no disponible. ¿El publisher está correctamente inicializado?",
      ErrorCode.CONFIG_ERROR,
      500
    );
  }
}
