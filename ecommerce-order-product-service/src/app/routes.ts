import { Router } from "express";
// // Importa los routers desde la capa de infraestructura de cada módulo.
import CustomerRouter from "../domain/customer/infrastructure/customer.routes.js";
import ProductRouter from "../domain/product/infrastructure/product.routes.js";
import OrderRouter from "../domain/order/infrastructure/order.routes.js";

/**
 * El router principal de la aplicación.
 * Este router es el "puente" entre el servidor y los routers de cada módulo.
 */
const router = Router();

/**
 * Define las rutas base para cada entidad.
 */
router.use("/customers", CustomerRouter);
router.use("/products", ProductRouter);
router.use("/orders", OrderRouter);

// Exporta el router principal para ser usado en el archivo del servidor.
export { router };
