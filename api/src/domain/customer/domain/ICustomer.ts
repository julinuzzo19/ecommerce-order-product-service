import { Address } from "../../../shared/value-objects/Address.js";
import { Email } from "../../../shared/value-objects/Email.js";
import { CustomerId } from "./value-objects/CustomerId.js";

export interface ICustomer {
  getId(): CustomerId;
  getName(): string;
  getEmail(): Email;
  getAddress(): Address;
  getCreatedAt(): Date;
  getIsActive(): boolean;
  getPhoneNumber(): string;

  updateAddress(newAddress: Address): void;
  deactivate(): void;
  activate(): void;
  updatePhoneNumber(newPhoneNumber: string): void;
  updateEmail(newEmail: Email): void;
  updateName(newName: string): void;
}
