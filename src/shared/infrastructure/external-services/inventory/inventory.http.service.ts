import axios, { AxiosInstance } from 'axios';
import {
  IInventoryService,
  InventoryCheckParams,
  InventoryCheckResult,
} from '../../../services/inventory.service.interface.js';

export class InventoryHttpService implements IInventoryService {
  private client: AxiosInstance;

  constructor() {
    console.log({ gateway: process.env.GATEWAY_SECRET });
    // Configuración del cliente HTTP
    this.client = axios.create({
      //   baseURL: process.env.INVENTORY_SERVICE_URL,
      baseURL: process.env.GATEWAY_SERVICE + '/inventory',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'x-gateway-secret': process.env.GATEWAY_SECRET,
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
