import axios, { AxiosInstance } from 'axios';
import {
  IInventoryService,
  InventoryCheckParams,
  InventoryCheckResult,
} from '../../../services/inventory.service.interface.js';

export class InventoryHttpService implements IInventoryService {
  private client: AxiosInstance;

  constructor() {
    // Configuración del cliente HTTP
    this.client = axios.create({
      //   baseURL: process.env.INVENTORY_SERVICE_URL,
      baseURL: 'http://ecommerce-inventory-service:3011/api/v1/inventory',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${process.env.INVENTORY_SERVICE_TOKEN}`
      },
    });
  }

  async checkAvailability(
    items: InventoryCheckParams,
  ): Promise<InventoryCheckResult> {
    try {
      const response = await this.client.post('/check-stock', items);
      return response.data as InventoryCheckResult;
    } catch (error) {
      throw new Error(
        `Error checking inventory availability: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
}
