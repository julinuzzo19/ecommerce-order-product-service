import { IOrderRepository } from "../domain/IOrderRepository.js";
import { IProductRepository } from "../../product/domain/IProductRepository.js";
import { CreateOrUpdateOrderWithItemsSchema } from "./CreateOrUpdateOrderWithItemsSchema.js";
import { CreateOrUpdateOrderWithItemsDTO } from "./dtos/CreateOrUpdateOrderWithItemsDTO.js";
import { Order } from "../domain/Order.js";
import { OrderId } from "../domain/value-objects/OrderId.js";
import { OrderItem } from "../domain/OrderItem.js";
import { Product } from "../../product/domain/Product.js";
import { ProductDomainException } from "../../../shared/domain/exceptions/ProductDomainException.js";
import { ProductId } from "../../../shared/domain/value-objects/ProductId.js";
import { CustomerId } from "../../../shared/domain/value-objects/CustomerId.js";
import { OrderDomainException } from "../exceptions/OrderDomainException.js";
import { OrderApplicationException } from "./exceptions/OrderApplicationException.js";

export class CreateOrUpdateOrderWithItemsUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository
  ) {}

  public async execute(data: CreateOrUpdateOrderWithItemsDTO): Promise<string> {
    try {
      // 1. Validar entrada
      const validatedData = this.validateInput(data);

      // 2. Obtener y validar productos
      const productsData = await this.validateAndGetProducts(
        validatedData.items
      );

      // 3. Crear entidad Order
      const order = this.createOrderEntity(validatedData, productsData);

      // 4. Persistir
      await this.orderRepository.save(order);

      return "Order saved successfully";
    } catch (error) {
      if (
        error instanceof OrderDomainException ||
        error instanceof OrderApplicationException ||
        error instanceof ProductDomainException
      ) {
        throw error;
      }
      throw OrderApplicationException.useCaseError(
        "creating or updating order with items",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  private validateInput(
    data: CreateOrUpdateOrderWithItemsDTO
  ): CreateOrUpdateOrderWithItemsDTO {
    const validation = CreateOrUpdateOrderWithItemsSchema.safeParse(data);

    if (!validation.success) {
      const errorDetails = validation.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      throw OrderApplicationException.validationError(errorDetails);
    }

    return validation.data;
  }

  private async validateAndGetProducts(
    items: { productId: string; quantity: number }[]
  ): Promise<Map<string, Product>> {
    // Obtener IDs únicos para evitar consultas duplicadas
    const uniqueProductIds = [...new Set(items.map((item) => item.productId))];

    // Consultar productos en paralelo para mejor rendimiento
    const productPromises = uniqueProductIds.map(async (productId) => {
      const product = await this.productRepository.findById(
        new ProductId(productId)
      );
      if (!product) {
        throw ProductDomainException.notFound(productId);
      }
      return { productId, product };
    });

    const productResults = await Promise.all(productPromises);
    const productsMap = new Map<string, Product>();

    // Crear mapa de productos y validar stock
    productResults.forEach(({ productId, product }) => {
      productsMap.set(productId, product);
    });

    // Validar stock para cada item
    this.validateStock(items, productsMap);

    return productsMap;
  }

  private validateStock(
    items: Array<{ productId: string; quantity: number }>,
    productsMap: Map<string, Product>
  ): void {
    for (const item of items) {
      const product = productsMap.get(item.productId)!;

      if (!product.isInStock(item.quantity)) {
        throw ProductDomainException.validationError(
          `Insufficient stock for product ${item.productId}. ` +
            `Available: ${product.getStockQuantity()}, Given: ${item.quantity}`
        );
      }
    }
  }

  private createOrderEntity(
    orderData: CreateOrUpdateOrderWithItemsDTO,
    productsMap: Map<string, Product>
  ): Order {
    const orderItems = this.createOrderItems(orderData, productsMap);

    return new Order({
      id: new OrderId(orderData.id),
      customerId: new CustomerId(orderData.customerId),
      orderNumber: orderData.orderNumber,
      status: orderData.status,
      items: orderItems,
    });
  }

  private createOrderItems(
    orderData: CreateOrUpdateOrderWithItemsDTO,
    productsMap: Map<string, Product>
  ): OrderItem[] {
    return orderData.items.map((item) => {
      const product = productsMap.get(item.productId)!;

      return new OrderItem({
        orderNumber: orderData.orderNumber,
        productId: item.productId,
        quantity: item.quantity,
        price: product.getPrice(),
      });
    });
  }
}
