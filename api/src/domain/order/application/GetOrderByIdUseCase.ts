import { IOrderQueryRepository } from "./IOrderQueryRepository.js";
import { OrderId } from "../domain/value-objects/OrderId.js";
import { OrderReadDTO } from "./dtos/OrderReadDTO.js";

export class GetOrderByIdUseCase {
  constructor(private readonly orderQueryRepository: IOrderQueryRepository) {}

  public execute = async (id: OrderId): Promise<OrderReadDTO | null> => {
    return await this.orderQueryRepository.findOrderWithDetails(id);
  };
}