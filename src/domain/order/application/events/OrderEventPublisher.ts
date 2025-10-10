import {
  EXCHANGES,
  OrderCreatedEvent,
} from "../../../../shared/application/events/types/events.js";
import { BaseEventPublisher } from "../../../../shared/infrastructure/events/BaseEventPublisher.js";

/**
 * Publisher específico para eventos del dominio Order.
 */
export class OrderEventPublisher extends BaseEventPublisher {
  protected exchangeName = EXCHANGES.ORDERS;

  /**
   * Publica el evento OrderCreated.
   */
  async publishOrderCreated(event: OrderCreatedEvent): Promise<void> {
    await this.publish(event);
    console.log(`📤 Evento OrderCreated publicado:`, {
      orderId: event.orderId,
      productsCount: event.products.length,
    });
  }
}
