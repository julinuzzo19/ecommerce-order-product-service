import { Order } from "./Order.js";
import { OrderId } from "./value-objects/OrderId.js";

/**
 * Interfaz que define el contrato del Repositorio de Orden para la persistencia.
 * Los casos de uso de la capa de aplicación interactuarán con esta interfaz.
 */
export interface IOrderRepository {
  /**
   * Find an order by its ID.
   * @param id The ID of the order to find.
   * @returns The found order, or null if not found.
   */
  findById(id: OrderId): Promise<Order | null>;

  /**
   * Find an order by its ID.
   * @param id The ID of the order to find.
   * @returns The found order, or null if not found.
   */
  findByOrderNumber(orderNumber: Order["orderNumber"]): Promise<Order | null>;

  /**
   * Save or update an order to the database.
   * @param order The order to save or update.
   */
  save(order: Order): Promise<void>;

  /**
   * Delete an order from the database by its ID.
   * @param id The ID of the order to delete.
   */
  delete(id: OrderId): Promise<void>;

  /**
   * List all orders.
   * @returns An array of all orders.
   */
  findAll(): Promise<Order[]>;
}
