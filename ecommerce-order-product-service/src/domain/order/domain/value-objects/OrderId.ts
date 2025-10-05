import {
  validate as uuidValidate,
  version as uuidVersion,
  v4 as uuidv4,
} from "uuid";
import { OrderDomainException } from "../../exceptions/OrderDomainException.js";

export class OrderId {
  public readonly value: string;

  constructor(value: string) {
    if (!uuidValidate(value) || uuidVersion(value) !== 4) {
      throw OrderDomainException.validationError(
        "The order ID format is not valid (UUIDv4)."
      );
    }
    this.value = value;
  }

  public static create(): OrderId {
    return new OrderId(uuidv4());
  }

  public equals(other: OrderId): boolean {
    return this.value === other.value;
  }
}
