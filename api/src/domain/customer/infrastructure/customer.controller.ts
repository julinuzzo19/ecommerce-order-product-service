import { Request, Response } from "express";
import { CreateCustomerUseCase } from "../application/CreateCustomerUseCase.js";
import { GetCustomersUseCase } from "../application/GetCustomersUseCase.js";

export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getCustomersUseCase: GetCustomersUseCase
  ) {}

  public createCustomer = async (req: Request, res: Response) => {
    const data = req.body;
    const customer = await this.createCustomerUseCase.execute(data);
    res.status(201).json(customer);
  };
  public getCustomers = async (req: Request, res: Response) => {
    const customers = await this.getCustomersUseCase.execute();
    res.status(200).json(customers);
  };
}
