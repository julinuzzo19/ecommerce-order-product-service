import { Email } from "../../../shared/value-objects/Email.js";
import { Address } from "../../../shared/value-objects/Address.js";
import { CustomerId } from "./value-objects/CustomerId.js";
import { ICustomer } from "./ICustomer.js";

export class Customer implements ICustomer {
  constructor(
    private id: CustomerId,
    private name: string,
    private email: Email,
    private address: Address,
    private createdAt: Date = new Date(),
    private isActive: boolean = true,
    private phoneNumber: string
  ) {}

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
  public getId(): CustomerId {
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

  public getPhoneNumber(): string {
    return this.phoneNumber;
  }
}
