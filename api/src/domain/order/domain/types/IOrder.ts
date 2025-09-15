import { OrderItem } from "../OrderItem.js";
import { OrderId } from "../value-objects/OrderId.js";

export interface IOrder {
  getId(): OrderId;
  getCustomerId(): string;
  getStatus(): string;
  getItems(): OrderItem[];
  getTotalAmount(): number;
  addItem(productId: string, quantity: number, price: number): void;
  markAsPaid(): void;
  markAsShipped(): void;
  markAsCancelled(): void;
}
