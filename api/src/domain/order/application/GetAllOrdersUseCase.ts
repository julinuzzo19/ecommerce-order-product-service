import { IOrderQueryRepository } from "./IOrderQueryRepository.js";
import { OrderReadDTO } from "./dtos/OrderReadDTO.js";

export class GetAllOrdersUseCase {
  constructor(private readonly orderQueryRepository: IOrderQueryRepository) {}

  public execute = async (): Promise<OrderReadDTO[]> => {
    return await this.orderQueryRepository.findAllOrdersWithDetails();
  };
}
