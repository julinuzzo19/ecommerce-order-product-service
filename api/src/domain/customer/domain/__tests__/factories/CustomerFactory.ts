import { AddressFactory } from "../../../../../shared/domain/__tests__/factories/AddressFactory.js";
import { Address } from "../../../../../shared/domain/value-objects/Address.js";
import { CustomerId } from "../../../../../shared/domain/value-objects/CustomerId.js";
import { Email } from "../../../../../shared/domain/value-objects/Email.js";
import { generateUuidV4 } from "../../../../../shared/utils/uuidGenerator.js";
import { Customer } from "../../Customer.js";

export class CustomerFactory {
  private id = generateUuidV4();
  private name = "John Doe";
  private email = "john.doe@example.com";
  private addressFactory = AddressFactory.create();
  private phoneNumber = "555-1234";
  private createdAt = new Date();
  private isActive = true;

  static create(): CustomerFactory {
    return new CustomerFactory();
  }

  withId(id: string): CustomerFactory {
    this.id = id;
    return this;
  }

  withName(name: string): CustomerFactory {
    this.name = name;
    return this;
  }

  withEmail(email: string): CustomerFactory {
    this.email = email;
    return this;
  }

  withPhoneNumber(phoneNumber: string): CustomerFactory {
    this.phoneNumber = phoneNumber;
    return this;
  }

  withCreatedAt(createdAt: Date): CustomerFactory {
    this.createdAt = createdAt;
    return this;
  }

  inactive(): CustomerFactory {
    this.isActive = false;
    return this;
  }

  argentinianCustomer(): CustomerFactory {
    this.name = "Juan Pérez";
    this.email = "juan.perez@gmail.com";
    this.phoneNumber = "+54-11-1234-5678";
    this.addressFactory = AddressFactory.create().argentina();
    return this;
  }

  withInvalidEmail(): CustomerFactory {
    this.email = "invalid-email";
    return this;
  }

  withAddress(addressFactory: AddressFactory): CustomerFactory {
    this.addressFactory = addressFactory;
    return this;
  }

  build(): Customer {
    return new Customer({
      id: new CustomerId(this.id),
      name: this.name,
      email: new Email(this.email),
      address: this.addressFactory.build(),
      phoneNumber: this.phoneNumber,
      createdAt: this.createdAt,
      isActive: this.isActive,
    });
  }

  // Helpers para tests específicos
  buildId(): CustomerId {
    return new CustomerId(this.id);
  }

  buildEmail(): Email {
    return new Email(this.email);
  }

  buildAddress(): Address {
    return this.addressFactory.build();
  }
}
