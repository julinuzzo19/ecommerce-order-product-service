export interface IOrderItem {
  getId(): string;
  getOrderNumber(): string;
  getProductId(): string;
  getQuantity(): number;
  getPrice(): number;
  getTotalPrice(): number;
}
