import { z } from "zod";
import { IEmailValidator } from "../domain/value-objects/IEmailValidator.js";

export class EmailValidatorImpl implements IEmailValidator {
  isValid(email: string): boolean {
    const emailSchema = z.email();
    const result = emailSchema.safeParse(email);
    return result.success;
  }
}
