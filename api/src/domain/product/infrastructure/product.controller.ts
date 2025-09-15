import { Request, Response } from "express";
import { CreateProductUseCase } from "../application/CreateProductUseCase.js";
import { GetProductsUseCase } from "../application/GetProductsUseCase.js";

export class ProductController {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private getProductsUseCase: GetProductsUseCase
  ) {}

  // Usar arrow function para fijar `this` cuando se pase como handler a Express
  public createProduct = async (req: Request, res: Response) => {
    const data = req.body;
    const product = await this.createProductUseCase.execute(data);
    res.status(201).json(product);
  };

  public getProducts = async (req: Request, res: Response) => {
    const products = await this.getProductsUseCase.execute();
    res.status(200).json(products);
  };
}
