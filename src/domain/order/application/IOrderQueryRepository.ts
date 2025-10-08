import { CustomId } from "../../../shared/domain/value-objects/CustomId.js";
import { OrderReadDTO } from "./dtos/OrderReadDTO.js";

export interface IOrderQueryRepository {
  findOrderWithDetails(id: CustomId): Promise<OrderReadDTO | null>;
  findAllOrdersWithDetails(): Promise<OrderReadDTO[]>;
}
