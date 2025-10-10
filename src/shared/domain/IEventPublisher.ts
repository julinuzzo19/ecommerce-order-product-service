export interface IEventPublisher {
  /**
   * Inicializa la conexión del publisher.
   */
  initialize(): Promise<void>;

  /**
   * Cierra la conexión del publisher de forma limpia.
   */
  close(): Promise<void>;
}
