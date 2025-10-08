import { IOrderQueryRepository } from "./IOrderQueryRepository.js";
import { OrderReadDTO } from "./dtos/OrderReadDTO.js";
import { OrderDomainException } from "../exceptions/OrderDomainException.js";
import { OrderApplicationException } from "./exceptions/OrderApplicationException.js";
import { CustomId } from "../../../shared/domain/value-objects/CustomId.js";

export class GetOrderByIdUseCase {
  constructor(private readonly orderQueryRepository: IOrderQueryRepository) {}

  public execute = async (id: string): Promise<OrderReadDTO | null> => {
    try {
      const customId = new CustomId(id);
      return await this.orderQueryRepository.findOrderWithDetails(customId);
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
