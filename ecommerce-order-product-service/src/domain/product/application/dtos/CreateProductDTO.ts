export interface CreateProductDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  sku: string;
}
