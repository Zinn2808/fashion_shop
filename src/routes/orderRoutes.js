// src/routes/orderRoutes.js
import express from "express";
import { ensureAuth } from "../middlewares/auth.js";
import { checkoutView, createOrder, momoSuccess, myOrders } from "../controllers/orderController.js";

const router = express.Router();

// src/routes/orderRoutes.js
router.get("/checkout", ensureAuth, checkoutView);
router.post("/checkout", ensureAuth, createOrder);
router.get("/momo/success", ensureAuth, momoSuccess);
router.get("/", ensureAuth, myOrders);
export default router;
