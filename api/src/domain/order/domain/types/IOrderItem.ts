import { OrderId } from "../value-objects/OrderId.js";

export interface IOrderItem {
  getId(): string;
  getOrderId(): OrderId;
  getProductId(): string;
  getQuantity(): number;
  getPrice(): number;
  getTotalPrice(): number;
}
