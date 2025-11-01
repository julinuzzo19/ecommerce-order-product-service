import { CustomerFactory } from "../factories/CustomerFactory.js";
import { validCustomerData } from "../fixtures/customerFixtures.js";

describe.skip("Customer Domain Entity", () => {
  it("should create a customer with valid properties", () => {
    /* Arrange */
    const factory = CustomerFactory.create(validCustomerData); // Usa fixture

    /* Act */
    const customer = factory.build();
    const addressCustomer = customer.getAddress();

    /* Assert */
    expect(customer.getId().value).toBe(validCustomerData.id);
    expect(customer.getEmail().getValue()).toBe(validCustomerData.email);
    expect(customer.getName()).toBe(validCustomerData.name);
    expect(customer.getPhoneNumber()).toBe(validCustomerData.phoneNumber);
    expect(customer.getIsActive()).toBe(true);
    expect(customer.getCreatedAt()).toBeInstanceOf(Date);
    expect(addressCustomer.getStreet()).toBe(
      validCustomerData?.address?.street
    );
    expect(addressCustomer.getCity()).toBe(validCustomerData?.address?.city);
    expect(addressCustomer.getState()).toBe(validCustomerData?.address?.state);
    expect(addressCustomer.getZipCode()).toBe(
      validCustomerData?.address?.zipCode
    );
    expect(addressCustomer.getCountry()).toBe(
      validCustomerData?.address?.country
    );
  });

  describe.each([
    {
      description: "valid customer",
      factoryConfig: (factory: CustomerFactory) => factory,
      expectedError: null,
    },
    {
      description: "invalid email",
      factoryConfig: (factory: CustomerFactory) => factory.withInvalidEmail(),
      expectedError: "Invalid email format",
    },
    {
      description: "empty name",
      factoryConfig: (factory: CustomerFactory) => factory.withName(""),
      expectedError: "Customer validation failed: Invalid name for customer",
    },
  ])("Customer creation: $description", ({ factoryConfig, expectedError }) => {
    it("should handle creation accordingly", () => {
      const factory = CustomerFactory.create(validCustomerData); // Usa fixture
      const configuredFactory = factoryConfig(factory);

      /* Act & Assert */
      if (expectedError) {
        expect(() => configuredFactory.build()).toThrow(expectedError);
      } else {
        const customer = configuredFactory.build();
        expect(customer).toBeDefined();
        expect(customer.getIsActive()).toBe(true);
      }
    });
  });
});
