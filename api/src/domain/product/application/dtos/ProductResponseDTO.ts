export interface ProductResponseDTO {
  id: string;
  sku: string;
  name: string;
  description: string | undefined;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  createdAt: Date;
  category: string;
  isAvailable: boolean;
}
