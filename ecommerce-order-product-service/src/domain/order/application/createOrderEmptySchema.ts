import { z } from "zod";

export const createOrderEmptySchema = z.object({
  id: z.uuid({ version: "v4" }),
  customerId: z.uuid({ version: "v4" }),
  orderNumber: z.string().min(2).max(100),
  status: z.enum(["PENDING", "PAID", "SHIPPED", "CANCELLED"]),
});
