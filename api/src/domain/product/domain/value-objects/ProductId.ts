import { ProductError } from "../errors/ProductError";
import {
  validate as uuidValidate,
  version as uuidVersion,
  v4 as uuidv4,
} from "uuid";

export class ProductId {
  public readonly value: string;

  constructor(value: string) {
    if (!uuidValidate(value) || uuidVersion(value) !== 4) {
      throw new ProductError("The customer ID format is not valid (UUIDv4).");
    }
    this.value = value;
  }

  public static create(): ProductId {
    return new ProductId(uuidv4());
  }

  public equals(other: ProductId): boolean {
    return this.value === other.value;
  }
}
