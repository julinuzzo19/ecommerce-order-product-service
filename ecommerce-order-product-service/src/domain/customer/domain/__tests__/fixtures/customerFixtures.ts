import { generateUuidV4 } from "../../../../../shared/utils/uuidGenerator.js";
import { CustomerFixture } from "../factories/CustomerFactory.js";

export const validCustomerData: CustomerFixture = {
  id: generateUuidV4(),
  email: "john.doe@example.com",
  name: "John Doe",
  phoneNumber: "555-1234",
  address: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "US",
  },
};
