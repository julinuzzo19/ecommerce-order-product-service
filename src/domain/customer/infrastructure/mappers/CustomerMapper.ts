import { Prisma } from "@prisma/client";
import { Customer } from "../../domain/Customer.js";
import { CustomerId } from "../../../../shared/domain/value-objects/CustomerId.js";
import { Email } from "../../../../shared/domain/value-objects/Email.js";
import { Address } from "../../../../shared/domain/value-objects/Address.js";

export class CustomerMapper {
  static toPrisma(customer: Customer): Prisma.CustomerCreateInput {
    const address = customer.getAddress();
    return {
      id: customer.getId().value,
      name: customer.getName(),
      email: customer.getEmail().getValue(),
      address: {
        create: {
          street: address.getStreet(),
          city: address.getCity(),
          state: address.getState(),
          zipCode: address.getZipCode(),
          country: address.getCountry(),
          createdAt: new Date(),
        },
      },
      phoneNumber: customer.getPhoneNumber() || null,
      createdAt: customer.getCreatedAt(),
      isActive: customer.getIsActive(),
    };
  }

  static fromPrisma(
    data: Prisma.CustomerGetPayload<{ include: { address: true } }>
  ): Customer {
    return new Customer({
      id: new CustomerId(data.id),
      name: data.name,
      email: new Email(data.email),
      address: new Address(data.address),
      phoneNumber: data.phoneNumber || undefined,
      createdAt: data.createdAt,
      isActive: data.isActive,
    });
  }
}
