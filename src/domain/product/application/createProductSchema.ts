import { z } from "zod";

export const createProductSchema = z.object({
  id: z.uuid({ version: "v4" }),
  name: z.string().min(2).max(100),
  description: z.string().max(1000),
  price: z.number().min(0),
  category: z.string().min(2).max(100),
  sku: z.string().min(2).max(100),
});
