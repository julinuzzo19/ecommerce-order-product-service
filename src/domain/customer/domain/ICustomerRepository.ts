import { CustomId } from "../../../shared/domain/value-objects/CustomId.js";
import { Customer } from "./Customer.js";

/**
 * Interfaz que define el contrato del Repositorio de Cliente para la persistencia.
 * Los casos de uso de la capa de aplicación interactuarán con esta interfaz.
 */
export interface ICustomerRepository {
  /**
   * Find a customer by their ID.
   * @param id The ID of the customer to find.
   * @returns The found customer, or null if not found.
   */
  findById(id: CustomId): Promise<Customer | null>;

  /**
   * Save or update a customer to the database.
   * @param customer The customer to save or update.
   * @param tx Optional transaction context for write operations.
   */
  save(customer: Customer, tx?: unknown): Promise<void>;

  /**
   * Delete a customer from the database by their ID.
   * @param id The ID of the customer to delete.
   * @param tx Optional transaction context for write operations.
   */
  delete(id: CustomId, tx?: unknown): Promise<void>;

  /**
   * List all customers.
   * @returns An array of all customers.
   */
  findAll(): Promise<Customer[]>;
}
