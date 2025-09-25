import { ValueObjectException } from "../exceptions/ValidationError.js";

interface AddressProps {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  createdAt?: Date;
}

export class Address {
  private street: string;
  private city: string;
  private state: string;
  private zipCode: string;
  private country: string;
  private createdAt: Date;

  constructor(private props: AddressProps) {
    this.street = props.street;
    this.city = props.city;
    this.state = props.state;
    this.zipCode = props.zipCode;
    this.country = props.country;
    this.createdAt = props.createdAt ?? new Date();

    this.validate();
  }

  private validate(): void {
    if (!this.props.street || this.props.street.trim().length < 5) {
      throw ValueObjectException.validationError(
        "Street must be at least 5 characters"
      );
    }
    if (!this.props.city || this.props.city.trim().length < 2) {
      throw ValueObjectException.validationError(
        "City must be at least 2 characters"
      );
    }
    if (!this.props.zipCode) {
      throw ValueObjectException.validationError("Zip code is required");
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
  public getCreatedAt(): Date {
    return this.createdAt;
  }
}
