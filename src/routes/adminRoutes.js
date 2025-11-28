import { Router } from "express";
import multer from "multer";
import { ensureAdmin } from "../middlewares/auth.js";
import {
  dashboard,
  adminProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminOrders,
  updateOrderStatus,
  getOrderDetail,
  adminUsers,
} from "../controllers/adminController.js";

const r = Router();

// nơi lưu ảnh sản phẩm
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/public/images/products"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

r.get("/", ensureAdmin, dashboard);

r.get("/products", ensureAdmin, adminProducts);
r.post("/products", ensureAdmin, upload.single("image"), adminCreateProduct);

r.post("/products/update", ensureAdmin, upload.single("image"), adminUpdateProduct);
r.post("/products/:id/delete", ensureAdmin, adminDeleteProduct);

r.get("/orders", ensureAdmin, adminOrders);
r.post("/orders/:id/status", ensureAdmin, updateOrderStatus);

// Chi tiết đơn hàng
r.get("/orders/:id", ensureAdmin, getOrderDetail);

r.get("/users", ensureAdmin, adminUsers);

export default r;
