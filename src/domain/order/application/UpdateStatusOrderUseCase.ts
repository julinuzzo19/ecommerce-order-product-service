import { PublisherException } from '../../../shared/application/events/exceptions/PublisherException.js';
import { IUnitOfWork } from '../../../shared/domain/IUnitOfWork.js';
import { IOrderRepository } from '../domain/IOrderRepository.js';
import { Order } from '../domain/Order.js';
import { OrderStatus } from '../domain/types/OrderStatus.js';
import { OrderDomainException } from '../exceptions/OrderDomainException.js';
import { UpdateStatusOrderRequestDTO } from './dtos/UpdateStatusOrderRequestDTO.js';
import { OrderEventPublisher } from './events/OrderEventPublisher.js';
import { OrderApplicationException } from './exceptions/OrderApplicationException.js';

export class UpdateStatusOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private orderPublisher: OrderEventPublisher,
    private unitOfWork: IUnitOfWork,
  ) {}

  public execute = async ({
    orderNumber,
    status,
  }: UpdateStatusOrderRequestDTO): Promise<'Ok'> => {
    try {
      const order = await this.orderRepository.findByOrderNumber(orderNumber);

      if (!order) {
        throw OrderDomainException.notFound(orderNumber);
      }

      await this.unitOfWork.execute(async (tx) => {
        if (!Order.STATUS_LIST.includes(status as OrderStatus)) {
          throw OrderDomainException.validationError('Invalid order status');
        }
        order.setStatus(status as OrderStatus);
        await this.orderRepository.save(order, tx);

        // publish event if order is cancelled
        if (status === 'CANCELLED') {
          await this.orderPublisher.publishOrderCancelled({
            type: 'order.cancelled',
            orderId: order.getOrderNumber(),
            products: order.getItems().map((item) => ({
              sku: item.getSku(),
              quantity: item.getQuantity(),
            })),
          });
        }
      });

      return 'Ok';
    } catch (error) {
      if (
        error instanceof OrderDomainException ||
        error instanceof PublisherException
      ) {
        throw error;
      }
      throw OrderApplicationException.useCaseError(
        'error updating status order',
        error instanceof Error ? error.message : String(error),
      );
    }
  };
}
