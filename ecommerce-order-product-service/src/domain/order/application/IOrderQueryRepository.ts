import { OrderId } from "../domain/value-objects/OrderId.js";
import { OrderReadDTO } from "./dtos/OrderReadDTO.js";

export interface IOrderQueryRepository {
  findOrderWithDetails(id: OrderId): Promise<OrderReadDTO | null>;
  findAllOrdersWithDetails(): Promise<OrderReadDTO[]>;
}
