import { OrderStatus } from "../../domain/types/OrderStatus.js";

export interface OrderResponseDTO {
  id: string;
  customerId: string;
  orderNumber: string;
  status: OrderStatus;
  items: Array<{
    sku: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
}
