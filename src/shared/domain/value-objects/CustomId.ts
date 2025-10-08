import {
  validate as uuidValidate,
  version as uuidVersion,
  v4 as uuidv4,
} from "uuid";
import { ValueObjectException } from "../exceptions/ValidationError.js";

export class CustomId {
  public readonly value: string;

  constructor(value: string) {
    if (!uuidValidate(value) || uuidVersion(value) !== 4) {
      throw ValueObjectException.validationError(
        "The customer ID format is not valid (UUIDv4)."
      );
    }
    this.value = value;
  }

  public static create(): CustomId {
    return new CustomId(uuidv4());
  }

  public equals(other: CustomId): boolean {
    return this.value === other.value;
  }
}
