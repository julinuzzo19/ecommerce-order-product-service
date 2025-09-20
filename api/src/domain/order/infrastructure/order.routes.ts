import { Router } from "express";
import { OrderController } from "./order.controller.js";
import { OrderPrismaRepository } from "./repository/orderPrismaRepository.js";
import { prisma } from "../../../shared/infrastructure/db/prisma/prisma.client.js";
import { CreateOrUpdateOrderWithItemsUseCase } from "../application/CreateOrUpdateOrderWithItemsUseCase .js";
import { ProductPrismaRepository } from "../../product/infrastructure/repository/productPrismaRepository.js";

const route = Router();
// /**
//  * Iniciar Repository
//  */
const orderRepository = new OrderPrismaRepository(prisma);
const productRepository = new ProductPrismaRepository(prisma);

// /**
//  * Iniciamos casos de uso
//  */

const createOrUpdateOrderWithItemsUseCase =
  new CreateOrUpdateOrderWithItemsUseCase(orderRepository, productRepository);

// /**
//  * Iniciar User Controller
//  */

const orderCtrl = new OrderController(createOrUpdateOrderWithItemsUseCase);

// /**
//  * Mapping routes to controller methods
//  */

route.post(`/`, orderCtrl.CreateOrUpdateOrderWithItemsUseCase);

export default route;
