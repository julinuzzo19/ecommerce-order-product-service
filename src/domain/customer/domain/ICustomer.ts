import { Address } from "../../../shared/domain/value-objects/Address.js";
import { CustomId } from "../../../shared/domain/value-objects/CustomId.js";
import { Email } from "../../../shared/domain/value-objects/Email.js";

export interface ICustomer {
  getId(): CustomId;
  getName(): string;
  getEmail(): Email;
  getAddress(): Address;
  getCreatedAt(): Date;
  getIsActive(): boolean;
  getPhoneNumber(): string | undefined;

  updateAddress(newAddress: Address): void;
  deactivate(): void;
  activate(): void;
  updatePhoneNumber(newPhoneNumber: string): void;
  updateEmail(newEmail: Email): void;
  updateName(newName: string): void;
}
