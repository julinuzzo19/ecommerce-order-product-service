import { z } from "zod";

export const CreateOrUpdateOrderWithItemsSchema = z.object({
  id: z.uuid({ version: "v4" }),
  customerId: z.uuid({ version: "v4" }),
  orderNumber: z.string().min(2).max(100),
  status: z.enum(["PENDING", "PAID", "SHIPPED", "CANCELLED"]),
  items: z.array(
    z.object({
      productId: z.uuid({ version: "v4" }),
      quantity: z.number().min(1),
    })
  ),
});
