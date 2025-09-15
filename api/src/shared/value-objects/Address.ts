import { ValidationError } from "../errors/ValidationError.js";

export class Address {
  constructor(
    private street: string,
    private city: string,
    private state: string,
    private zipCode: string,
    private country: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.street || this.street.trim().length < 5) {
      throw new ValidationError("Street must be at least 5 characters");
    }
    if (!this.city || this.city.trim().length < 2) {
      throw new ValidationError("City must be at least 2 characters");
    }
    if (!this.zipCode) {
      throw new ValidationError("Zip code is required");
    }
  }

  public getFullAddress(): string {
    return `${this.street}, ${this.city}, ${this.state} ${this.zipCode}, ${this.country}`;
  }

  public getStreet(): string {
    return this.street;
  }
  public getCity(): string {
    return this.city;
  }
  public getState(): string {
    return this.state;
  }
  public getZipCode(): string {
    return this.zipCode;
  }
  public getCountry(): string {
    return this.country;
  }
}
