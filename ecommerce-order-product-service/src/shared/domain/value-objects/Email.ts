import { ValueObjectException } from "../exceptions/ValidationError.js";
import { EmailValidator } from "./EmailValidator.js";

export class Email {
  constructor(private readonly value: string) {
    const isValid = EmailValidator.isValid(value);

    if (!isValid) {
      throw ValueObjectException.validationError("Invalid email format");
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    return this.value === other.getValue();
  }
}
