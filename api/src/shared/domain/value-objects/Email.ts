import { z } from "zod";
import { ValueObjectException } from "../exceptions/ValidationError.js";

export class Email {
  private static readonly emailSchema = z.email();

  constructor(private readonly value: string) {
    const result = Email.emailSchema.safeParse(value);

    if (!result.success) {
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
