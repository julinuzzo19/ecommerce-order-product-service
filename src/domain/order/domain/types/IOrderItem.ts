export interface IOrderItem {
  getId(): string;
  getOrderNumber(): string;
  getSku(): string;
  getQuantity(): number;
  getPrice(): number;
  getTotalPrice(): number;
}
