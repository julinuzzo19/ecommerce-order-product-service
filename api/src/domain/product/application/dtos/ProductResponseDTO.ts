export interface ProductResponseDTO {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  createdAt: Date;
  category: string;
  isAvailable: boolean;
}