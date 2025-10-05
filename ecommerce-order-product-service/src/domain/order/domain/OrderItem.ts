/**
 * Clase para un Item de la Orden.
 * No es una entidad independiente, sino que es parte del Agregado `Order`.
 * Solo puede ser creado y modificado a través de la raíz del Agregado.
 */

import { generateUuidV4 } from "../../../shared/utils/uuidGenerator.js";
import { IOrderItem } from "./types/IOrderItem.js";

interface OrderItemProps {
  id?: string;
  productId: string;
  quantity: number;
  price: number;
  orderNumber: string;
}

export class OrderItem implements IOrderItem {
  private id: string;
  private productId: string;
  private quantity: number;
  private price: number;
  private orderNumber: string;

  constructor(props: OrderItemProps) {
    this.id = props.id || generateUuidV4();
    this.productId = props.productId;
    this.quantity = props.quantity;
    this.price = props.price;
    this.orderNumber = props.orderNumber;
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
  public getOrderNumber(): string {
    return this.orderNumber;
  }
}
