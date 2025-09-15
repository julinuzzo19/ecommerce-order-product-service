/**
 * Clase para un Item de la Orden.
 * No es una entidad independiente, sino que es parte del Agregado `Order`.
 * Solo puede ser creado y modificado a través de la raíz del Agregado.
 */

import { IOrderItem } from "./types/IOrderItem.js";

export class OrderItem implements IOrderItem {
  constructor(
    private productId: string,
    private quantity: number,
    private price: number
  ) {}

  /**
   * Actualiza la cantidad del item.
   * Método accesible solo desde el agregado.
   */
  public updateQuantity(newQuantity: number): void {
    this.quantity = newQuantity;
  }

  public getTotalPrice(): number {
    return this.quantity * this.price;
  }

  public getProductId(): string {
    return this.productId;
  }

  public getQuantity(): number {
    return this.quantity;
  }
  public getPrice(): number {
    return this.price;
  }
}
