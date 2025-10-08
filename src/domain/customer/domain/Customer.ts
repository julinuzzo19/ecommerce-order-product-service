import { Address } from "../../../shared/domain/value-objects/Address.js";
import { CustomId } from "../../../shared/domain/value-objects/CustomId.js";
import { Email } from "../../../shared/domain/value-objects/Email.js";
import { CustomerDomainException } from "./exceptions/CustomerDomainException.js";
import { ICustomer } from "./ICustomer.js";

interface CustomerProps {
  id: CustomId;
  name: string;
  email: Email;
  address: Address;
  phoneNumber?: string;
  createdAt?: Date;
  isActive?: boolean;
}

export class Customer implements ICustomer {
  private id: CustomId;
  private name: string;
  private email: Email;
  private address: Address;
  private phoneNumber?: string;
  private createdAt: Date;
  private isActive: boolean;

  constructor(private props: CustomerProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.address = props.address;
    this.phoneNumber = props.phoneNumber;
    this.createdAt = props.createdAt ?? new Date();
    this.isActive = props.isActive ?? true;

    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length < 2) {
      throw CustomerDomainException.validationError(
        `Invalid name for customer`
      );
    }
  }

  public updateAddress(newAddress: Address): void {
    this.address = newAddress;
  }

  public deactivate(): void {
    this.isActive = false;
  }

  public activate(): void {
    this.isActive = true;
  }

  public updatePhoneNumber(newPhoneNumber: string): void {
    this.phoneNumber = newPhoneNumber;
  }

  public updateEmail(newEmail: Email): void {
    this.email = newEmail;
  }

  public updateName(newName: string): void {
    this.name = newName;
  }

  // Getters
  public getId(): CustomId {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): Email {
    return this.email;
  }

  public getAddress(): Address {
    return this.address;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getPhoneNumber(): string | undefined {
    return this.phoneNumber;
  }
}
