import { OrderItem } from "./OrderItem";
import { IOrder } from "./types/IOrder";
import { OrderStatus } from "./types/OrderStatus";
import { OrderId } from "./value-objects/OrderId";

/**
 * La raíz del Agregado Order.
 * Encapsula la lógica de negocio y las invariantes de la orden.
 */
export class Order implements IOrder {
  // El constructor recibe el ID como un Value Object o lo crea.
  constructor(
    private id: OrderId,
    private customerId: string,
    private status: OrderStatus,
    private items: OrderItem[]
  ) {
    this.id = id || OrderId.create();
    this.status = status || "pending";
    this.items = items || [];
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
      const newItem = new OrderItem(productId, quantity, price);
      this.items.push(newItem);
    }
  }

  /**
   * Cambia el estado de la orden a "pagada".
   * Este método garantiza que solo el agregado pueda cambiar su estado.
   */
  public markAsPaid(): void {
    if (this.status === "pending") {
      this.status = "paid";
    }
  }

  public markAsShipped(): void {
    if (this.status === "paid") {
      this.status = "shipped";
    }
  }

  public markAsCancelled(): void {
    if (this.status === "pending") {
      this.status = "cancelled";
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
}
