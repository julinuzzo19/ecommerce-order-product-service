import { CustomerError } from "../domain/errors/CustomerError.js";
import { ICustomerRepository } from "../domain/ICustomerRepository.js";
import { createCustomerSchema } from "./createCustomerSchema.js";
import { CreateCustomerDTO } from "./dtos/CreateCustomerDTO.js";
import { Customer } from "../domain/Customer.js";
import { CustomerId } from "../domain/value-objects/CustomerId.js";
import { Email } from "../../../shared/value-objects/Email.js";
import { Address } from "../../../shared/value-objects/Address.js";
import { IEmailValidator } from "../../../shared/value-objects/IEmailValidator.js";
import { CustomerResponseDTO } from "./dtos/CustomerResponseDTO.js";
import { genericMapToDTO } from "../../../shared/utils/genericMapper.js";

export class CreateCustomerUseCase {
  constructor(
    private readonly customerRepository: ICustomerRepository,
    private readonly emailValidator: IEmailValidator
  ) {}

  // Implement the logic to create a customer
  public execute = async (data: CreateCustomerDTO) => {
    // Validate and transform the incoming data
    const validation = createCustomerSchema.safeParse(data);

    if (!validation.success) {
      throw new CustomerError("Invalid customer data");
    }

    const customer = this.mapToEntity(validation.data);

    await this.customerRepository.save(customer);

    return this.mapToDTO(customer);
  };

  private mapToEntity(customer: CreateCustomerDTO): Customer {
    const customerId: CustomerId = new CustomerId(customer.id);

    return new Customer({
      id: customerId,
      name: customer.name,
      email: new Email(customer.email, this.emailValidator),
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
