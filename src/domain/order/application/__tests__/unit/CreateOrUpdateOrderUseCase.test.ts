import { CustomId } from '../../../../../shared/domain/value-objects/CustomId.js';
import { IInventoryService } from '../../../../../shared/services/inventory.service.interface.js';
import { generateUuidV4 } from '../../../../../shared/utils/uuidGenerator.js';
import { IProductRepository } from '../../../../product/domain/IProductRepository.js';
import { Product } from '../../../../product/domain/Product.js';
import { ProductCategory } from '../../../../product/domain/value-objects/ProductCategory.js';
import { IOrderRepository } from '../../../domain/IOrderRepository.js';
import { CreateOrUpdateOrderUseCase } from '../../CreateOrUpdateOrderUseCase.js';
import { CreateOrUpdateOrderDTO } from '../../dtos/CreateOrUpdateOrderDTO.js';
import { OrderEventPublisher } from '../../events/OrderEventPublisher.js';
import { Order } from '../../../domain/Order.js';
import { ProductDomainException } from '../../../../../shared/domain/exceptions/ProductDomainException.js';
import { IUnitOfWork } from '../../../../../shared/domain/IUnitOfWork.js';
import { OrderApplicationException } from '../../exceptions/OrderApplicationException.js';

describe('create order', () => {
  let createOrderUseCase: CreateOrUpdateOrderUseCase;
  let mockOrderRepository: jest.Mocked<IOrderRepository>;
  let mockProductRepository: jest.Mocked<IProductRepository>;
  let mockOrderPublisher: jest.Mocked<OrderEventPublisher>;
  let mockInventoryService: jest.Mocked<IInventoryService>;
  let mockUnitOfWork: jest.Mocked<IUnitOfWork>;

  beforeEach(() => {
    mockOrderRepository = {
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByOrderNumber: jest.fn(),
      save: jest.fn(),
      updateStatus: jest.fn(),
    };
    mockProductRepository = {
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findBySku: jest.fn(),
      save: jest.fn(),
    };
    mockOrderPublisher = {
      publishOrderCreated: jest.fn(),
      initialize: jest.fn(),
      publish: jest.fn(),
      close: jest.fn(),
      channel: null,
    } as unknown as jest.Mocked<OrderEventPublisher>;

    mockInventoryService = {
      checkAvailability: jest.fn(),
    };

    mockUnitOfWork = {
      execute: jest.fn().mockImplementation(async (work) => await work(null)),
    };

    createOrderUseCase = new CreateOrUpdateOrderUseCase(
      mockOrderRepository,
      mockProductRepository,
      mockOrderPublisher,
      mockInventoryService,
      mockUnitOfWork,
    );

    mockOrderPublisher.publishOrderCreated.mockResolvedValue(undefined);
  });

  it('should create an order successfully with valid data', async () => {
    // arrange

    const prod1 = new Product({
      id: new CustomId(generateUuidV4()),
      sku: 'prod-001',
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      category: new ProductCategory('ELECTRONICS'),
    });

    const prod2 = new Product({
      id: new CustomId(generateUuidV4()),
      sku: 'prod-002',
      name: 'Product 2',
      description: 'Description 2',
      price: 200,
      category: new ProductCategory('BOOKS'),
    });

    const item1 = { sku: prod1.getSku(), quantity: 2 };
    const item2 = { sku: prod2.getSku(), quantity: 4 };

    const orderData: CreateOrUpdateOrderDTO = {
      id: generateUuidV4(),
      customerId: generateUuidV4(),
      items: [item1, item2],
      orderNumber: 'ORD-0001',
      status: 'PENDING',
    };

    mockOrderRepository.save.mockResolvedValue(undefined);

    mockProductRepository.findBySku.mockImplementation(async (sku: string) => {
      if (sku === 'prod-001') {
        return prod1;
      }
      if (sku === 'prod-002') {
        return prod2;
      }
      return null;
    });

    mockInventoryService.checkAvailability.mockResolvedValue({
      available: true,
      message: 'Stock available',
    });

    // act
    const result = await createOrderUseCase.execute(orderData);

    // assert

    expect(result).toBe('Order saved successfully');
    const savedOrder = (mockOrderRepository.save as jest.Mock).mock
      .calls[0]?.[0] as Order;

    // order saved
    expect(savedOrder.getOrderNumber()).toBe(orderData.orderNumber);
    expect(savedOrder.getItems()).toHaveLength(2);

    savedOrder.getItems().forEach((item) => {
      const inputItem = orderData.items.find((i) => i.sku === item.getSku())!;
      expect(item.getQuantity()).toBe(inputItem.quantity);
    });

    // Validar que createdAt sea Date y sea reciente (ej. en los últimos 5s)
    const createdAt = savedOrder.getCreatedAt();
    expect(createdAt).toBeInstanceOf(Date);

    // Validar id generada coincide con la entrada
    expect(savedOrder.getId().value).toBe(orderData.id);
    //

    // const eventCreatedArg =
    //   mockOrderPublisher.publishOrderCreated.mock.calls[0][0];
    // expect(eventCreatedArg.orderId).toBe(orderData.id);

    expect(mockOrderPublisher.publishOrderCreated).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: orderData.id,
        products: orderData.items,
      }),
    );

    expect(mockProductRepository.findBySku).toHaveBeenCalledTimes(2);

    expect(mockInventoryService.checkAvailability).toHaveBeenCalledWith(
      orderData.items,
    );
  });

  it('should throw validation error for insufficient stock', async () => {
    // arrange
    const prod1 = new Product({
      id: new CustomId(generateUuidV4()),
      sku: 'prod-001',
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      category: new ProductCategory('ELECTRONICS'),
    });

    const prod2 = new Product({
      id: new CustomId(generateUuidV4()),
      sku: 'prod-002',
      name: 'Product 2',
      description: 'Description 2',
      price: 200,
      category: new ProductCategory('BOOKS'),
    });

    const item1 = { sku: prod1.getSku(), quantity: 2 };
    const item2 = { sku: prod2.getSku(), quantity: 4 };

    const orderData: CreateOrUpdateOrderDTO = {
      id: generateUuidV4(),
      customerId: generateUuidV4(),
      items: [item1, item2],
      orderNumber: 'ORD-0001',
      status: 'PENDING',
    };

    mockOrderRepository.save.mockResolvedValue(undefined);

    mockProductRepository.findBySku.mockImplementation(async (sku: string) => {
      if (sku === 'prod-001') {
        return prod1;
      }
      if (sku === 'prod-002') {
        return prod2;
      }
      return null;
    });

    mockInventoryService.checkAvailability.mockResolvedValue({
      available: false,
      message: '',
    });

    // assert
    await expect(createOrderUseCase.execute(orderData)).rejects.toThrow(
      ProductDomainException,
    );
  });

  it('should throw validation error for invalid order', async () => {
    const orderData: CreateOrUpdateOrderDTO = {
      id: '',
      customerId: '',
      items: [],
      orderNumber: '',
      status: 'PAID',
    };

    mockOrderRepository.save.mockResolvedValue(undefined);
    mockProductRepository.findBySku.mockImplementation(undefined);
    mockOrderPublisher.publishOrderCreated.mockResolvedValue(undefined);
    mockInventoryService.checkAvailability.mockResolvedValue({
      available: true,
      message: 'Stock available',
    });

    const p = createOrderUseCase.execute(orderData);
    const err = (await p.catch((e) => e)) as Error;

    expect(err).toBeInstanceOf(OrderApplicationException);
    expect(err.message).toMatch(/invalid/i);
    expect(err.message).toMatch(/id:/i);
    expect(err.message).toMatch(/customerId:/i);
    expect(err.message).toMatch(/orderNumber:/i);
    expect(err.message).toMatch(/items:/i);
  });

  it('should throw not found error for non existing product', async () => {
    const prod1 = new Product({
      id: new CustomId(generateUuidV4()),
      sku: 'prod-001',
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      category: new ProductCategory('ELECTRONICS'),
    });

    const item1 = { sku: prod1.getSku(), quantity: 2 };

    const orderData: CreateOrUpdateOrderDTO = {
      id: generateUuidV4(),
      customerId: generateUuidV4(),
      items: [item1],
      orderNumber: 'ORD-0001',
      status: 'PENDING',
    };

    mockProductRepository.findBySku.mockResolvedValue(null);

    const p = createOrderUseCase.execute(orderData);

    const err = (await p.catch((e) => e)) as Error;

    expect(err).toBeInstanceOf(ProductDomainException);
    expect(err.message).toMatch(/not found/i);
  });
});
