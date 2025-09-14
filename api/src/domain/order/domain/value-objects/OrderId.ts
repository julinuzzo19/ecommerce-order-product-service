import {
  validate as uuidValidate,
  version as uuidVersion,
  v4 as uuidv4,
} from "uuid";
import { OrderError } from "../errors/OrderError";

export class OrderId {
  public readonly value: string;

  constructor(value: string) {
    if (!uuidValidate(value) || uuidVersion(value) !== 4) {
      throw new OrderError("The order ID format is not valid (UUIDv4).");
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
