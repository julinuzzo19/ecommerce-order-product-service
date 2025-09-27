import { Router } from "express";
import { CreateCustomerUseCase } from "../application/CreateCustomerUseCase.js";
import { CustomerPrismaRepository } from "./repository/customerPrismaRepository.js";
import { prisma } from "../../../shared/infrastructure/db/prisma/prisma.client.js";
import { CustomerController } from "./customer.controller.js";
import { GetCustomersUseCase } from "../application/GetCustomersUseCase.js";

const route = Router();
// /**
//  * Iniciar Repository
//  */
const customerRepository = new CustomerPrismaRepository(prisma);

// /**
//  * Iniciamos casos de uso
//  */

const customerCreateUseCase = new CreateCustomerUseCase(customerRepository);
const getCustomersUseCase = new GetCustomersUseCase(customerRepository);

// /**
//  * Iniciar User Controller
//  */

const customerCtrl = new CustomerController(
  customerCreateUseCase,
  getCustomersUseCase
);

// /**
//  * Mapping routes to controller methods
//  */

route.post(`/`, customerCtrl.createCustomer);
route.get(`/`, customerCtrl.getCustomers);

export default route;
