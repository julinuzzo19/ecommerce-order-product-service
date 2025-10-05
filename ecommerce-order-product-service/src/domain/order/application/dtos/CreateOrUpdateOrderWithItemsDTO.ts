import { OrderStatus } from "../../domain/types/OrderStatus.js";

export interface CreateOrUpdateOrderWithItemsDTO {
  id: string;
  customerId: string;
  orderNumber: string;
  status: OrderStatus;
  items: {
    productId: string;
    quantity: number;
  }[];
}
