import { Request, Response, NextFunction } from "express";
import { CreateOrUpdateOrderUseCase } from "../application/CreateOrUpdateOrderUseCase.js";
import { GetAllOrdersUseCase } from "../application/GetAllOrdersUseCase.js";
import { GetOrderByIdUseCase } from "../application/GetOrderByIdUseCase.js";
import { CustomId } from "../../../shared/domain/value-objects/CustomId.js";

export class OrderController {
  constructor(
    private readonly createOrUpdateOrderWithItemsUseCase: CreateOrUpdateOrderUseCase,
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
    const userRole = req.headers["x-user-role"];
    const userEmail = req.headers["x-user-email"];
    const userId = req.headers["x-user-id"];
    const gatewaySignature = req.headers["x-gateway-secret"];
    const requestId = req.headers["x-request-id"];

    // console.log({
    //   userRole,
    //   userEmail,
    //   userId,
    //   gatewaySignature,
    //   requestId,
    // });

    const result = await this.getAllOrdersUseCase.execute();
    return res.status(200).json(result);
  };

  public getOrderById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    const result = await this.getOrderByIdUseCase.execute(id);
    return res.status(200).json(result);
  };
}
