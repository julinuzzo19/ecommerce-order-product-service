import { Prisma } from "@prisma/client";
import { Order } from "../../domain/Order.js";
import { OrderId } from "../../domain/value-objects/OrderId.js";
import { CustomerId } from "../../../../shared/value-objects/CustomerId.js";
import { OrderItem } from "../../domain/OrderItem.js";

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
        orderItems: true;
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

  static toPrismaOrderItems(order: Order): Prisma.OrderItemCreateManyInput[] {
    return order.getItems().map((item) => ({
      id: item.getId(),
      orderNumber: item.getOrderNumber(),
      productId: item.getProductId(),
      quantity: item.getQuantity(),
      price: item.getPrice(),
    }));
  }
}
