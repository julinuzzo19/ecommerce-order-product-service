/**
 * Clase para un Item de la Orden.
 * No es una entidad independiente, sino que es parte del Agregado `Order`.
 * Solo puede ser creado y modificado a través de la raíz del Agregado.
 */

import { IOrderItem } from "./types/IOrderItem.js";
import { OrderId } from "./value-objects/OrderId.js";

interface OrderItemProps {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  orderId: OrderId;
}

export class OrderItem implements IOrderItem {
  private id: string;
  private productId: string;
  private quantity: number;
  private price: number;
  private orderId: OrderId;

  constructor(props: OrderItemProps) {
    this.id = props.id;
    this.productId = props.productId;
    this.quantity = props.quantity;
    this.price = props.price;
    this.orderId = props.orderId;
  }

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
  public getId(): string {
    return this.id;
  }
  public getOrderId(): OrderId {
    return this.orderId;
  }
}
