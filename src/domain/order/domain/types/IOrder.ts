import { CustomId } from "../../../../shared/domain/value-objects/CustomId.js";
import { OrderItem } from "../OrderItem.js";

export interface IOrder {
  getId(): CustomId;
  getCustomerId(): CustomId;
  getStatus(): string;
  getItems(): OrderItem[];
  getTotalAmount(): number;
  addItem(sku: string, quantity: number, price: number): void;
  markAsPaid(): void;
  markAsShipped(): void;
  markAsCancelled(): void;
  getOrderNumber(): string;
}
