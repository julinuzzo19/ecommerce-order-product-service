import { z } from "zod";

export const createCustomerSchema = z.object({
  id: z.uuid({ version: "v4" }),
  name: z.string().min(2).max(100),
  email: z.email(),
  phoneNumber: z.string().min(10).max(15).optional(),
  address: z.object({
    street: z.string().min(5).max(200),
    city: z.string().min(2).max(100),
    state: z.string().min(2).max(100),
    zipCode: z.string().min(2).max(10),
    country: z.string().min(2).max(100),
  }),
});
