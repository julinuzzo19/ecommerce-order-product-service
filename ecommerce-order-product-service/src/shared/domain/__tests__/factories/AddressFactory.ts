import { Address } from "../../value-objects/Address.js";

export class AddressFactory {
  private street = "123 Main Street";
  private city = "New York";
  private state = "NY";
  private zipCode = "10001";
  private country = "US";

  static create(): AddressFactory {
    return new AddressFactory();
  }

  withStreet(street: string): AddressFactory {
    this.street = street;
    return this;
  }

  withCity(city: string): AddressFactory {
    this.city = city;
    return this;
  }

  withState(state: string): AddressFactory {
    this.state = state;
    return this;
  }

  withZipCode(zipCode: string): AddressFactory {
    this.zipCode = zipCode;
    return this;
  }

  withCountry(country: string): AddressFactory {
    this.country = country;
    return this;
  }

  // Scenarios
  argentina(): AddressFactory {
    this.street = "Av. Corrientes 1234";
    this.city = "Buenos Aires";
    this.state = "CABA";
    this.zipCode = "1043";
    this.country = "AR";
    return this;
  }

  invalidZipCode(): AddressFactory {
    this.zipCode = "";
    return this;
  }

  invalidCountry(): AddressFactory {
    this.country = "INVALID";
    return this;
  }

  withAddress(address: Address): AddressFactory {
    this.street = address.getStreet();
    this.city = address.getCity();
    this.state = address.getState();
    this.zipCode = address.getZipCode();
    this.country = address.getCountry();
    return this;
  }

  build(): Address {
    return new Address({
      city: this.city,
      country: this.country,
      state: this.state,
      street: this.street,
      zipCode: this.zipCode,
    });
  }
}
