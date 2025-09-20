import { OrderError } from "../domain/errors/OrderError.js";
import { IOrderRepository } from "../domain/IOrderRepository.js";
import { IProductRepository } from "../../product/domain/IProductRepository.js";
import { CreateOrUpdateOrderWithItemsSchema } from "./CreateOrUpdateOrderWithItemsSchema.js";
import { CreateOrUpdateOrderWithItemsDTO } from "./dtos/CreateOrUpdateOrderWithItemsDTO.js";
import { Order } from "../domain/Order.js";
import { OrderId } from "../domain/value-objects/OrderId.js";
import { OrderItem } from "../domain/OrderItem.js";
import { ProductId } from "../../../shared/value-objects/ProductId.js";
import { CustomerId } from "../../../shared/value-objects/CustomerId.js";

export class CreateOrUpdateOrderWithItemsUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository
  ) {}

  public execute = async (data: CreateOrUpdateOrderWithItemsDTO) => {
    const validation = CreateOrUpdateOrderWithItemsSchema.safeParse(data);

    if (!validation.success) {
      throw new OrderError("Invalid order data");
    }

    // Validar stock de productos
    for (const item of validation.data.items) {
      const isInStock = await this.productRepository.isProductInStock(
        new ProductId(item.productId),
        item.quantity
      );

      if (isInStock === null) {
        throw new OrderError(`Product with ID ${item.productId} not found`);
      }
      if (!isInStock) {
        throw new OrderError(`Product ${item.productId} is out of stock`);
      }
    }

    const order = this.mapToEntity(validation.data);

    await this.orderRepository.save(order);

    return "Order saved successfully";
  };

  private mapToEntity(orderData: CreateOrUpdateOrderWithItemsDTO): Order {
    return new Order({
      id: new OrderId(orderData.id),
      customerId: new CustomerId(orderData.customerId),
      orderNumber: orderData.orderNumber,
      status: orderData.status,
      items: orderData.items.map(
        (item) =>
          new OrderItem({
            id: item.id,
            orderNumber: orderData.orderNumber,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })
      ),
    });
  }
}
