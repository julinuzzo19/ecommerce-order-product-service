import { CustomerError } from "../domain/errors/CustomerError.js";
import { ICustomerRepository } from "../domain/ICustomerRepository.js";
import { createCustomerSchema } from "./createCustomerSchema.js";
import { CreateCustomerDTO } from "./dtos/CreateCustomerDTO.js";
import { Customer } from "../domain/Customer.js";
import { CustomerId } from "../domain/value-objects/CustomerId.js";
import { Email } from "../../../shared/value-objects/Email.js";
import { Address } from "../../../shared/value-objects/Address.js";
import { IEmailValidator } from "../../../shared/value-objects/IEmailValidator.js";

export class CreateCustomerUseCase {
  constructor(
    private readonly customerRepository: ICustomerRepository,
    private readonly emailValidator: IEmailValidator
  ) {}

  // Implement the logic to create a customer
  public execute = async (data: CreateCustomerDTO) => {
    console.log({ data });
    // Validate and transform the incoming data
    const validation = createCustomerSchema.safeParse(data);

    console.log({ error: validation.error });

    if (!validation.success) {
      throw new CustomerError("Invalid customer data");
    }

    const customer = this.mapToEntity(validation.data);

    await this.customerRepository.save(customer);

    return customer;
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
}
