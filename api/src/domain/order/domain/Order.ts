import { OrderItem } from "./OrderItem.js";
import { IOrder } from "./types/IOrder.js";
import { OrderStatus } from "./types/OrderStatus.js";
import { OrderId } from "./value-objects/OrderId.js";
import { v4 as uuidv4 } from "uuid";

interface OrderProps {
  id?: OrderId;
  customerId: string;
  orderNumber: string;
  status?: OrderStatus;
  items?: OrderItem[];
  created_at?: Date;
  updated_at?: Date;
}

/**
 * La raíz del Agregado Order.
 * Encapsula la lógica de negocio y las invariantes de la orden.
 */
export class Order implements IOrder {
  private id: OrderId;
  private customerId: string;
  private orderNumber: string;
  private status: OrderStatus;
  private items: OrderItem[];
  private created_at: Date;
  private updated_at: Date;

  constructor(props: OrderProps) {
    this.id = props.id || OrderId.create();
    this.status = props.status || "PENDING";
    this.items = props.items || [];
    this.customerId = props.customerId;
    this.orderNumber = props.orderNumber;
    this.created_at = props.created_at || new Date();
    this.updated_at = props.updated_at || new Date();
  }

  /**
   * Agrega un item a la orden.
   * La lógica de negocio para añadir un producto está aquí.
   */
  public addItem(productId: string, quantity: number, price: number): void {
    const existingItem = this.items.find(
      (item) => item.getProductId() === productId
    );
    if (existingItem) {
      existingItem.updateQuantity(quantity);
    } else {
      const newItem = new OrderItem({
        id: uuidv4(),
        productId,
        quantity,
        price,
        orderId: this.id,
      });
      this.items.push(newItem);
    }
  }

  /**
   * Cambia el estado de la orden a "pagada".
   * Este método garantiza que solo el agregado pueda cambiar su estado.
   */
  public markAsPaid(): void {
    if (this.status === "PENDING") {
      this.status = "PAID";
    }
  }

  public markAsShipped(): void {
    if (this.status === "PAID") {
      this.status = "SHIPPED";
    }
  }

  public markAsCancelled(): void {
    if (this.status === "PENDING") {
      this.status = "CANCELLED";
    }
  }

  public getItems(): OrderItem[] {
    return this.items;
  }

  public getStatus(): string {
    return this.status;
  }
  public getId(): OrderId {
    return this.id;
  }
  public getCustomerId(): string {
    return this.customerId;
  }

  public getTotalAmount(): number {
    return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
  }

  public getOrderNumber(): string {
    return this.orderNumber;
  }

  public getCreatedAt(): Date {
    return this.created_at;
  }
  public getUpdatedAt(): Date {
    return this.updated_at;
  }
}
