import { CustomId } from '../../../shared/domain/value-objects/CustomId.js';
import { Order } from './Order.js';

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
  findById(id: CustomId): Promise<Order | null>;

  /**
   * Find an order by its order number.
   * @param orderNumber The order number to find.
   * @returns The found order, or null if not found.
   */
  findByOrderNumber(orderNumber: Order['orderNumber']): Promise<Order | null>;

  /**
   * Save or update an order to the database.
   * @param order The order to save or update.
   * @param tx Optional transaction context for write operations.
   */
  save(order: Order, tx?: unknown): Promise<void>;

  /**
   * Delete an order from the database by its ID.
   * @param id The ID of the order to delete.
   * @param tx Optional transaction context for write operations.
   */
  delete(id: CustomId, tx?: unknown): Promise<void>;

  /**
   * List all orders.
   * @returns An array of all orders.
   */
  findAll(): Promise<Order[]>;

  /**
   * Update the status of an order.
   * @returns void
   */
  updateStatus(orderNumber: string, status: Order['status']): Promise<void>;
}
