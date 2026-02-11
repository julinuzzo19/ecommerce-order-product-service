import { PrismaClient } from '../../../../generated/prisma/client.js';
import { IOrderRepository } from '../../domain/IOrderRepository.js';
import { Order } from '../../domain/Order.js';
import { OrderMapper } from '../mappers/OrderMapper.js';
import { IOrderQueryRepository } from '../../application/IOrderQueryRepository.js';
import { OrderReadDTO } from '../../application/dtos/OrderReadDTO.js';
import { PrismaErrorHandler } from '../../../../shared/infrastructure/database/PrismaErrorHandler.js';
import { CustomId } from '../../../../shared/domain/value-objects/CustomId.js';

type PrismaTransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export class OrderPrismaRepository
  implements IOrderRepository, IOrderQueryRepository
{
  constructor(
    private readonly prisma: PrismaClient,
    private readonly errorHandler: PrismaErrorHandler = new PrismaErrorHandler(),
  ) {}

  /**
   * Obtiene el cliente a usar (transaccional o normal)
   */
  private getClient(tx?: PrismaTransactionClient): PrismaTransactionClient {
    return tx || this.prisma;
  }

  async delete(id: CustomId, tx?: PrismaTransactionClient): Promise<void> {
    try {
      const client = this.getClient(tx);
      await client.order.delete({
        where: { id: id.value },
      });
    } catch (error) {
      this.errorHandler.handleError(error, 'delete order');
    }
  }

  async findAll(): Promise<Order[]> {
    try {
      const orders = await this.prisma.order.findMany({
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      return orders.map(OrderMapper.fromPrismaWithOrderItems);
    } catch (error) {
      this.errorHandler.handleError(error, 'find all orders');
    }
  }

  async findById(id: CustomId): Promise<Order | null> {
    try {
      const order = await this.prisma.order.findUnique({
        where: {
          id: id.value,
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      return order ? OrderMapper.fromPrismaWithOrderItems(order) : null;
    } catch (error) {
      this.errorHandler.handleError(error, 'find order by ID');
    }
  }

  async findByOrderNumber(
    orderNumber: Order['orderNumber'],
  ): Promise<Order | null> {
    try {
      const order = await this.prisma.order.findUnique({
        where: {
          orderNumber: orderNumber,
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      return order ? OrderMapper.fromPrismaWithOrderItems(order) : null;
    } catch (error) {
      this.errorHandler.handleError(error, 'find order by order number');
    }
  }

  async save(order: Order, tx?: PrismaTransactionClient): Promise<void> {
    try {
      const client = this.getClient(tx);

      // Si ya hay un contexto transaccional externo, usamos ese directamente
      if (tx) {
        await this.executeSave(client, order);
      } else {
        // Si no hay transacción externa, creamos una interna
        await this.prisma.$transaction(async (internalTx) => {
          await this.executeSave(internalTx, order);
        });
      }
    } catch (error) {
      this.errorHandler.handleError(error, 'save order');
    }
  }

  async updateStatus(
    orderNumber: string,
    status: Order['status'],
  ): Promise<void> {
    try {
      const client = this.getClient();

      await client.order.update({
        where: { orderNumber },
        data: {
          status,
        },
      });
    } catch (error) {
      this.errorHandler.handleError(error, 'save order');
    }
  }

  /**
   * Lógica de guardado separada para reutilizar con o sin transacción
   */
  private async executeSave(
    client: PrismaTransactionClient,
    order: Order,
  ): Promise<void> {
    // 1. Upsert Order (crea o actualiza)
    const orderData = OrderMapper.toPrisma(order); // Sin orderItems

    await client.order.upsert({
      where: { orderNumber: order.getOrderNumber() },
      update: orderData,
      create: orderData,
    });

    // 2. Obtener items existentes en BD
    const existingItems = await client.orderItem.findMany({
      where: { orderNumber: order.getOrderNumber() },
    });
    const currentItems = OrderMapper.toPrismaOrderItems(order);

    // 4. Calcular diffs
    const existingIds = new Set(existingItems.map((i) => i.sku));
    const currentIds = new Set(currentItems.map((i) => i.sku));

    const toCreate = currentItems.filter(
      (i) => i.sku && !existingIds.has(i.sku),
    );
    const toUpdate = currentItems.filter(
      (i) =>
        i.sku &&
        existingIds.has(i.sku) &&
        existingItems.find((e) => e.sku === i.sku && e.quantity !== i.quantity),
    );
    const toDelete = existingItems.filter((i) => !currentIds.has(i.sku));

    // 5. Ejecutar operaciones
    if (toCreate.length > 0) {
      await client.orderItem.createMany({ data: toCreate });
    }
    for (const item of toUpdate) {
      await client.orderItem.update({
        where: {
          orderNumber_sku: {
            orderNumber: item.orderNumber,
            sku: item.sku,
          },
        },
        data: { quantity: item.quantity, price: item.price },
      });
    }
    if (toDelete.length > 0) {
      await client.orderItem.deleteMany({
        where: { id: { in: toDelete.map((i) => i.id) } },
      });
    }
  }

  async findOrderWithDetails(id: CustomId): Promise<OrderReadDTO | null> {
    try {
      const order = await this.prisma.order.findUnique({
        where: {
          id: id.value,
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      return order ? OrderMapper.toReadDTO(order) : null;
    } catch (error) {
      this.errorHandler.handleError(error, 'find order with details by ID');
    }
  }

  async findAllOrdersWithDetails(): Promise<OrderReadDTO[]> {
    try {
      const orders = await this.prisma.order.findMany({
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      return orders.map(OrderMapper.toReadDTO);
    } catch (error) {
      this.errorHandler.handleError(error, 'find all orders with details');
    }
  }
}
