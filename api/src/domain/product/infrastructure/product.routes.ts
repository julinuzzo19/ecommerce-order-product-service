import { Router } from "express";
import { ProductPrismaRepository } from "./repository/productPrismaRepository.js";
import { prisma } from "../../../shared/infrastructure/db/prisma/prisma.client.js";
import { CreateProductUseCase } from "../application/CreateProductUseCase.js";
import { ProductController } from "./product.controller.js";
import { GetProductsUseCase } from "../application/GetProductsUseCase.js";

// import { UserUseCase } from "../../application/userUseCase";
// import { UserController } from "../controller/user.ctrl";
// import { MockRepository } from "../repository/mock.repository";
// import { MongoRepository } from "../repository/mongo.repository";

const route = Router();
// /**
//  * Iniciar Repository
//  */
const productRepo = new ProductPrismaRepository(prisma);
// const userRepo = new MongoRepository();

// /**
//  * Iniciamos casos de uso
//  */

// const userUseCase = new UserUseCase(userRepo);
const createProductUseCase = new CreateProductUseCase(productRepo);
const getProductsUseCase = new GetProductsUseCase(productRepo);

// /**
//  * Iniciar User Controller
//  */

// const userCtrl = new UserController(userUseCase);
const productCtrl = new ProductController(
  createProductUseCase,
  getProductsUseCase
);

// /**
//  *
//  */

route.post(`/`, productCtrl.createProduct);
route.get(`/`, productCtrl.getProducts);

export default route;
