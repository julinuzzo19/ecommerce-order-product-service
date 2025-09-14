import { Address } from "../../../shared/value-objects/Address";
import { Email } from "../../../shared/value-objects/Email";
import { CustomerId } from "./value-objects/CustomerId";

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
