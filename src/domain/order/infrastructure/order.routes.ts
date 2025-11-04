import { Router } from "express";
import { OrderController } from "./order.controller.js";
import { OrderPrismaRepository } from "./repository/orderPrismaRepository.js";
import { prisma } from "../../../shared/infrastructure/db/prisma/prisma.client.js";
import { CreateOrUpdateOrderUseCase } from "../application/CreateOrUpdateOrderUseCase.js";
import { ProductPrismaRepository } from "../../product/infrastructure/repository/productPrismaRepository.js";
import { GetAllOrdersUseCase } from "../application/GetAllOrdersUseCase.js";
import { GetOrderByIdUseCase } from "../application/GetOrderByIdUseCase.js";
import { OrderEventPublisher } from "../application/events/OrderEventPublisher.js";
import { InventoryHttpService } from "../../../shared/infrastructure/external-services/inventory/inventory.http.service.js";
import { PrismaUnitOfWork } from "../../../shared/infrastructure/database/PrismaUnitOfWork.js";

/**
 * Configura las rutas del dominio Order.
 * Recibe el publisher inicializado para inyectarlo en los casos de uso.
 */
export default (orderPublisher: OrderEventPublisher) => {
  const route = Router();

  const orderRepository = new OrderPrismaRepository(prisma);
  const productRepository = new ProductPrismaRepository(prisma);

  // external services
  const inventoryService = new InventoryHttpService();

  // Unit of Work
  const unitOfWork = new PrismaUnitOfWork(prisma);

  const createOrUpdateOrderWithItemsUseCase =
    new CreateOrUpdateOrderUseCase(
      orderRepository,
      productRepository,
      orderPublisher,
      inventoryService,
      unitOfWork
    );

  const getAllOrdersUseCase = new GetAllOrdersUseCase(orderRepository);
  const getOrderByIdUseCase = new GetOrderByIdUseCase(orderRepository);

  const orderCtrl = new OrderController(
    createOrUpdateOrderWithItemsUseCase,
    getAllOrdersUseCase,
    getOrderByIdUseCase
  );

  route.post(`/`, orderCtrl.CreateOrUpdateOrderWithItem);
  route.get(`/`, orderCtrl.getAllOrders);
  route.get(`/:id`, orderCtrl.getOrderById);

  return route;
};
