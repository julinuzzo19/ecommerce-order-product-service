import {
  EXCHANGES,
  OrderCancelledEvent,
  OrderCreatedEvent,
  ROUTING_KEYS,
} from "../../../../shared/application/events/types/events.js";
import { BaseEventPublisher } from "../../../../shared/infrastructure/events/BaseEventPublisher.js";

/**
 * Publisher específico para eventos del dominio Order.
 */
export class OrderEventPublisher extends BaseEventPublisher {
  protected exchangeName = EXCHANGES.ORDERS;
  protected exchangeType: "fanout" | "topic" | "direct" = "topic";

  /**
   * Publica el evento OrderCreated.
   */
  async publishOrderCreated(event: OrderCreatedEvent): Promise<void> {
    await this.publish(event, ROUTING_KEYS.ORDER_CREATED);
    console.log(`📤 Evento OrderCreated publicado:`, {
      orderId: event.orderId,
      productsCount: event.products.length,
    });
  }
  /**
   * Publica el evento orderCancelled.
   */
  async publishOrderCancelled(event: OrderCancelledEvent): Promise<void> {
    await this.publish(event, ROUTING_KEYS.ORDER_CANCELLED);
    // debe restar stock en inventario
    console.log(`📤 Evento OrderCancelled publicado:`, {
      orderId: event.orderId,
    });
  }
}
