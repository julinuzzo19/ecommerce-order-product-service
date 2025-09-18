import { Customer } from "../domain/Customer.js";
import { ICustomerRepository } from "../domain/ICustomerRepository.js";

import { CustomerResponseDTO } from "./dtos/CustomerResponseDTO.js";

export class GetCustomersUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  public execute = async (): Promise<CustomerResponseDTO[]> => {
    const customers = await this.customerRepository.findAll();
    return customers.map(this.mapToDTO);
  };

  private mapToDTO(customer: Customer): CustomerResponseDTO {
    const addressCustomer = customer.getAddress();

    return {
      id: customer.getId().value,
      name: customer.getName(),
      email: customer.getEmail().getValue(),
      phoneNumber: customer.getPhoneNumber(),
      address: {
        city: addressCustomer.getCity(),
        country: addressCustomer.getCountry(),
        state: addressCustomer.getState(),
        street: addressCustomer.getStreet(),
        zipCode: addressCustomer.getZipCode(),
      },
    };
  }
}
