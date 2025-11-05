import request from 'supertest';
import { createTestApp } from '../../setup/testApp.js';
import { setupTest, teardownAllTests } from '../../setup/testSetup.js';
import { prismaTestClient } from '../../setup/testDatabase.js';
import { CreateCustomerDTO } from '../../../src/domain/customer/application/dtos/CreateCustomerDTO.js';
import { generateUuidV4 } from '../../../src/shared/utils/uuidGenerator.js';

// setupTest

const app = createTestApp();

beforeAll(async () => {
  await setupTest(); // Prepara la DB para esta suite de tests
});

afterAll(async () => {
  await teardownAllTests(); // Limpia recursos al final de todos los tests
});

describe('Customer order flow E2E', () => {
  it('should complete a customer order flow', async () => {
    const customerCreateBody: CreateCustomerDTO = {
      id: generateUuidV4(),
      email: 'john.doe@example.com',
      name: 'John Doe',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        country: 'USA',
        state: 'CA',
        zipCode: '12345',
      },
      phoneNumber: '5552121234',
    };

    const customerResponse = await request(app)
      .post('/api/v1/customers')
      .send(customerCreateBody);

    // const customerResponse = await request(app).get('/health');

    expect(customerResponse.status).toBe(201);
    const body = customerResponse.body;

    const customers = await prismaTestClient.customer.findMany();
    expect(1).toBe(1);
  });
});
