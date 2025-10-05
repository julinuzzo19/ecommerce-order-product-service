import { NewRelicMonitoring } from "../../../shared/infrastructure/monitoring/NewRelicMonitoring.js";
import { OrderDomainException } from "../exceptions/OrderDomainException.js";
import { IOrderQueryRepository } from "./IOrderQueryRepository.js";
import { OrderReadDTO } from "./dtos/OrderReadDTO.js";
import { OrderApplicationException } from "./exceptions/OrderApplicationException.js";

export class GetAllOrdersUseCase {
  constructor(private readonly orderQueryRepository: IOrderQueryRepository) {}

  public execute = async (): Promise<OrderReadDTO[]> => {
    try {
      const startTime = Date.now();

      const result = await this.orderQueryRepository.findAllOrdersWithDetails();

      const duration = Date.now() - startTime;

      NewRelicMonitoring.recordEvent("OrdersRetrieved_Duration", {
        length: result.length,
        duration,
      });

      return result;
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
