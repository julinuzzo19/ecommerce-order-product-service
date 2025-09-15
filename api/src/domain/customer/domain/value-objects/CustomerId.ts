import {
  validate as uuidValidate,
  version as uuidVersion,
  v4 as uuidv4,
} from "uuid";
import { CustomerError } from "../errors/CustomerError.js";

export class CustomerId {
  public readonly value: string;

  constructor(value: string) {
    if (!uuidValidate(value) || uuidVersion(value) !== 4) {
      throw new CustomerError("The customer ID format is not valid (UUIDv4).");
    }
    this.value = value;
  }

  public static create(): CustomerId {
    return new CustomerId(uuidv4());
  }

  public equals(other: CustomerId): boolean {
    return this.value === other.value;
  }
}
