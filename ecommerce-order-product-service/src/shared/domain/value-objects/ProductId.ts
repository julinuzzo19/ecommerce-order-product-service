import {
  validate as uuidValidate,
  version as uuidVersion,
  v4 as uuidv4,
} from "uuid";
import { ValueObjectException } from "../exceptions/ValidationError.js";

export class ProductId {
  public readonly value: string;

  constructor(value: string) {
    if (!uuidValidate(value) || uuidVersion(value) !== 4) {
      throw ValueObjectException.validationError(
        "The product ID format is not valid."
      );
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
