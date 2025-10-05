import { genericMapToDTO } from "../../../shared/utils/genericMapper.js";
import { Customer } from "../domain/Customer.js";
import { CustomerDomainException } from "../domain/exceptions/CustomerDomainException.js";
import { ICustomerRepository } from "../domain/ICustomerRepository.js";
import { CustomerResponseDTO } from "./dtos/CustomerResponseDTO.js";
import { CustomerApplicationExceptions } from "./exceptions/CustomerApplicationExceptions.js";

export class GetCustomersUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  public execute = async (): Promise<CustomerResponseDTO[]> => {
    try {
      const customers = await this.customerRepository.findAll();
      return customers.map(this.mapToDTO);
    } catch (error) {
      if (
        error instanceof CustomerDomainException ||
        error instanceof CustomerApplicationExceptions
      ) {
        throw error;
      }
      throw CustomerApplicationExceptions.useCaseError(
        "getting customers",
        error instanceof Error ? error.message : String(error)
      );
    }
  };

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
