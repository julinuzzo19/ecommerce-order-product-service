import { OrderStatus } from "../../domain/types/OrderStatus.js";

export interface OrderReadDTO {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customerId: string;
  items: Array<{
    id: string;
    sku: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
}
