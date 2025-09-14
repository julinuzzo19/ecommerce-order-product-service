import { z } from "zod";

export const createProductSchema = z.object({
  id: z.uuid({ version: "v4" }),
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().min(0),
  category: z.string().min(2).max(100),
  stockQuantity: z.number().min(0),
  sku: z.string().min(2).max(100),
});
