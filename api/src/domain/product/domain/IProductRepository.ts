import { Product } from "./Product.js";
import { ProductId } from "./value-objects/ProductId.js";

/**
 * Interfaz que define el contrato del Repositorio de Producto para la persistencia.
 * Los casos de uso de la capa de aplicación interactuarán con esta interfaz.
 */
export interface IProductRepository {
  /**
   * Find a product by its ID.
   * @param id The ID of the product to find.
   * @returns The found product, or null if not found.
   */
  findById(id: ProductId): Promise<Product | null>;

  /**
   * Save or update a product to the database.
   * @param product The product to save or update.
   */
  save(product: Product): Promise<void>;

  /**
   * Delete a product from the database by its ID.
   * @param id The ID of the product to delete.
   */
  delete(id: ProductId): Promise<void>;

  /**
   * List all products.
   * @returns An array of all products.
   */
  findAll(): Promise<Product[]>;
}
