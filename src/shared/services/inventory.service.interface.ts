export interface InventoryCheckResult {
  message: string;
  available: boolean;
}
export type InventoryCheckParams = {
  sku: string;
  quantity: number;
}[];

export interface IInventoryService {
  checkAvailability(items: InventoryCheckParams): Promise<InventoryCheckResult>;
}
