import { ICustomerRepository } from "../domain/ICustomerRepository.js";
import { createCustomerSchema } from "./createCustomerSchema.js";
import { CreateCustomerDTO } from "./dtos/CreateCustomerDTO.js";
import { Customer } from "../domain/Customer.js";
import { CustomerResponseDTO } from "./dtos/CustomerResponseDTO.js";
import { genericMapToDTO } from "../../../shared/utils/genericMapper.js";
import { Email } from "../../../shared/domain/value-objects/Email.js";
import { Address } from "../../../shared/domain/value-objects/Address.js";
import { CustomerId } from "../../../shared/domain/value-objects/CustomerId.js";
import { CustomerDomainException } from "../domain/exceptions/CustomerDomainException.js";
import { CustomerApplicationExceptions } from "./exceptions/CustomerApplicationExceptions.js";

export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  // Implement the logic to create a customer
  public execute = async (data: CreateCustomerDTO) => {
    try {
      // Validate and transform the incoming data
      const validation = createCustomerSchema.safeParse(data);

      console.log(validation, data);
      if (!validation.success) {
        const errorDetails = validation.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");
        throw CustomerApplicationExceptions.validationError(errorDetails);
      }

      const customer = this.mapToEntity(validation.data);

      await this.customerRepository.save(customer);

      return this.mapToDTO(customer);
    } catch (error) {
      if (
        error instanceof CustomerDomainException ||
        error instanceof CustomerApplicationExceptions
      ) {
        throw error;
      }
      throw CustomerApplicationExceptions.useCaseError(
        "creating customer",
        error instanceof Error ? error.message : String(error)
      );
    }
  };

  private mapToEntity(customer: CreateCustomerDTO): Customer {
    const customerId = new CustomerId(customer.id);

    return new Customer({
      id: customerId,
      name: customer.name,
      email: new Email(customer.email),
      address: new Address(customer.address),
      phoneNumber: customer.phoneNumber,
    });
  }

  private mapToDTO(customer: Customer): CustomerResponseDTO {
    return genericMapToDTO<Customer, CustomerResponseDTO>(customer, {
      id: (entity) => entity.getId().value,
      email: (entity) => entity.getEmail().getValue(),
      name: (entity) => entity.getName(),
      phoneNumber: (entity) => entity.getPhoneNumber() || "",
      address: (entity) => {
        const addressData = entity.getAddress();
        return {
          city: addressData.getCity(),
          country: addressData.getCountry(),
          state: addressData.getState(),
          street: addressData.getStreet(),
          zipCode: addressData.getZipCode(),
        };
      },
    });
  }
}
