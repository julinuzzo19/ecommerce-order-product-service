import { CustomId } from '../../../../../shared/domain/value-objects/CustomId.js';
import { generateUuidV4 } from '../../../../../shared/utils/uuidGenerator.js';
import { Order } from '../../Order.js';

describe.skip('order domain', () => {
  it('add item to order', () => {
    const customerUUID = generateUuidV4();

    const order = new Order({
      customerId: new CustomId(customerUUID),
      orderNumber: 'ORD-1001',
    });

    order.addItem('sku-123', 2, 19.99);

    expect(order.getItems().length).toBe(1);
    expect(order.getItems()[0].getSku()).toBe('sku-123');
  });
});
