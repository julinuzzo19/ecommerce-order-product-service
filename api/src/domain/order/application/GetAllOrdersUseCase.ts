import { OrderDomainException } from "../exceptions/OrderDomainException.js";
import { IOrderQueryRepository } from "./IOrderQueryRepository.js";
import { OrderReadDTO } from "./dtos/OrderReadDTO.js";
import { OrderApplicationException } from "./exceptions/OrderApplicationException.js";

export class GetAllOrdersUseCase {
  constructor(private readonly orderQueryRepository: IOrderQueryRepository) {}

  public execute = async (): Promise<OrderReadDTO[]> => {
    try {
      return await this.orderQueryRepository.findAllOrdersWithDetails();
    } catch (error) {
      if (
        error instanceof OrderDomainException ||
        error instanceof OrderApplicationException
      ) {
        throw error;
      }
      throw OrderApplicationException.useCaseError(
        "getting all orders",
        error instanceof Error ? error.message : String(error)
      );
    }
  };
}
