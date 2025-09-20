import { Request, Response } from "express";
import { CreateOrUpdateOrderWithItemsUseCase } from "../application/CreateOrUpdateOrderWithItemsUseCase .js";

export class OrderController {
  constructor(
    private readonly createOrUpdateOrderWithItemsUseCase: CreateOrUpdateOrderWithItemsUseCase
  ) {}

  public CreateOrUpdateOrderWithItemsUseCase = async (
    req: Request,
    res: Response
  ) => {
    const data = req.body;
    const customer = await this.createOrUpdateOrderWithItemsUseCase.execute(
      data
    );
    return res.status(200).json(customer);
  };
}
