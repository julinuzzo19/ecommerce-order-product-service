import { z } from "zod";
import { InfrastructureException } from "../../infrastructure/exceptions/InfrastructureException.js";

export class EmailValidator {
  static isValid(email: string): boolean {
    if (!email || email.trim().length === 0) {
      return false;
    }

    return z.email().safeParse(email).success;
  }

  static validate(email: string): void {
    if (!this.isValid(email)) {
      throw InfrastructureException.validationError(
        "email",
        "Invalid email format"
      );
    }
  }
}
