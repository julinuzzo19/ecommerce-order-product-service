import { CustomId } from "../../../shared/domain/value-objects/CustomId.js";
import { Product } from "./Product.js";

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
  findById(id: CustomId): Promise<Product | null>;
  /**
   * Find a product by its sku.
   * @param sku The sku of the product to find.
   * @returns The found product, or null if not found.
   */
  findBySku(sku: string): Promise<Product | null>;

  /**
   * Save or update a product to the database.
   * @param product The product to save or update.
   */
  save(product: Product): Promise<void>;

  /**
   * Delete a product from the database by its ID.
   * @param id The ID of the product to delete.
   */
  delete(id: CustomId): Promise<void>;

  /**
   * List all products.
   * @returns An array of all products.
   */
  findAll(): Promise<Product[]>;

  /**
   * Check if a product is in stock.
   * @param productId The ID of the product to check.
   * @param quantity The quantity to check for availability.
   * @returns boolean indicating if the product is in stock.
   */
  // isProductInStock(productId: ProductId, quantity: number): Promise<boolean>;
}
