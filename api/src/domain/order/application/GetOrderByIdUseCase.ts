import { IOrderQueryRepository } from "./IOrderQueryRepository.js";
import { OrderId } from "../domain/value-objects/OrderId.js";
import { OrderReadDTO } from "./dtos/OrderReadDTO.js";
import { OrderDomainException } from "../exceptions/OrderDomainException.js";
import { OrderApplicationException } from "./exceptions/OrderApplicationException.js";

export class GetOrderByIdUseCase {
  constructor(private readonly orderQueryRepository: IOrderQueryRepository) {}

  public execute = async (id: OrderId): Promise<OrderReadDTO | null> => {
    try {
      return await this.orderQueryRepository.findOrderWithDetails(id);
    } catch (error) {
      if (
        error instanceof OrderDomainException ||
        error instanceof OrderApplicationException
      ) {
        throw error;
      }
      throw OrderApplicationException.useCaseError(
        "getting order by ID",
        error instanceof Error ? error.message : String(error)
      );
    }
  };
}
