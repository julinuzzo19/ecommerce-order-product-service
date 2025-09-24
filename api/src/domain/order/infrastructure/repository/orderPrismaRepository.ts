import { PrismaClient } from "@prisma/client";
import { IOrderRepository } from "../../domain/IOrderRepository.js";
import { OrderId } from "../../domain/value-objects/OrderId.js";
import { Order } from "../../domain/Order.js";
import { OrderMapper } from "../mappers/OrderMapper.js";
import { IOrderQueryRepository } from "../../application/IOrderQueryRepository.js";
import { OrderReadDTO } from "../../application/dtos/OrderReadDTO.js";

export class OrderPrismaRepository
  implements IOrderRepository, IOrderQueryRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async delete(id: OrderId): Promise<void> {
    await this.prisma.order.delete({
      where: { id: id.value },
    });
  }

  async findAll(): Promise<Order[]> {
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
  }

  async findById(id: OrderId): Promise<Order | null> {
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
  }

  async findByOrderNumber(
    orderNumber: Order["orderNumber"]
  ): Promise<Order | null> {
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
  }

  async save(order: Order): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // 1. Upsert Order (crea o actualiza)
      const orderData = OrderMapper.toPrisma(order); // Sin orderItems

      await tx.order.upsert({
        where: { orderNumber: order.getOrderNumber() },
        update: orderData,
        create: orderData,
      });

      // 2. Obtener items existentes en BD
      const existingItems = await tx.orderItem.findMany({
        where: { orderNumber: order.getOrderNumber() },
      });
      const currentItems = OrderMapper.toPrismaOrderItems(order);

      // 4. Calcular diffs
      const existingIds = new Set(existingItems.map((i) => i.productId));
      const currentIds = new Set(currentItems.map((i) => i.productId));

      const toCreate = currentItems.filter(
        (i) => i.productId && !existingIds.has(i.productId)
      );
      const toUpdate = currentItems.filter(
        (i) =>
          i.productId &&
          existingIds.has(i.productId) &&
          existingItems.find(
            (e) => e.productId === i.productId && e.quantity !== i.quantity
          )
      );
      const toDelete = existingItems.filter(
        (i) => !currentIds.has(i.productId)
      );

      // return;
      // 5. Ejecutar operaciones
      if (toCreate.length > 0) {
        await tx.orderItem.createMany({ data: toCreate });
      }
      for (const item of toUpdate) {
        await tx.orderItem.update({
          where: {
            orderNumber_productId: {
              orderNumber: item.orderNumber,
              productId: item.productId,
            },
          },
          data: { quantity: item.quantity, price: item.price },
        });
      }
      if (toDelete.length > 0) {
        await tx.orderItem.deleteMany({
          where: { id: { in: toDelete.map((i) => i.id) } },
        });
      }
    });
  }

  async findOrderWithDetails(id: OrderId): Promise<OrderReadDTO | null> {
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
  }

  async findAllOrdersWithDetails(): Promise<OrderReadDTO[]> {
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
  }
}
