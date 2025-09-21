import { Prisma } from "@prisma/client";
import { Order } from "../../domain/Order.js";
import { OrderId } from "../../domain/value-objects/OrderId.js";
import { CustomerId } from "../../../../shared/value-objects/CustomerId.js";
import { OrderItem } from "../../domain/OrderItem.js";
import { OrderResponseDTO } from "../../application/dtos/OrderResponseDTO.js";
import { OrderReadDTO } from "../../application/dtos/OrderReadDTO.js";

export class OrderMapper {
  static toPrisma(order: Order): Prisma.OrderCreateInput {
    return {
      id: order.getId().value,
      orderNumber: order.getOrderNumber(),
      status: order.getStatus(),
      customer: {
        connect: { id: order.getCustomerId().value }, // Connect by ID, customerId is required
      },
    };
  }

  static fromPrismaWithOrderItems(
    data: Prisma.OrderGetPayload<{
      include: {
        orderItems: {
          include: {
            product: true;
          };
        };
      };
    }>
  ): Order {
    return new Order({
      id: new OrderId(data.id),
      customerId: new CustomerId(data.customerId),
      orderNumber: data.orderNumber,
      status: data.status,
      items: data.orderItems.map((item) => {
        return new OrderItem({
          id: item.id,
          orderNumber: item.orderNumber,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price.toNumber(),
        });
      }),
    });
  }

  static toResponseDTO(
    data: Prisma.OrderGetPayload<{
      include: {
        orderItems: {
          include: {
            product: true;
          };
        };
      };
    }>
  ): OrderResponseDTO {
    return {
      id: data.id,
      customerId: data.customerId,
      orderNumber: data.orderNumber,
      status: data.status,
      items: data.orderItems.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price.toNumber(),
      })),
    };
  }

  static toPrismaOrderItems(order: Order): Prisma.OrderItemCreateManyInput[] {
    return order.getItems().map((item) => ({
      id: item.getId(),
      orderNumber: item.getOrderNumber(),
      productId: item.getProductId(),
      quantity: item.getQuantity(),
      price: item.getPrice(),
    }));
  }

  static toReadDTO(
    data: Prisma.OrderGetPayload<{
      include: {
        orderItems: {
          include: {
            product: true;
          };
        };
      };
    }>
  ): OrderReadDTO {
    return {
      id: data.id,
      customerId: data.customerId,
      orderNumber: data.orderNumber,
      status: data.status,
      items: data.orderItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price.toNumber(),
      })),
    };
  }
}
