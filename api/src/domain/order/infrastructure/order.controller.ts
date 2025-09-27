import { Request, Response, NextFunction } from "express";
import { CreateOrUpdateOrderWithItemsUseCase } from "../application/CreateOrUpdateOrderWithItemsUseCase .js";
import { GetAllOrdersUseCase } from "../application/GetAllOrdersUseCase.js";
import { GetOrderByIdUseCase } from "../application/GetOrderByIdUseCase.js";
import { OrderId } from "../domain/value-objects/OrderId.js";

export class OrderController {
  constructor(
    private readonly createOrUpdateOrderWithItemsUseCase: CreateOrUpdateOrderWithItemsUseCase,
    private readonly getAllOrdersUseCase: GetAllOrdersUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase
  ) {}

  public CreateOrUpdateOrderWithItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = req.body;
    const result = await this.createOrUpdateOrderWithItemsUseCase.execute(data);
    return res.status(200).json(result);
  };

  public getAllOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = await this.getAllOrdersUseCase.execute();
    return res.status(200).json(result);
  };

  public getOrderById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    const result = await this.getOrderByIdUseCase.execute(new OrderId(id));
    return res.status(200).json(result);
  };
}
