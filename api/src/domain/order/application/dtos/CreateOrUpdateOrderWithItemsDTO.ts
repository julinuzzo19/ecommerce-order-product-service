import { OrderStatus } from "../../domain/types/OrderStatus.js";

export interface CreateOrUpdateOrderWithItemsDTO {
  id: string;
  customerId: string;
  orderNumber: string;
  status: OrderStatus;
  items: {
    id?: string;
    productId: string;
    quantity: number;
    price: number;
  }[];
}
