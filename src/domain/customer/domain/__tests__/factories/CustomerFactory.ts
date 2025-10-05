import { AddressFactory } from "../../../../../shared/domain/__tests__/factories/AddressFactory.js";
import { Address } from "../../../../../shared/domain/value-objects/Address.js";
import { CustomerId } from "../../../../../shared/domain/value-objects/CustomerId.js";
import { Email } from "../../../../../shared/domain/value-objects/Email.js";
import { generateUuidV4 } from "../../../../../shared/utils/uuidGenerator.js";
import { Customer } from "../../Customer.js";

export interface CustomerFixture {
  id?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt?: Date;
  isActive?: boolean;
}

export class CustomerFactory {
  private id: string;
  private name: string;
  private email: string;
  private addressFactory: AddressFactory;
  private phoneNumber: string;
  private createdAt: Date;
  private isActive: boolean;

  constructor(fixture?: CustomerFixture) {
    this.id = fixture?.id || generateUuidV4();
    this.name = fixture?.name || "John Doe";
    this.email = fixture?.email || "john.doe@example.com";
    this.addressFactory = fixture?.address
      ? AddressFactory.create()
          .withStreet(fixture.address.street)
          .withCity(fixture.address.city)
          .withState(fixture.address.state)
          .withZipCode(fixture.address.zipCode)
          .withCountry(fixture.address.country)
      : AddressFactory.create();
    this.phoneNumber = fixture?.phoneNumber || "555-1234";
    this.createdAt = fixture?.createdAt || new Date();
    this.isActive = fixture?.isActive ?? true;
  }

  static create(fixture?: CustomerFixture): CustomerFactory {
    return new CustomerFactory(fixture);
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

  /**
   * Replace the default AddressFactory with a custom one
   * @param addressFactory
   * @returns
   */
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
