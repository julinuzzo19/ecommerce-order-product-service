import { Customer } from "./Customer";
import { CustomerId } from "./value-objects/CustomerId";

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
  findById(id: CustomerId): Promise<Customer | null>;

  /**
   * Save or update a customer to the database.
   * @param customer The customer to save or update.
   */
  save(customer: Customer): Promise<void>;

  /**
   * Delete a customer from the database by their ID.
   * @param id The ID of the customer to delete.
   */
  delete(id: CustomerId): Promise<void>;

  /**
   * List all customers.
   * @returns An array of all customers.
   */
  findAll(): Promise<Customer[]>;
}
