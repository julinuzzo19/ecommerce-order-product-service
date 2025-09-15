import { ValidationError } from "../errors/ValidationError.js";
import { IEmailValidator } from "./IEmailValidator.js";

export class Email {
  constructor(
    private readonly value: string,
    private readonly validator: IEmailValidator
  ) {
    if (!this.validator.isValid(value)) {
      throw new ValidationError("Invalid email format");
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    return this.value === other.getValue();
  }
}
