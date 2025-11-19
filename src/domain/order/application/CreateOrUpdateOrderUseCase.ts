import { IOrderRepository } from '../domain/IOrderRepository.js';
import { IProductRepository } from '../../product/domain/IProductRepository.js';
import { CreateOrUpdateOrderSchema } from './CreateOrUpdateOrderSchema.js';
import { CreateOrUpdateOrderDTO } from './dtos/CreateOrUpdateOrderDTO.js';
import { Order } from '../domain/Order.js';
import { OrderItem } from '../domain/OrderItem.js';
import { Product } from '../../product/domain/Product.js';
import { ProductDomainException } from '../../../shared/domain/exceptions/ProductDomainException.js';
import { CustomId } from '../../../shared/domain/value-objects/CustomId.js';
import { OrderDomainException } from '../exceptions/OrderDomainException.js';
import { OrderApplicationException } from './exceptions/OrderApplicationException.js';
import { OrderEventPublisher } from './events/OrderEventPublisher.js';
import { IInventoryService } from '../../../shared/services/inventory.service.interface.js';
import { IUnitOfWork } from '../../../shared/domain/IUnitOfWork.js';
import { ROUTING_KEYS } from '../../../shared/application/events/types/events.js';

export class CreateOrUpdateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository,
    private readonly orderPublisher: OrderEventPublisher,
    private readonly inventoryService: IInventoryService,
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  public async execute(data: CreateOrUpdateOrderDTO): Promise<string> {
    try {
      // 1. Validar entrada
      const validatedData = this.validateInput(data);

      // 2. Obtener y validar productos ANTES de la transacción (solo lectura)
      const productsData = await this.validateAndGetProducts(
        validatedData.items,
      );

      // 3. Validar stock antes de iniciar transacción (servicio externo)
      await this.validateStock(validatedData.items);

      // Crear entidad Order
      const order = this.createOrderEntity(validatedData, productsData);

      // 4. Ejecutar operaciones de escritura dentro de transacción
      await this.unitOfWork.execute(async (tx) => {
        // Persistir dentro de la transacción
        await this.orderRepository.save(order, tx);

        // 5. Publicar evento
        await this.orderPublisher.publishOrderCreated({
          type: ROUTING_KEYS.ORDER_CREATED,
          orderId: validatedData.id,
          createdAt: new Date().toISOString(),
          products: validatedData.items.map((item) => ({
            sku: item.sku,
            quantity: item.quantity,
          })),
        });
      });

      return 'Order saved successfully';
    } catch (error) {
      if (
        error instanceof OrderDomainException ||
        error instanceof OrderApplicationException ||
        error instanceof ProductDomainException
      ) {
        throw error;
      }
      throw OrderApplicationException.useCaseError(
        'creating or updating order with items',
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  private validateInput(data: CreateOrUpdateOrderDTO): CreateOrUpdateOrderDTO {
    const validation = CreateOrUpdateOrderSchema.safeParse(data);

    if (!validation.success) {
      const errorDetails = validation.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw OrderApplicationException.validationError(errorDetails);
    }

    return validation.data;
  }

  private async validateAndGetProducts(
    items: { sku: string; quantity: number }[],
  ): Promise<Map<string, Product>> {
    // Obtener IDs únicos para evitar consultas duplicadas
    const uniqueSkus = [...new Set(items.map((item) => item.sku))];

    // Consultar productos en paralelo para mejor rendimiento
    const productPromises = uniqueSkus.map(async (sku) => {
      const product = await this.productRepository.findBySku(sku);
      if (!product) {
        throw ProductDomainException.notFound(sku);
      }
      return { sku, product };
    });

    const productResults = await Promise.all(productPromises);
    const productsMap = new Map<string, Product>();

    // Crear mapa de productos
    productResults.forEach(({ sku, product }) => {
      productsMap.set(sku, product);
    });

    return productsMap;
  }

  private async validateStock(
    items: Array<{ sku: string; quantity: number }>,
  ): Promise<void> {
    const stockResult = await this.inventoryService.checkAvailability(items);

    if (!stockResult?.available) {
      throw ProductDomainException.validationError(stockResult.message);
    }
  }

  private createOrderEntity(
    orderData: CreateOrUpdateOrderDTO,
    productsMap: Map<string, Product>,
  ): Order {
    const orderItems = this.createOrderItems(orderData, productsMap);

    return new Order({
      id: new CustomId(orderData.id),
      customerId: new CustomId(orderData.customerId),
      orderNumber: orderData.orderNumber,
      status: orderData.status,
      items: orderItems,
    });
  }

  private createOrderItems(
    orderData: CreateOrUpdateOrderDTO,
    productsMap: Map<string, Product>,
  ): OrderItem[] {
    return orderData.items.map((item) => {
      const product = productsMap.get(item.sku)!;

      return new OrderItem({
        orderNumber: orderData.orderNumber,
        sku: item.sku,
        quantity: item.quantity,
        price: product.getPrice(),
      });
    });
  }
}
