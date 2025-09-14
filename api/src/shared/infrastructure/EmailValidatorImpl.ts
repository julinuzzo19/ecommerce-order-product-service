import { IEmailValidator } from "../value-objects/IEmailValidator";
import { z } from "zod";

export class EmailValidatorImpl implements IEmailValidator {
  isValid(email: string): boolean {
    const emailSchema = z.email();
    const result = emailSchema.safeParse(email);
    return result.success;
  }
}
