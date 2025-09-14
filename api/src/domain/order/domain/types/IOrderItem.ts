export interface IOrderItem {
  getProductId(): string;
  getQuantity(): number;
  getPrice(): number;
  getTotalPrice(): number;
}
